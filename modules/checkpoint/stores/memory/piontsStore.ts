import { defineStore } from 'pinia';
import type { PointsLevel } from '~/modules/checkpoint/entities/types/points/PointsLevel';
import { useStateStore } from '~/modules/checkpoint/stores/stateStore';
import type { ITestLevels } from '~/modules/checkpoint/entities/interfaces/ITestLevels';
import { useCheckpointStore } from '~/modules/checkpoint/stores/checkpointStore';

/**
 * Тест 'Запомни и расставь точки'
 */
export const usePointsStore = defineStore('pointsStorage', () => {
    const CELLS_AMOUNT = 16;

    const checkpoint = useCheckpointStore();

    const state = useStateStore();

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
            points: 1,
        },
        2: {
            points: 2,
        },
    };

    /**
     * Уровни тестового задания
     */
    const levels: ITestLevels<PointsLevel> = {
        1: {
            points: 1,
        },
        2: {
            points: 2,
        },
        3: {
            points: 5,
        },
    };

    const currentLevel = computed((): PointsLevel => {
        return checkpoint.isInWarmUpMode() ? levelsToWarmUp[checkpoint.currentLevelNumber] : levels[checkpoint.currentLevelNumber];
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

    const toggleCellsVisibility = (): Promise<void> => {
        return new Promise((resolve) => {
            isCellsHidden.value = true;

            setTimeout(() => {
                isCellsHidden.value = false;
                resolve();
            }, 1000);
        });
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
                toggleCellsVisibility().then(() => {
                    checkpoint.setMessage('Откройте все ячейки, где ранее находились точки');
                    checkpoint.startTimer();
                    state.setInteractiveState();
                });
            }, 1000);
        });
    };

    const flushOpenedNumbers = () => {
        openedNumbers.value.clear();
    };

    const flushPointedNumbers = () => {
        pointedNumbers.value.length = 0;
    };

    const finishRound = () => {
        checkpoint.resetTimer();
        saveSubtotal();

        flushOpenedNumbers();
        flushPointedNumbers();

        checkpoint.clearMessage();

        checkpoint.promoteLevel();

        if (checkpoint.finishedLevelsAmount >= checkpoint.levelsAmount) {
            if (checkpoint.isInWarmUpMode()) {
                handleModeSwitching();
            } else {
                finishTest();

                return;
            }
        }

        startLevel();
    };

    const finishTest = () => {
        state.setTestFinishingState();
        checkpoint.setMessage('Отлично! Готовим следующий этап...');
    };

    const saveSubtotal = () => {
        console.log(openedNumbers.value);
        // ...
    };

    const setupStore = () => {
        state.setTestPreparingState();

        checkpoint.setLevelsAmount(Object.keys(levelsToWarmUp).length);
        // checkpoint.setFirstLevel();

        checkpoint.setWarmUpMode();

        startLevel();
    };

    const handleModeSwitching = () => {
        checkpoint.setMessage('Разминка завершена!');
        checkpoint.setLevelsAmount(Object.keys(levels).length);
        checkpoint.resetProgress();
        checkpoint.setGameMode();
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
