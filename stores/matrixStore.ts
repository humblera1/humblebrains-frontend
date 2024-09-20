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
     * Все окрашенные ячейки.
     * Ключами объекта выступают номера ячеек, а значениями соответствующий им цвет.
     */
    const colorizedCells = ref<Map<number, string>>(new Map());

    /**
     * Количество раундов, в которых был дан правильный ответ.
     */
    const successfullRoundsStreak: number = 0;

    /**
     * Количество раундов, в которых был дан неправильный ответ.
     */
    const failedRoundsStreak: number = 0;

    /**
     * Ограниченное количество возможных цветов на текущем уровне в зависимости от colorsAmount.
     */
    let levelColors: string[] = [];

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
        wrongAnswersBeforeDemotion: 2,
        hasDirection: false,
        hasRotation: false,
    };

    /**
     * Справочные константы, которые придут с бэка вместе с набором уровней.
     */
    const availableColors: string[] = ['#59AF8E', '#E9CA6D', '#EE8670', '#C38AC1', '#9BC4F8', '#6878DE'];

    const prepareRound = () => {
        clearCorrectlyOpenedCells();
        discolorCells();
        setActiveColor();
        gameStore.setContemplationState();

        clearOpenedCells().then(() => {
            console.log('поле очищено!');
        });

        colorizeCells();
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
    const clearOpenedCells = async () => {
        const iterator = openedCells.value.values();

        const intervalId = setInterval(() => {
            const result = iterator.next();
            if (result.done) {
                clearInterval(intervalId);

                return;
            }

            openedCells.value.delete(result.value);
        }, 1000);
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

    /**
     * Обновляет коллекцию закрашенных ячеек
     */
    const recolorCells = () => {
        discolorCells();
        colorizeCells();
    };

    const setMatrixStore = () => {
        // prompt maybe
        gameStore.setContemplationState();

        setLevelColors();
        setActiveColor();

        colorizeCells();

        // Установка состояния...
    };

    const colorizeCells = (): void => {
        const cells = useRange(1, 9);
        const shuffledArray = useShuffle(cells);
        const colors = levelColors;

        let i = 0;

        function addColors() {
            if (i < level.colorsAmount) {
                let j = 0;
                const color = colors[i];

                function addNumbers() {
                    if (j < level.cellsAmountToReproduce) {
                        const number = shuffledArray.pop();
                        colorizeCell(number, color);

                        j++;
                        setTimeout(addNumbers, 250);
                    } else {
                        i++;
                        setTimeout(addColors, 0);
                    }
                }

                addNumbers();
            }
        }

        setTimeout(() => addColors(), 1000);
    };

    const colorizeCell = (cellNumber: number, color: string): void => {
        colorizedCells.value.set(cellNumber, color);
    };

    const getCellColor = (cellNumber: number): string => {
        return colorizedCells.value.get(cellNumber);
    };

    const isCellColorized = (cellNumber: number) => {
        return colorizedCells.value.has(cellNumber);
    };

    // Стоит ли показывать цвет ячейки: да, если игра в состоянии 'contemplation' и ячейка была раскрашена
    const showColorizedCell = (cellNumber: number): boolean => {
        return gameStore.isContemplationState() && isCellColorized(cellNumber);
    };

    const openCell = (cellNumber: number): void => {
        if (gameStore.isInteractiveState()) {
            openedCells.value.add(cellNumber);

            if (isCellCorrect(cellNumber)) {
                correctlyOpenedCells.add(cellNumber);

                return;
            }

            setTimeout(() => closeCell(cellNumber), 1000);
        }
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

    /**
     * todo:
     */
    const isCellOrderCorrect = (cellNumber: number): boolean => {
        return true;
    };

    const isCellColorCorrect = (cellNumber: number): boolean => {
        return activeRoundColor.value === colorizedCells.value.get(cellNumber);
    };

    return {
        setMatrixStore,
        isCellCorrect,
        openCell,
        closeCell,
        isCellOpened,
        isCellColorized,
        showColorizedCell,
        getCellColor,
        colorizedCells,
    };
});
