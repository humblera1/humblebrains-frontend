import { defineStore } from 'pinia';
import type { IMatrixLevel } from '~/entities/interfaces/games/matrix/IMatrixLevel';
import type { IGameLevels } from '~/entities/interfaces/games/IGameLevels';

export const useMatrixStore = defineStore('matrixStorage', () => {
    const gameStore = useGameStore();

    /**
     * Все открытые пользователем ячейки, включая неправильные, которые удаляются из массива спустя определённое время.
     * Нужен для анимации игрового поля (открывать/закрывать ячейки).
     */
    // const openedCells = ref<Set<number>>(new Set());

    /**
     * Все правильно открытые ячейки.
     * Нужен исключительно для внутренней проверки (correctAnswersBeforePromotion === correctlyOpenedCells.size).
     */
    const correctlyOpenedCells = ref<Set<number>>(new Set());

    /**
     * todo: experimental
     */
    const incorrectlyOpenedCells = ref<Set<number>>(new Set());

    /**
     * Массив ячеек, которым добавляется класс, плавно снижающий прозрачность.
     * Используется при смене уровня, для анимации исчезновения поля перед перестроением.
     */
    const hiddenCells = ref<number[]>([]);

    /**
     * Сигнализирует о том, что в раунде была допущена ошибка при открытии ячеек
     */
    const isRoundFailed = ref<boolean>(false);

    /**
     * Все окрашенные ячейки.
     * Ключами объекта выступают номера ячеек, а значениями соответствующий им цвет.
     */
    const colorizedCells = ref<Map<number, string>>(new Map());

    /**
     * Количество раундов, в которых был дан правильный ответ.
     */
    let successfulRoundsStreak: number = 0;

    /**
     * Количество раундов, в которых был дан неправильный ответ.
     */
    let unsuccessfulRoundsStreak: number = 0;

    /**
     * Ограниченное количество возможных цветов на текущем уровне в зависимости от colorsAmount.
     */
    let levelColors: string[] = [];

    /**
     * Массив номеров ячеек, расположенных в порядке их показа пользователю. Устанавливается в методе colorizeCells.
     */
    const orderedNumbers = ref<number[]>([]);

    /**
     * Ячейки данного цвета пользователю необходимо запоминать в текущем раунде.
     */
    const activeRoundColor = ref<string>('');

    /**
     * Угол поворота игрового поля в градусах. При его изменении игровое поле совершает поворот на указанное количество градусов.
     */
    const rotationDegree = ref<number>(180);

    /**
     * Сигнализирует о том, что поле находится в состоянии вращения.
     * Добавлено для того, чтобы отключить интерактив на момент поворота поля.
     */
    const isRotating = ref<boolean>(false);

    /**
     * Номер текущего уровня пользователя
     */
    const currentLevelNumber = ref<number>(0);

    /**
     * Текущий уровень пользователя
     */
    const currentLevel = ref<IMatrixLevel>({
        squareSide: 0,
        cellsAmountToReproduce: 0,
        colorsAmount: 0,
        correctAnswersBeforePromotion: 0,
        incorrectAnswersBeforeDemotion: 0,
        pointsForAnswer: 0,
        rotationIterations: 0,
        hasDirection: false,
    });

    /**
     * Набор уровней приходит с бэка, текущий выбирается на основании уровня игрока.
     */
    const levels: IGameLevels<IMatrixLevel> = {
        1: {
            squareSide: 4,
            cellsAmountToReproduce: 2,
            colorsAmount: 2,
            correctAnswersBeforePromotion: 20,
            incorrectAnswersBeforeDemotion: 2,
            pointsForAnswer: 10,
            rotationIterations: 0,
            hasDirection: true,
        },
        2: {
            squareSide: 4,
            cellsAmountToReproduce: 3,
            colorsAmount: 3,
            correctAnswersBeforePromotion: 5,
            incorrectAnswersBeforeDemotion: 2,
            pointsForAnswer: 20,
            rotationIterations: 3,
            hasDirection: false,
        },
    };

    /**
     * Справочные константы, которые придут с бэка вместе с набором уровней.
     */
    const availableColors: string[] = ['#59AF8E', '#E9CA6D', '#EE8670', '#C38AC1', '#9BC4F8', '#6878DE'];

    const startNewRound = () => {
        isRoundFailed.value = false;

        // Переворачиваем все открытые ячейки
        clearOpenedCells().then(() => {
            // Возвращаем поле в исходное положение
            // todo: найти баг вот тут
            // rotationDegree.value = 0;

            // Убираем цветные ячейки (пока стор в состоянии завершения и их не видно на поле)
            discolorCells();

            // Очищаем массивы с ответами
            clearCorrectlyOpenedCells();
            orderedNumbers.value = [];
            setActiveColor();

            gameStore.setRoundPreparingState();

            // Заново раскрашиваем ячейки
            colorizeCells().then(() => {
                gameStore.setContemplationState();
            });
        });
    };

    /**
     * todo:
     */
    const setLevel = () => {
        currentLevelNumber.value = 1;
        currentLevel.value = levels[currentLevelNumber.value];
    };

    /**
     * Случайным образом устанавливает цвета, которые будут фигурировать в текущем уровне
     */
    const setLevelColors = (): void => {
        const colors = useShuffle(availableColors);
        levelColors = colors.splice(1, currentLevel.value.colorsAmount);
    };

    /**
     * Устанавливает цвет, ячейки которого необходимо запоминать пользователю в данном раунде
     * Значение выбирается случайным образом из массива доступных цветов levelColors
     */
    const setActiveColor = (): void => {
        activeRoundColor.value = levelColors[Math.floor(Math.random() * levelColors.length)];
    };

    /**
     * Последовательно удаляет номера открытых ячеек один за одним с небольшой задержкой
     */
    const clearOpenedCells = (): Promise<void> => {
        return new Promise((resolve) => {
            const iterator = correctlyOpenedCells.value.values();
            const intervalId = setInterval(() => {
                const result = iterator.next();
                if (result.done) {
                    clearInterval(intervalId);
                    resolve();
                }
                correctlyOpenedCells.value.delete(result.value);
            }, 250);
        });
    };

    /**
     *
     */
    const clearCorrectlyOpenedCells = () => {
        correctlyOpenedCells.value.clear();
    };

    /**
     * Очищает коллекцию закрашенных ячеек
     */
    const discolorCells = () => {
        colorizedCells.value.clear();
    };

    const setMatrixStore = () => {
        // level maybe
        gameStore.setRoundPreparingState();

        setLevel();
        setLevelColors();
        setActiveColor();

        colorizeCells().then(() => {
            gameStore.setContemplationState();
        });

        // Установка состояния...
    };

    /**
     * Раскрашиваем ячейки: с определнным интервалом добавляем в colorizedCells номер ячейки в качестве ключа
     * и цвет ячейки под этим номером в виде значения.
     */
    const colorizeCells = (): Promise<void> => {
        const availableNumbers = generateAvailableNumbers();

        // Получаем массивы допустимых цветов и номеров, которые мы можем использовать для раскрашивания
        const shuffledNumbers = useShuffle(availableNumbers);
        const shuffledColors = useShuffle(levelColors);

        return new Promise((resolve) => {
            let colorsIndex = 0;

            // Итерируем по массиву цветов, пока не упремся в colorsAmount
            // Пока не кончатся цвета, мы итерируем по допустимым номерам, составляя комбинации на основании cellsAmountToReproduce
            // Если цвета закончились, возвращаем успешно завершённый промис
            const addColors = () => {
                if (colorsIndex < currentLevel.value.colorsAmount) {
                    const color = shuffledColors.pop() as string;

                    addNumbers(color, 0, () => {
                        colorsIndex++;
                        setTimeout(addColors, 0);
                    });
                } else {
                    resolve();
                }
            };

            // Получаем цвет из внешнего цикла и функцию, в которую мы вернемся по окончании итерации
            // Пока не наберётся нужно количество номеров (cellsAmountToReproduce), продолжаем добавлять номера переданнымому цвету
            const addNumbers = (color: string, numbersIndex: number, resolveAddColors: () => void) => {
                if (numbersIndex < currentLevel.value.cellsAmountToReproduce) {
                    const number = shuffledNumbers.pop() as number;
                    numbersIndex++;

                    colorizeCell(number, color);

                    setTimeout(() => addNumbers(color, numbersIndex, resolveAddColors), 200);
                } else {
                    resolveAddColors();
                }
            };

            setTimeout(() => addColors(), 500);
        });
    };

    /**
     * Возвращает массив всех допустимых номеров ячеек в порядке возрастания, основываясь на значении squareSide
     */
    const generateAvailableNumbers = (): number[] => {
        return useRange(1, currentLevel.value.squareSide ** 2 + 1);
    };

    const colorizeCell = (cellNumber: number, color: string): void => {
        if (color === activeRoundColor.value) {
            orderedNumbers.value.push(cellNumber);
        }

        colorizedCells.value.set(cellNumber, color);
    };

    const getCellColor = (cellNumber: number): string => {
        return colorizedCells.value.get(cellNumber);
    };

    /**
     * Стоит ли показывать цвет ячейки: да, если игра в состоянии 'contemplation' или 'roundPreparing' и ячейка была раскрашена
     */
    const showColorizedCell = (cellNumber: number): boolean => {
        return (gameStore.isContemplationState() || gameStore.isRoundPreparingState()) && isCellColorized(cellNumber);
    };

    /**
     * Будет ли отображена ячейка с корректным ответом: да, если она является правильной ячейкой и уже была открыта пользователем.
     * @param cellNumber
     */
    const showCorrectlyOpenedCell = (cellNumber: number): boolean => {
        return (
            (gameStore.isInteractiveState() || gameStore.isRoundFinishingState()) && isCellOpened(cellNumber) && isCellCorrect(cellNumber)
        );
    };

    /**
     * Будет ли отображена ячейка с некорректным ответом: да, если она не является правильной ячейкой и уже была открыта пользователем.
     * @param cellNumber
     */
    const showIncorrectlyOpenedCell = (cellNumber: number): boolean => {
        return (
            (gameStore.isInteractiveState() || gameStore.isRoundFinishingState()) && isCellOpened(cellNumber) && !isCellCorrect(cellNumber)
        );
    };

    /** ************************************************************************************************************************** Ячейки */

    /**
     * Обрабатывает открытие ячейки, если игра находится в состоянии взаимодействия с пользователем.
     * @param cellNumber
     */
    const handleCellOpening = (cellNumber: number): void => {
        if (gameStore.isInteractiveState() && !isRotating.value) {
            openCell(cellNumber);
        }
    };

    /**
     * Открывает ячейку.
     * @param cellNumber
     */
    const openCell = (cellNumber: number) => {
        // openedCells.value.add(cellNumber);

        if (isCellCorrect(cellNumber)) {
            openCorrectCell(cellNumber);

            return;
        }

        openIncorrectCell(cellNumber);
    };

    /**
     * Обрабатывает открытие правильной ячейки.
     * @param cellNumber
     */
    const openCorrectCell = (cellNumber: number) => {
        correctlyOpenedCells.value.add(cellNumber);

        if (isAllCorrectCellsAreOpened()) {
            handleRoundFinishing();
        }
    };

    /**
     * Обрабатывает открытие неверной ячейки.
     * @param cellNumber
     */
    const openIncorrectCell = (cellNumber: number): void => {
        incorrectlyOpenedCells.value.add(cellNumber);

        markRoundAsFailed();
        setTimeout(() => incorrectlyOpenedCells.value.delete(cellNumber), 1000);
    };

    /** ************************************************************************************************************************** Раунды */

    /**
     * Проверяет корректность ответов в текущем раунде и определяет алгоритм его завершения.
     */
    const handleRoundFinishing = () => {
        if (isRoundFailed.value) {
            unsuccessfullyFinishRound();

            return;
        }

        successfullyFinishRound();
    };

    /**
     * Завершает успешный раунд, увеличиваия серию успешных раундов.
     */
    const successfullyFinishRound = () => {
        unsuccessfulRoundsStreak = 0;
        successfulRoundsStreak++;

        finishRound();
    };

    /**
     * Завершает неудачный раунд, увеличиваия серию раундов с ошибкой.
     */
    const unsuccessfullyFinishRound = () => {
        successfulRoundsStreak = 0;
        unsuccessfulRoundsStreak++;

        finishRound();
    };

    /**
     * Завершает раунд: устанавливает состояние roundFinishing, проверяет необходимость изменения уровня, начинает новый раунд
     */
    const finishRound = () => {
        gameStore.setRoundFinishingState();

        console.log('streak: ' + successfulRoundsStreak);

        if (successfulRoundsStreak >= currentLevel.value.correctAnswersBeforePromotion) {
            if (!isFinalLevel()) {
                promoteLevel();

                return;
            }
        }

        if (unsuccessfulRoundsStreak >= currentLevel.value.incorrectAnswersBeforeDemotion) {
            if (!isFirstLevel()) {
                demoteLevel();

                return;
            }
        }

        startNewRound();
    };

    /** ************************************************************************************************************************** Уровни */

    const promoteLevel = () => {
        currentLevelNumber.value++;

        changeLevel();
    };

    const demoteLevel = () => {
        currentLevelNumber.value--;

        changeLevel();
    };

    const changeLevel = () => {
        console.log('Смена уровня!!!');
        rebuildField().then(() => {
            successfulRoundsStreak = 0;
            unsuccessfulRoundsStreak = 0;
            setTimeout(startNewRound, 1000);
        });
    };

    /**
     * Занимается перетсроением поля при смене уровня: сначала в массив fadingCells поочередно добавляются номера ячеек,
     * которые исчезают с поля.
     */
    const rebuildField = (): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Переворачиваем ячейки
                correctlyOpenedCells.value.clear();

                // Устанавливаем состояние
                gameStore.setLevelFinishingState();

                // Скрываем ячейки, после чего меняем уровень и делаем ячейки видимыми
                hideCells().then(() => {
                    gameStore.setLevelPreparingState();
                    currentLevel.value = levels[currentLevelNumber.value];
                    hiddenCells.value = useShuffle(generateAvailableNumbers());

                    setLevelColors();

                    showCells().then(() => resolve());
                });
            }, 500)
        });
    };

    const hideCells = (): Promise<void> => {
        const cellNumbers = useShuffle(generateAvailableNumbers());

        return new Promise((resolve) => {
            setTimeout(function hide() {
                if (cellNumbers.length !== 0) {
                    hiddenCells.value.push(cellNumbers.pop());
                    setTimeout(hide, 150);
                } else {
                    resolve();
                }
            }, 500);
        });
    };

    const showCells = (): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(function show() {
                if (hiddenCells.value.length !== 0) {
                    hiddenCells.value.splice(0, 2);
                    setTimeout(show, 150);
                } else {
                    resolve();
                }
            }, 500);
        });
    };

    const markRoundAsFailed = (): void => {
        isRoundFailed.value = true;
    };

    /**
     *
     */
    const isFinalLevel = (): boolean => {
        return currentLevelNumber.value === Number(Object.keys(levels).at(-1));
    };

    /**
     *
     */
    const isFirstLevel = (): boolean => {
        return currentLevelNumber.value === Number(Object.keys(levels).at(0));
    };

    /**
     * Определяет все ли правильные ячейки открыты пользователем
     */
    const isAllCorrectCellsAreOpened = () => {
        return correctlyOpenedCells.value.size === currentLevel.value.cellsAmountToReproduce;
    };

    // const closeCell = (cellNumber: number): void => {
    //     openedCells.value.delete(cellNumber);
    // };

    const isCellOpened = (cellNumber: number): boolean => {
        return correctlyOpenedCells.value.has(cellNumber) || incorrectlyOpenedCells.value.has(cellNumber);
    };

    const isCellCorrect = (cellNumber: number): boolean => {
        if (correctlyOpenedCells.value.has(cellNumber)) {
            return true;
        }

        if (incorrectlyOpenedCells.value.has(cellNumber)) {
            return false;
        }

        return isCellColorized(cellNumber) && isCellColorCorrect(cellNumber) && isCellOrderCorrect(cellNumber);
    };

    const isCellColorized = (cellNumber: number): boolean => {
        return colorizedCells.value.has(cellNumber);
    };

    const isCellColorCorrect = (cellNumber: number): boolean => {
        return activeRoundColor.value === colorizedCells.value.get(cellNumber);
    };

    /**
     * Сравнивает номер ячейки с номером, расположенным в массиве упорядоченных номеров под соответствующим индексом
     */
    const isCellOrderCorrect = (cellNumber: number): boolean => {
        console.log(correctlyOpenedCells);
        if (currentLevel.value.hasDirection) {
            const cellOrder = correctlyOpenedCells.value.size;
            // console.log(correctlyOpenedCells.size)

            return orderedNumbers.value[cellOrder] === cellNumber;
        }

        return true;
    };

    /**
     * Механизм сокрытия ячеек: скрываем в состояниях смены уровня при наличии номера в массиве hidd
     * @param cellNumber
     */
    const isCellHidden = (cellNumber: number): boolean => {
        return (gameStore.isLevelFinishingState() || gameStore.isLevelPreparingState()) && hiddenCells.value.includes(cellNumber);
    };

    const rotateField = (): Promise<void> => {
        isRotating.value = true;
        let iterations = 0;

        console.log('----------------------------------------');
        return new Promise((resolve) => {
            setTimeout(function rotate() {
                if (iterations < currentLevel.value.rotationIterations) {
                    if (Math.random() < 0.5) {
                        rotationDegree.value += 90;
                        console.log('+90');
                    } else {
                        rotationDegree.value -= 90;
                        console.log('-90');
                    }

                    console.log(rotationDegree.value);

                    iterations++;

                    setTimeout(rotate, 500);
                }

                resolve();
            }, 600);
        });
    };

    /**
     * Вызывается по готовности пользователя открывать ячейки
     */
    const setInteractiveState = () => {
        if (currentLevel.value.rotationIterations !== 0) {
            rotateField().then(() => (isRotating.value = false));
        }

        gameStore.setInteractiveState();
    };

    return {
        setMatrixStore,
        isCellCorrect,
        handleCellOpening,
        isCellOpened,
        isCellColorized,
        isCellHidden,
        showColorizedCell,
        getCellColor,

        colorizedCells,
        orderedNumbers,
        activeRoundColor,
        // openedCells,
        currentLevelNumber,
        currentLevel,
        rotationDegree,

        hiddenCells,

        showCorrectlyOpenedCell,
        showIncorrectlyOpenedCell,
        setInteractiveState,
    };
});
