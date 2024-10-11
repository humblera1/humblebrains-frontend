import { defineStore } from 'pinia';
import type { PointsLevel } from '~/modules/checkpoint/entities/types/points/PointsLevel';
import type { ITestLevels } from '~/modules/checkpoint/entities/interfaces/ITestLevels';
import { useCheckpointStore } from '~/modules/checkpoint/stores/checkpointStore';

/**
 * Тест 'Запомни и расставь точки'
 */
export const usePointsStore = defineStore('pointsStorage', () => {
    const CELLS_AMOUNT = 16;

    const checkpoint = useCheckpointStore();

    /**
     * Массив номеров ячеек, которые содержат точки.
     */
    const pointedNumbers = ref<number[]>([]);

    /**
     * Массив ячеек, открытых пользователем в текущем раунде.
     */
    const openedNumbers = ref<number[]>([]);

    const isCellsHidden = ref<boolean>(true);

    /**
     * Массив, хранящий процент правильно открытых ячеек за каждый уровень.
     * По окончанию игры рассчитывается среднее на основании всех элементов массива.
     */
    const subtotals: number[] = [];

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
        return checkpoint.isInInteractiveState();
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
        openedNumbers.value.push(cellNumber);
    };

    const closeCell = (cellNumber: number) => {
        const indexToRemove = openedNumbers.value.indexOf(cellNumber);

        if (indexToRemove !== -1) {
            openedNumbers.value.splice(indexToRemove, 1);
        }
    };

    const isCellOpened = (cellNumber: number): boolean => {
        return openedNumbers.value.includes(cellNumber);
    };

    const isPointVisible = (cellNumber: number): boolean => {
        return checkpoint.isInContemplationState() && pointedNumbers.value.includes(cellNumber);
    };

    const hideCells = () => {
        isCellsHidden.value = true;
    };

    const showCells = () => {
        isCellsHidden.value = false;
    };

    const toggleCellsVisibility = async (): Promise<void> => {
        return new Promise((resolve) => {
            hideCells();

            setTimeout(() => {
                showCells();
                resolve();
            }, 1000);
        });
    };

    /**
     * Случайным образом выбирает номера ячеек, в которые будут помещены точки
     */
    const setPointedNumbers = () => {
        const shuffledAvailableNumbers = useShuffle(getAvailableNumbers());

        pointedNumbers.value = shuffledAvailableNumbers.slice(0, currentLevel.value.points);
    };

    /**
     * Начинает новый уровень
     */
    const startLevel = async () => {
        checkpoint.setLevelPreparingState();

        checkpoint.setLevelPreparingState();
        setPointedNumbers();

        await checkpoint.startCountdown();

        checkpoint.setContemplationState();

        setTimeout(async () => {
            await toggleCellsVisibility();

            if (checkpoint.isInWarmUpMode()) {
                checkpoint.setMessage('Откройте все ячейки, где ранее находились точки');
            }

            checkpoint.startTimer();
            checkpoint.setInteractiveState();
        }, 1000);
    };

    const flushOpenedNumbers = () => {
        openedNumbers.value.length = 0;
    };

    const flushPointedNumbers = () => {
        pointedNumbers.value.length = 0;
    };

    const finishRound = async () => {
        saveSubtotal();

        checkpoint.setFailedLevelFinishingState();
        checkpoint.resetTimer();

        flushOpenedNumbers();
        flushPointedNumbers();

        checkpoint.clearMessage();

        checkpoint.promoteLevel();

        if (checkpoint.finishedLevelsAmount >= checkpoint.levelsAmount) {
            if (checkpoint.isInWarmUpMode()) {
                await handleModeSwitching();
            } else {
                finishTest();

                return;
            }
        }

        await startLevel();
    };

    const finishTest = () => {
        saveTotal();
        checkpoint.setTestFinishingState();
        checkpoint.setMessage('Отлично! Готовим следующий этап...');

        // двигаемся по цепочке к следующему результату
    };

    const saveTotal = () => {
        const mean = useMean(subtotals);
        const total = parseFloat(mean.toFixed(2));

        checkpoint.saveTestContribution(total);
    };

    const saveSubtotal = () => {
        if (checkpoint.isInWarmUpMode()) {
            return;
        }

        const correctAnswers = useIntersection(openedNumbers.value, pointedNumbers.value);
        const incorrectAnswers = useDifference(openedNumbers.value, pointedNumbers.value);

        const points = correctAnswers.length - incorrectAnswers.length;
        const percent = points > 0 ? (points * 100) / pointedNumbers.value.length : 0;

        subtotals.push(percent);
    };

    const setupStore = async () => {
        checkpoint.setTestPreparingState();

        checkpoint.setLevelsAmount(Object.keys(levelsToWarmUp).length);
        checkpoint.setWarmUpMode();

        await checkpoint.showPrompt('warmUpPrompt');

        showCells();

        await startLevel();
    };

    const handleModeSwitching = async (): Promise<void> => {
        checkpoint.setMessage('Разминка завершена!');
        hideCells();

        await checkpoint.showPrompt('gameStartPrompt');

        checkpoint.setLevelPreparingState();
        checkpoint.clearMessage();

        showCells();
        checkpoint.setGameMode();
        checkpoint.setLevelsAmount(Object.keys(levels).length);
        checkpoint.resetProgress();
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
