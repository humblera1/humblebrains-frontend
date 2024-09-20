import { defineStore } from 'pinia';
import type { IMatrixLevel } from '~/entities/interfaces/games/matrix/IMatrixLevel';

export const useMatrixStore = defineStore('matrixStorage', () => {
    const gameStore = useGameStore();

    /**
     * Все открытые пользователем ячейки, включая неправильные, которые удаляются из массива спустя определённое время.
     * Нужен для анимации игрового поля (открывать/закрывать ячейки).
     */
    const openedCells = ref<Set<number>>(new Set());

    /**
     * Все правильно открытые ячейки.
     * Нужен исключительно для внутренней проверки (correctAnswersBeforePromotion === correctlyOpenedCells.size).
     */
    const correctlyOpenedCells: Set<number> = new Set();

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
     * Ячейки данного цвета пользователю необходимо запоминанть в текущем раунде.
     */
    const activeRoundColor = ref<string>('');

    /**
     * Текущий уровень пользователя
     * Набор уровней приходит с бэка, текущий выбирается на основании уровня игрока.
     */
    const level: IMatrixLevel = {
        squareSide: 3,
        cellsAmountToReproduce: 3,
        colorsAmount: 2,
        correctAnswersBeforePromotion: 5,
        incorrectAnswersBeforeDemotion: 2,
        pointsForAnswer: 20,
        hasDirection: true,
        hasRotation: false,
    };

    /**
     * Справочные константы, которые придут с бэка вместе с набором уровней.
     */
    const availableColors: string[] = ['#59AF8E', '#E9CA6D', '#EE8670', '#C38AC1', '#9BC4F8', '#6878DE'];

    const startNewRound = () => {
        isRoundFailed.value = false;

        // Переворачиваем все открытые ячейки
        clearOpenedCells().then(() => {
            console.log('поле очищено!');
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
     * Случайным образом устанавливает цвета, которые будут фигурировать в текущем уровне
     */
    const setLevelColors = (): void => {
        const colors = useShuffle(availableColors);
        levelColors = colors.splice(1, level.colorsAmount);
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
            const iterator = openedCells.value.values();
            const intervalId = setInterval(() => {
                const result = iterator.next();
                if (result.done) {
                    clearInterval(intervalId);
                    resolve();
                }
                openedCells.value.delete(result.value);
            }, 250);
        });
    };

    /**
     *
     */
    const clearCorrectlyOpenedCells = () => {
        correctlyOpenedCells.clear();
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
                if (colorsIndex < level.colorsAmount) {
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
                if (numbersIndex < level.cellsAmountToReproduce) {
                    const number = shuffledNumbers.pop() as number;
                    numbersIndex++;

                    colorizeCell(number, color);

                    setTimeout(() => addNumbers(color, numbersIndex, resolveAddColors), 100);
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
        return useRange(1, level.squareSide ** 2);
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
        if (gameStore.isInteractiveState()) {
            openCell(cellNumber);
        }
    };

    /**
     * Открывает ячейку.
     * @param cellNumber
     */
    const openCell = (cellNumber: number) => {
        openedCells.value.add(cellNumber);

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
        correctlyOpenedCells.add(cellNumber);

        if (isAllCorrectCellsAreOpened()) {
            handleRoundFinishing();
        }
    };

    /**
     * Обрабатывает открытие неверной ячейки.
     * @param cellNumber
     */
    const openIncorrectCell = (cellNumber: number): void => {
        markRoundAsFailed();
        setTimeout(() => closeCell(cellNumber), 1000);
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

        if (successfulRoundsStreak >= level.correctAnswersBeforePromotion) {
            promoteLevel();

            return;
        }

        if (unsuccessfulRoundsStreak >= level.incorrectAnswersBeforeDemotion) {
            demoteLevel();

            return;
        }

        startNewRound();
    };

    /** ************************************************************************************************************************** Уровни */

    const promoteLevel = () => {
        gameStore.setLevelFinishingState();

        console.log('Уровень успешно завершён!');

        gameStore.setLevelPreparingState();
    };

    const demoteLevel = () => {
        gameStore.setLevelFinishingState();

        console.log('Уровень понижен до предыдущего');

        gameStore.setLevelPreparingState();
    };

    const markRoundAsFailed = (): void => {
        isRoundFailed.value = true;
    };

    /**
     * Определяет все ли правильные ячейки открыты пользователем
     */
    const isAllCorrectCellsAreOpened = () => {
        return correctlyOpenedCells.size === level.cellsAmountToReproduce;
    };

    const closeCell = (cellNumber: number): void => {
        openedCells.value.delete(cellNumber);
    };

    const isCellOpened = (cellNumber: number): boolean => {
        return openedCells.value.has(cellNumber);
    };

    const isCellCorrect = (cellNumber: number): boolean => {
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
        if (level.hasDirection && !correctlyOpenedCells.has(cellNumber)) {
            const cellOrder = openedCells.value.size - 1;

            return orderedNumbers.value[cellOrder] === cellNumber;
        }

        return true;
    };

    return {
        setMatrixStore,
        isCellCorrect,
        handleCellOpening,
        isCellOpened,
        isCellColorized,
        showColorizedCell,
        getCellColor,

        colorizedCells,
        orderedNumbers,
        activeRoundColor,
        openedCells,

        showCorrectlyOpenedCell,
        showIncorrectlyOpenedCell,
    };
});
