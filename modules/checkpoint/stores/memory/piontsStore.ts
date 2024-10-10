import { defineStore } from 'pinia';
import type { PointsLevel } from '~/modules/checkpoint/entities/types/points/PointsLevel';
import { useStateStore } from '~/modules/checkpoint/stores/stateStore';
import { useModeStore } from '~/modules/checkpoint/stores/modeStore';
import type { ITestLevels } from '~/modules/checkpoint/entities/interfaces/ITestLevels';
import { useCheckpointStore } from '~/modules/checkpoint/stores/checkpointStore';

/**
 * Тест 'Запомни и расставь точки'
 */
export const usePointsStore = defineStore('pointsStorage', () => {
    const CELLS_AMOUNT = 16;

    const checkpoint = useCheckpointStore();

    const state = useStateStore();

    const mode = useModeStore();

    /**
     * Массив номеров ячеек, которые содержат точки.
     */
    const pointedNumbers = ref<number[]>([]);

    /**
     * Массив ячеек, открытых пользователем в текущем раунде.
     */
    const openedNumbers = ref<Set<number>>(new Set());

    const isCellsHidden = ref<boolean>(false);

    /**
     * Разминочные уровни
     */
    const levelsToWarmUp: ITestLevels<PointsLevel> = {
        1: {
            points: 3,
        },
    };

    /**
     * Уровни тестового задания
     */
    const levels: ITestLevels<PointsLevel> = {
        1: {
            points: 1,
        },
    };

    const currentLevel = computed((): PointsLevel => {
        return mode.isWarmUp() ? levelsToWarmUp[checkpoint.currentLevelNumber] : levels[checkpoint.currentLevelNumber];
    });

    /**
     * Возвращает массив всех допустимых номеров ячеек в порядке возрастания, основываясь на значении CELLS_AMOUNT.
     */
    const getAvailableNumbers = (): number[] => {
        return useRange(1, CELLS_AMOUNT + 1);
    };

    const getCellsAmount = (): number => {
        return CELLS_AMOUNT;
    };

    const canCellBeOpened = (): boolean => {
        return state.isInteractive();
    };

    const handleCellOpening = (cellNumber: number) => {
        if (!canCellBeOpened()) {
            return;
        }

        if (isCellOpened(cellNumber)) {
            closeCell(cellNumber);
        } else {
            openCell(cellNumber);
        }
    };

    const openCell = (cellNumber: number) => {
        openedNumbers.value.add(cellNumber);
    };

    const closeCell = (cellNumber: number) => {
        openedNumbers.value.delete(cellNumber);
    };

    const isCellOpened = (cellNumber: number): boolean => {
        return openedNumbers.value.has(cellNumber);
    };

    const isPointVisible = (cellNumber: number): boolean => {
        return state.isInContemplationState() && pointedNumbers.value.includes(cellNumber);
    };

    /**
     * Начинает новый уровень
     */
    const startLevel = () => {
        state.setRoundPreparingState();
        const shuffledAvailableNumbers = useShuffle(getAvailableNumbers());

        pointedNumbers.value = shuffledAvailableNumbers.slice(0, currentLevel.value.points);

        checkpoint.startCountdown().then(() => {
            state.setContemplationState();

            setTimeout(() => {
                // здесь необходимо скрыть поле, а затем снова показать его
                state.setInteractiveState();
            }, 1000);
        });
    };

    const flushOpenedNumbers = () => {
        openedNumbers.value.clear();
    };

    const flushPointedNumbers = () => {
        pointedNumbers.value.length = 0;
    };

    // const flushPointedNumbers = (): Promise<void> => {
    //     return new Promise((resolve) => {
    //         const removeNumber = () => {
    //             if (pointedNumbers.value.length !== 0) {
    //                 pointedNumbers.value.pop();
    //                 setTimeout(removeNumber, 250);
    //             } else {
    //                 resolve();
    //             }
    //         }
    //
    //         setTimeout(removeNumber, 250);
    //     }
    // };
    //
    // const flushOpenedNumbers = (): Promise<void> => {
    //     return new Promise((resolve) => {
    //         const removeNumber = () => {
    //             if (pointedNumbers.value.length !== 0) {
    //                 pointedNumbers.value.pop();
    //                 setTimeout(removeNumber, 250);
    //             } else {
    //                 resolve();
    //             }
    //         }
    //
    //         setTimeout(removeNumber, 250);
    //     }
    // };

    const finishRound = () => {
        saveSubtotal();

        flushOpenedNumbers();
        flushPointedNumbers();

        checkpoint.promoteLevel();

        if (mode.isWarmUp()) {
            if (checkpoint.currentLevelNumber <= checkpoint.levelsAmount) {
                startLevel();

                return;
            }

            handleModeSwitching();
        }

        startLevel();
    };

    const saveSubtotal = () => {
        console.log(openedNumbers.value);
        // ...
    };

    const setupStore = () => {
        state.setTestPreparingState();

        checkpoint.setLevelsAmount(Object.keys(levels).length);
        checkpoint.setFirstLevel();

        mode.setWarmUpMode();

        startLevel();
    };

    const handleModeSwitching = () => {
        checkpoint.setLevelsAmount(Object.keys(levels).length);
        checkpoint.setFirstLevel();
        mode.setGameMode();
    };

    return {
        getCellsAmount,
        handleCellOpening,
        isCellOpened,
        isPointVisible,
        finishRound,
        setupStore,

        isCellsHidden,
        openedNumbers,

        // debug
        pointedNumbers,
    };
});
