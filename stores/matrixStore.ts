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
        hasDirection: false,
        hasRotation: false,
    };

    /**
     * Справочные константы, которые придут с бэка вместе с набором уровней.
     */
    const availableColors: string[] = ['#59AF8E', '#E9CA6D', '#EE8670', '#C38AC1', '#9BC4F8', '#6878DE'];

    const startNewRound = () => {
        clearOpenedCells().then(() => {
            console.log('поле очищено!');
            gameStore.setContemplationState();
            colorizeCells();

            clearCorrectlyOpenedCells();
            discolorCells();
            setActiveColor();

            isRoundFailed.value = false;
        });
    }

    // const prepareRound = () => {
    //     clearCorrectlyOpenedCells();
    //     discolorCells();
    //     setActiveColor();
    //     gameStore.setContemplationState();
    //
    //     clearOpenedCells().then(() => {
    //         console.log('поле очищено!');
    //     });
    //
    //     colorizeCells();
    // };

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
    const clearOpenedCells = async (): Promise<void> => {
        return new Promise((resolve) => {
            const iterator = openedCells.value.values();
            const intervalId = setInterval(() => {
                const result = iterator.next();
                if (result.done) {
                    clearInterval(intervalId);
                    resolve();
                    // return;
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
                        setTimeout(addNumbers, 100);
                    } else {
                        i++;
                        setTimeout(addColors, 0);
                    }
                }

                addNumbers();
            }
        }

        setTimeout(() => addColors(), 500);
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
            handleCellOpening(cellNumber);
        }
    };

    /**
     * Обрабатывает открытие ячейки.
     * @param cellNumber
     */
    const handleCellOpening = (cellNumber: number) => {
        openedCells.value.add(cellNumber);

        if (isCellCorrect(cellNumber)) {
            handleCorrectOpening(cellNumber);

            return;
        }

        handleIncorrectOpening(cellNumber);
    }

    /**
     * Обрабатывает открытие правильной ячейки.
     * @param cellNumber
     */
    const handleCorrectOpening = (cellNumber: number) => {
        correctlyOpenedCells.add(cellNumber);

        if (isAllCorrectCellsAreOpened()) {
            handleRoundFinishing();
        }
    }

    /**
     * Обрабатывает открытие неверной ячейки.
     * @param cellNumber
     */
    const handleIncorrectOpening = (cellNumber: number): void => {
        markRoundAsFailed();
        setTimeout(() => closeCell(cellNumber), 1000);
    }

    const markRoundAsFailed = (): void => {
        isRoundFailed.value = true;
    }

    const handleRoundFinishing = () => {
        if (isRoundFailed.value) {
            handleUnsuccessfulRoundFinishing();

            return;
        }

        handleSuccessfulRoundFinishing();
    }

    const handleSuccessfulRoundFinishing = () => {
        successfulRoundsStreak++;
        console.log('streak: ' + successfulRoundsStreak);

        if (successfulRoundsStreak < level.correctAnswersBeforePromotion) {
            startNewRound();

            return;
        }

        promoteLevel();
    }


    const handleUnsuccessfulRoundFinishing = () => {
        successfulRoundsStreak = 0;
        unsuccessfulRoundsStreak++;

        if (successfulRoundsStreak < level.incorrectAnswersBeforeDemotion) {
            startNewRound();

            return;
        }

        demoteLevel();
    }


    const promoteLevel = () => {
        console.log('Уровень успешно завершён!');
    }

    const demoteLevel = () => {
        console.log('Уровень понижен до предыдущего');
    }

    /**
     * Определяет все ли правильные ячейки открыты пользователем
     */
    const isAllCorrectCellsAreOpened = () => {
        return correctlyOpenedCells.size === level.cellsAmountToReproduce;
    }

    const isTimeToPromote = () => {

    }

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
        activeRoundColor,
    };
});
