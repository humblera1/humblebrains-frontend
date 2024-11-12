import { defineStore } from 'pinia';
import { MatrixStateEnum } from '~/entities/enums/games/matrix/MatrixStateEnum';
import type { IMatrixLevel } from '~/entities/interfaces/games/matrix/IMatrixLevel';

export const useMatrixStore = defineStore('matrixStorage', () => {
    /**
     * Константа определяет время, после которого неправильно открытая ячейка вновь будет закрыта.
     */
    const TIME_TO_CLOSE_INCORRECT_CELL: number = 1000;

    /**
     * Константа определяет время, за которое ячейка удаляется с поля после завершения уровня.
     */
    const TIME_TO_DESTROY_CELL: number = 150;

    /**
     * Константа определяет время, за которое ячейка появляется на поле после завершения уровня.
     */
    const TIME_TO_BUILD_CELL: number = 150;

    /**
     * Время между поворотами поля.
     */
    const ROTATION_ITERATION_TIME: number = 500;

    /**
     * Время между появлениями ячеек на поле.
     */
    const TIME_TO_COLORIZE_CELL = 350;

    /**
     * Базовый стор, работает с логикой, общей для всех игр
     */
    const game = useGameStore();

    /**
     * Состояние текущего стора.
     */
    const state = ref<MatrixStateEnum>(MatrixStateEnum.default);

    /**
     * Активный цвет раунда: ячейки данного цвета пользователю необходимо запоминать в текущем раунде.
     */
    const activeRoundColor = ref<string>('');

    /**
     * Угол поворота игрового поля в градусах. При его изменении игровое поле совершает поворот на указанное количество градусов.
     */
    const rotationDegree = ref<number>(0);

    /**
     * Ограниченное количество возможных цветов на текущем уровне в зависимости от colorsAmount.
     */
    let availableLevelColors: string[] = [];

    /**
     * Все правильно открытые ячейки.
     */
    const correctlyOpenedCells = ref<Set<number>>(new Set());

    /**
     * Неправильно открытые ячейки. Ячейки удаляются из массива спустя TIME_TO_CLOSE_INCORRECT_CELL, чтобы показать анимацию закрытия на поле.
     */
    const incorrectlyOpenedCells = ref<Set<number>>(new Set());

    /**
     * Все окрашенные ячейки.
     * Ключами объекта выступают номера ячеек, а значениями соответствующий им цвет.
     */
    const colorizedCells = ref<Map<number, string>>(new Map());

    /**
     * Массив номеров ячеек, расположенных в порядке их показа пользователю.
     * Устанавливается в методе colorizeCells, который ответственен за показ ячеек.
     */
    const orderedCells = ref<number[]>([]);

    /**
     * Массив ячеек, которым добавляется класс, плавно снижающий прозрачность.
     * Используется при смене уровня, для анимации исчезновения поля перед перестроением.
     */
    const destroyedCells = ref<number[]>([]);

    /**
     * Дополнительная переменная, необходимая для реализации анимации сокрытия верно открытых ячеек.
     */
    const coveredCells = ref<number[]>([]);

    /**
     * Справочные константы, которые будут приходить с бэка вместе с набором уровней.
     * todo:
     */
    const availableColors: string[] = ['#59AF8E', '#E9CA6D', '#EE8670', '#C38AC1', '#9BC4F8', '#6878DE'];

    /**
     * Идентификатор таймера, ответственного за сокрытие верно открытых ячеек.
     */
    let coveringTimerId: ReturnType<typeof setTimeout> | null = null;

    /**
     * Идентификатор таймера, ответственного за последовательный поворот игрового поля.
     */
    let rotatingTimerId: ReturnType<typeof setTimeout> | null = null;

    /**
     * Идентификатор таймера, ответственного за последовательное сокрытие при завершении уровня.
     */
    let destroyingTimerId: ReturnType<typeof setTimeout> | null = null;

    /**
     * Идентификатор таймера, ответственного за последовательный показ ячеек в начале уровня.
     */
    let buildingTimerId: ReturnType<typeof setTimeout> | null = null;

    /**
     * Идентификатор таймера, ответственного за последовательный показ ячеек для запоминания.
     */
    let colorizingTimerId: ReturnType<typeof setTimeout> | null = null;

    /**
     * Возвращает текущий уровень. Прокси, сужающий тип.
     */
    const currentLevel = computed((): IMatrixLevel => {
        return game.currentLevel as IMatrixLevel;
    });

    /** ************************************************************************************************************************ Проверки */

    /**
     * Проверяет возможность открытия ячейки: игра находится в состоянии взаимодействия с пользователем,
     * при этом, в данный момент не происходит поворота игрового поля.
     */
    const canTheCellBeOpened = (cellNumber: number): boolean => {
        return game.isInInteractiveState() && !isInRotatingState() && !isCellOpened(cellNumber);
    };

    /**
     * Проверяет, окрашена ли ячейка в какой-либо цвет.
     * @param cellNumber
     */
    const isCellColorized = (cellNumber: number): boolean => {
        return colorizedCells.value.has(cellNumber);
    };

    /**
     * Проверяет, что цвет ячейки соответствует цвету, который выбран в текущем раунде активным.
     * @param cellNumber
     */
    const isCellColorCorrect = (cellNumber: number): boolean => {
        return activeRoundColor.value === colorizedCells.value.get(cellNumber);
    };

    /**
     * Проверяет, какая по счёту ячейка была открыта.
     * Затем сравнивает номер ячейки с номером, расположенным в массиве упорядоченных номеров под соответствующим индексом.
     * @param cellNumber
     */
    const isCellOrderCorrect = (cellNumber: number): boolean => {
        if (currentLevel.value.hasDirection) {
            const cellOrder = correctlyOpenedCells.value.size;

            return orderedCells.value[cellOrder] === cellNumber;
        }

        return true;
    };

    /**
     * Проверяет, корректно ли будет открыта ячейка.
     * @param cellNumber
     */
    const isCellCorrect = (cellNumber: number): boolean => {
        if (correctlyOpenedCells.value.has(cellNumber)) {
            return true;
        }

        if (incorrectlyOpenedCells.value.has(cellNumber)) {
            return false;
        }

        return isCellColorized(cellNumber) && isCellColorCorrect(cellNumber) && isCellOrderCorrect(cellNumber);
    };

    /**
     * Проверяет, открыта ли ячейка под переданным номером.
     * @param cellNumber
     */
    const isCellOpened = (cellNumber: number): boolean => {
        return correctlyOpenedCells.value.has(cellNumber) || incorrectlyOpenedCells.value.has(cellNumber);
    };

    /**
     * Механизм сокрытия ячеек: скрываем в состояниях смены уровня при наличии номера в массиве destroyedCells.
     * @param cellNumber
     */
    const isCellHidden = (cellNumber: number): boolean => {
        return (
            (game.isInLevelFinishingState() || game.isInLevelPreparingState() || game.isInGameFinishingState()) &&
            destroyedCells.value.includes(cellNumber)
        );
    };

    /**
     * Проверяет, скрыта ли верно открытая ячейка под переданным номером.
     * @param cellNumber
     */
    const isCellCovered = (cellNumber: number): boolean => {
        return coveredCells.value.includes(cellNumber);
    };

    /**
     * Проверяет, находится ли игра в состоянии поворота игрового поля
     */
    const isInRotatingState = (): boolean => {
        return state.value === MatrixStateEnum.rotating;
    };

    /**
     * Определяет все ли правильные ячейки были открыты пользователем.
     */
    const isTimeToFinishRound = (): boolean => {
        return correctlyOpenedCells.value.size === currentLevel.value.cellsAmountToReproduce;
    };

    /**
     * Стоит ли показывать цвет ячейки: да, если игра в состоянии 'contemplation' или 'roundPreparing' и ячейка была раскрашена.
     */
    const showColorizedCell = (cellNumber: number): boolean => {
        return (game.isInContemplationState() || game.isInRoundPreparingState()) && isCellColorized(cellNumber);
    };

    /**
     * Будет ли отображена ячейка с корректным ответом: да, если она является правильной ячейкой и уже была открыта пользователем.
     * @param cellNumber
     */
    const showCorrectlyOpenedCell = (cellNumber: number): boolean => {
        return isCellOpened(cellNumber) && isCellCorrect(cellNumber);
    };

    /**
     * Будет ли отображена ячейка с некорректным ответом: да, если она не является правильной ячейкой и уже была открыта пользователем.
     * @param cellNumber
     */
    const showIncorrectlyOpenedCell = (cellNumber: number): boolean => {
        return isCellOpened(cellNumber) && !isCellCorrect(cellNumber);
    };

    /** ********************************************************************************************************** Вспомогательные методы */

    /**
     * Устанавливает переданное состояние
     * @param stateToSet
     */
    const setState = (stateToSet: MatrixStateEnum): void => {
        state.value = stateToSet;
    };

    /**
     * Устанавливает состояние, сигнализирующее о том, что в данный момент осуществляется поворот игрового поля
     */
    const setRotatingState = (): void => {
        setState(MatrixStateEnum.rotating);
    };

    /**
     * Устанавливает состояние по умолчанию
     */
    const setDefaultState = (): void => {
        setState(MatrixStateEnum.default);
    };

    /**
     * Случайным образом устанавливает цвета, которые будут фигурировать в текущем уровне
     */
    const setupLevelColors = (): void => {
        const colors = useShuffle(availableColors);
        availableLevelColors = colors.splice(1, currentLevel.value.colorsAmount);
    };

    /**
     * Устанавливает цвет, ячейки которого необходимо запоминать пользователю в данном раунде
     * Значение выбирается случайным образом из массива доступных цветов levelColors
     */
    const setupRoundColor = (): void => {
        activeRoundColor.value = useSample(availableLevelColors) as string;
    };

    /**
     * Возвращает массив всех допустимых номеров ячеек в порядке возрастания, основываясь на значении squareSide.
     */
    const generateAvailableNumbers = (): number[] => {
        return useRange(1, currentLevel.value.squareSide ** 2 + 1);
    };

    /**
     * Отвечает за закрытие всех правильно открытых ячеек на игровом поле.
     * Для сокрытия ячеек с верным ответом используется другая анимация, поэтому используется дополнительная переменная coveredCells.
     */
    const clearCorrectlyOpenedCells = (): Promise<void> => {
        return new Promise((resolve) => {
            coveringTimerId = setTimeout(() => {
                coveredCells.value.push(...Array.from(correctlyOpenedCells.value)); // first hide opened cells

                coveringTimerId = setTimeout(() => {
                    correctlyOpenedCells.value.clear(); // then clear hidden correctly opened cells without any animation

                    coveringTimerId = setTimeout(() => {
                        coveredCells.value.length = 0; // and then return animation styles
                        resolve();
                    }, 250);
                }, 500);
            }, 750);
        });
    };

    /**
     * Очищает массив, хранящий номера ячеек, которые были окрашены в текущем раунде.
     */
    const clearColorizedCells = (): void => {
        colorizedCells.value.clear();
    };

    /**
     * Очищает массив, хранящий порядок показа ячеек в текущем раунде.
     */
    const clearOrderedCells = (): void => {
        orderedCells.value = [];
    };

    /**
     * Добавляет номера ячеек в массив destroyedCells с интервалом TIME_TO_DESTROY_CELL.
     * Ячейкам, находящимся в данном массиве, присваивается особый класс, отвечающий за их сокрытие на поле.
     */
    const destroyField = (): Promise<void> => {
        const cellNumbers = useShuffle(generateAvailableNumbers());

        return new Promise((resolve) => {
            const destroy = async () => {
                if (game.isInPauseState()) {
                    await game.getPausePromise();
                }

                if (cellNumbers.length !== 0) {
                    const cellToDestroy = cellNumbers.pop() as number;
                    destroyedCells.value.push(cellToDestroy);

                    destroyingTimerId = setTimeout(destroy, TIME_TO_DESTROY_CELL);
                } else {
                    resolve();
                }
            };

            destroyingTimerId = setTimeout(destroy, TIME_TO_DESTROY_CELL);
        });
    };

    /**
     * Удаляет номера ячеек из массива destroyedCells с интервалом TIME_TO_BUILD_CELL.
     */
    const buildField = (): Promise<void> => {
        return new Promise((resolve) => {
            const build = async () => {
                if (game.isInPauseState()) {
                    await game.getPausePromise();
                }

                if (destroyedCells.value.length !== 0) {
                    destroyedCells.value.splice(0, 2);

                    buildingTimerId = setTimeout(build, TIME_TO_BUILD_CELL);
                } else {
                    resolve();
                }
            };

            buildingTimerId = setTimeout(build, TIME_TO_BUILD_CELL);
        });
    };

    /**
     * Занимается перестроением поля при смене уровня: сначала в массив fadingCells поочередно добавляются номера ячеек,
     * которые исчезают с поля.
     */
    const rebuildField = (): Promise<void> => {
        return new Promise((resolve) => {
            destroyField().then(() => {
                destroyedCells.value = useShuffle(generateAvailableNumbers());

                buildField().then(() => resolve());
            });
        });
    };

    /**
     * Осуществляет поворот игрового поля.
     */
    const rotateField = (): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (isInRotatingState()) {
                return reject(new Error('The field is already in the rotating state'));
            }

            setRotatingState();

            let iterations = 0;
            const rotate = async () => {
                if (game.isInPauseState()) {
                    await game.getPausePromise();
                }

                if (iterations < currentLevel.value.rotationIterations) {
                    if (Math.random() < 0.5) {
                        rotationDegree.value += 90;
                    } else {
                        rotationDegree.value -= 90;
                    }

                    iterations++;

                    rotatingTimerId = setTimeout(rotate, ROTATION_ITERATION_TIME);
                } else {
                    resolve();
                }
            };

            rotatingTimerId = setTimeout(rotate, ROTATION_ITERATION_TIME);
        });
    };

    /**
     * Возвращает цвет конкретной ячейки.
     * @param cellNumber
     */
    const getCellColor = (cellNumber: number): string => {
        // @ts-ignore
        return colorizedCells.value.has(cellNumber) ? colorizedCells.value.get(cellNumber) : '';
    };

    /**
     *
     * @param cellNumber
     * @param color
     */
    const colorizeCell = (color: string, cellNumber: number): void => {
        if (color === activeRoundColor.value) {
            orderedCells.value.push(cellNumber);
        }

        colorizedCells.value.set(cellNumber, color);
    };

    /**
     * Раскрашиваем ячейки: с интервалом TIME_TO_COLORIZE_CELL добавляем в colorizedCells номер ячейки в качестве ключа
     * и цвет ячейки под этим номером в виде значения.
     */
    const colorizeCells = (): Promise<void> => {
        return new Promise((resolve) => {
            const availableNumbers = generateAvailableNumbers();

            // Получаем массивы допустимых цветов и номеров, которые мы можем использовать для раскрашивания
            const shuffledNumbers = useShuffle(availableNumbers);
            const shuffledColors = useShuffle(availableLevelColors);

            const colorsAndNumbers: [string, number][] = [];

            for (const color of shuffledColors) {
                let numberIterations = 0;
                for (const number of shuffledNumbers) {
                    if (numberIterations >= currentLevel.value.cellsAmountToReproduce) {
                        shuffledNumbers.slice(0, numberIterations);
                        continue;
                    }

                    colorsAndNumbers.push([color, number]);

                    numberIterations++;
                }
            }

            const addNumber = async () => {
                if (game.isInPauseState()) {
                    await game.getPausePromise();
                }

                if (colorsAndNumbers.length !== 0) {
                    const elem = colorsAndNumbers.pop() as [string, number];
                    colorizeCell(elem[0], elem[1]);

                    colorizingTimerId = setTimeout(addNumber, TIME_TO_COLORIZE_CELL);
                } else {
                    resolve();
                }
            };

            colorizingTimerId = setTimeout(addNumber, TIME_TO_COLORIZE_CELL);
        });
    };

    /**
     * Вызывается по готовности пользователя воспроизвести показанные ячейки.
     */
    const switchToInteractive = async (): Promise<void> => {
        if (currentLevel.value.rotationIterations !== 0) {
            rotateField().then(() => setDefaultState());
        }

        await game.handleInteractive();

        game.markRoundAsFailed();
        await finishRound();
    };

    /** ******************************************************************************************************** Обработка открытия ячеек */

    /**
     * Инициирует открытие ячейки, если это возможно
     * @param cellNumber
     */
    const handleCellOpening = async (cellNumber: number): Promise<void> => {
        if (canTheCellBeOpened(cellNumber)) {
            game.handleAnswering();

            if (isCellCorrect(cellNumber)) {
                await handleCorrectCellOpening(cellNumber);
            } else {
                handleIncorrectCellOpening(cellNumber);
            }
        }
    };

    /**
     * Обрабатывает открытие правильной ячейки.
     * @param cellNumber
     */
    const handleCorrectCellOpening = async (cellNumber: number): Promise<void> => {
        correctlyOpenedCells.value.add(cellNumber);

        if (isTimeToFinishRound()) {
            await finishRound();
        }
    };

    /**
     * Обрабатывает открытие неверной ячейки.
     * @param cellNumber
     */
    const handleIncorrectCellOpening = (cellNumber: number): void => {
        incorrectlyOpenedCells.value.add(cellNumber);

        game.handleIncorrectAnswering();

        setTimeout(() => incorrectlyOpenedCells.value.delete(cellNumber), TIME_TO_CLOSE_INCORRECT_CELL);
    };

    /** ****************************************************************************************************** Обработка изменений раунда */

    /**
     * Завершает раунд: устанавливает состояние roundFinishing, проверяет необходимость изменения уровня, начинает новый раунд.
     */
    const finishRound = async () => {
        game.handleRoundFinishing();

        await Promise.all([clearRoundData(), handleRoundFinishing()]);
        await startNewRound();
    };

    /**
     * Очищает информацию о ячейках перед началом нового раунда.
     */
    const clearRoundData = async () => {
        await clearCorrectlyOpenedCells();

        clearColorizedCells();
        clearOrderedCells();
    };

    /**
     * Обрабатывает события смены режима, уровня и завершения игры.
     */
    const handleRoundFinishing = async () => {
        await game.checkMode();
        if (game.isGameTimeOver) {
            await finishGame();

            return;
        }

        if (game.isTimeToChangeLevel()) {
            await changeLevel();
        }
    };

    /**
     * Начинает новый раунд игры.
     */
    const startNewRound = async () => {
        game.handleRoundPreparing();

        setupRoundColor();

        await colorizeCells();
        await game.handleContemplation();

        await switchToInteractive();
    };

    /** ****************************************************************************************************** Обработка изменений уровня */

    /**
     * Изменяет уровень игры: отвечает за установку нового уровня, установку цветов,
     * а также за анимации перестроения поля и обратного отсчёта.
     */
    const changeLevel = async () => {
        game.handleLevelChanging();

        setupLevelColors();
        await rebuildField();

        await game.handleLevelPreparing();
    };

    /**
     * Количество ячеек на игровом поле.
     */
    const cellsAmount = computed((): number => {
        return currentLevel.value.squareSide ** 2;
    });

    const squareSide = computed((): number => {
        return currentLevel.value.squareSide;
    });

    /**
     * Вызывается для завершения игры
     */
    const finishGame = async () => {
        await destroyField();
        await game.handleGameFinishingState();
    };

    const resetCoveringTimer = () => {
        if (coveringTimerId) {
            clearTimeout(coveringTimerId);
            coveringTimerId = null;
        }
    };

    const resetRotatingTimer = () => {
        if (rotatingTimerId) {
            clearTimeout(rotatingTimerId);
            rotatingTimerId = null;
        }
    };

    const resetColorizingTimer = () => {
        if (colorizingTimerId) {
            clearTimeout(colorizingTimerId);
            colorizingTimerId = null;
        }
    };

    const resetDestroyingTimer = () => {
        if (destroyingTimerId) {
            clearTimeout(destroyingTimerId);
            destroyingTimerId = null;
        }
    };

    const resetBuildingTimer = () => {
        if (buildingTimerId) {
            clearTimeout(buildingTimerId);
            buildingTimerId = null;
        }
    };

    const resetAllTimers = () => {
        resetCoveringTimer();
        resetRotatingTimer();
        resetColorizingTimer();
        resetDestroyingTimer();
        resetBuildingTimer();
    };

    const $setup = async () => {
        setupLevelColors();
        setupRoundColor();

        await game.handleLevelPreparing();
        await startNewRound();
    };

    const $reset = () => {
        resetAllTimers();
        setDefaultState();
        clearColorizedCells();
        clearOrderedCells();

        correctlyOpenedCells.value = new Set();
        incorrectlyOpenedCells.value = new Set();
        rotationDegree.value = 0;

        destroyedCells.value = [];
        coveredCells.value = [];

        game.$reset();
    };

    return {
        isCellOpened,
        isCellHidden,
        isCellCovered,
        showColorizedCell,
        showCorrectlyOpenedCell,
        showIncorrectlyOpenedCell,

        handleCellOpening,
        getCellColor,
        switchToInteractive,

        rotationDegree,
        cellsAmount,
        squareSide,

        $setup,
        $reset,

        coveredCells,
    };
});
