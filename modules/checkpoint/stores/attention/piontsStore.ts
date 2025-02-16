import { defineStore } from 'pinia';
import { difference, intersection, range, shuffle } from 'lodash';
import type { PointsLevel } from '~/modules/checkpoint/entities/types/points/PointsLevel';
import type { ITestLevels } from '~/modules/checkpoint/entities/interfaces/ITestLevels';
import { useCheckpointStore } from '~/modules/checkpoint/stores/checkpointStore';

/**
 * Тест 'Запомни и расставь точки'
 */
export const usePointsStore = defineStore('pointsStorage', () => {
    const CELLS_AMOUNT = 16;

    const TOTAL_TIME = 30000;

    /**
     * Время, отведённое на запоминание расположения точек на поле
     */
    const TIME_FOR_CONTEMPLATION = 1000;

    /**
     * Время сокрытия поля от пользователя после показа расположения точек
     */
    const TIME_FOR_TOGGLE_VISIBILITY = 1000;

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
     * Идентификатор таймера, ответственного за показ точек на определённое время (TIME_FOR_CONTEMPLATION)
     */
    let contemplationTimerId: ReturnType<typeof setTimeout>;

    /**
     * Идентификатор таймера, ответственного за сокрытие игрового поля после показа точек на определённое время (TIME_FOR_TOGGLE_VISIBILITY)
     */
    let visibilityToggleTimerId: ReturnType<typeof setTimeout>;

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
        return range(1, CELLS_AMOUNT + 1);
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

    const toggleCellsVisibility = (): Promise<void> => {
        return new Promise((resolve) => {
            hideCells();

            visibilityToggleTimerId = setTimeout(async () => {
                if (checkpoint.isInPauseState()) {
                    await checkpoint.getPausePromise();
                }

                showCells();
                resolve();
            }, TIME_FOR_TOGGLE_VISIBILITY);
        });
    };

    /**
     * Случайным образом выбирает номера ячеек, в которые будут помещены точки
     */
    const setPointedNumbers = () => {
        const shuffledAvailableNumbers = shuffle(getAvailableNumbers());

        pointedNumbers.value = shuffledAvailableNumbers.slice(0, currentLevel.value.points);
    };

    /**
     * Начинает новый уровень
     */
    const startLevel = async () => {
        checkpoint.setLevelPreparingState();

        setPointedNumbers();

        await checkpoint.startCountdown();
        showAndHideField();
    };

    /**
     * Функция, ответственная за показ точек на поле, а также их сокрытие через определённой время
     */
    const showAndHideField = () => {
        checkpoint.setContemplationState();

        contemplationTimerId = setTimeout(async () => {
            if (checkpoint.isInPauseState()) {
                await checkpoint.getPausePromise();
            }

            checkpoint.setInteractiveState();
            await toggleCellsVisibility();

            if (checkpoint.isInWarmUpMode()) {
                checkpoint.setMessage('points:openCells');
            }

            checkpoint.startTimer();
        }, TIME_FOR_CONTEMPLATION);
    };

    const clearContemplationTimer = () => {
        if (contemplationTimerId) {
            clearTimeout(contemplationTimerId);
        }
    };

    const clearVisibilityToggleTimer = () => {
        if (visibilityToggleTimerId) {
            clearTimeout(visibilityToggleTimerId);
        }
    };

    const clearTimers = () => {
        clearContemplationTimer();
        clearVisibilityToggleTimer();
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

        if (checkpoint.isTimeToFinishTest()) {
            await checkpoint.finishTest(subtotals);

            return;
        }

        if (checkpoint.isTimeToSwitchMode()) {
            await checkpoint.handleModeSwitching(Object.keys(levels).length);
        }

        await startLevel();
    };

    const saveSubtotal = () => {
        if (checkpoint.isInWarmUpMode()) {
            return;
        }

        const correctAnswers = intersection(openedNumbers.value, pointedNumbers.value);
        const incorrectAnswers = difference(openedNumbers.value, pointedNumbers.value);

        const points = correctAnswers.length - incorrectAnswers.length;
        const percent = points > 0 ? (points * 100) / pointedNumbers.value.length : 0;

        subtotals.push(percent);
    };

    const setupStore = async () => {
        checkpoint.setTestPreparingState();

        checkpoint.setTotalTime(TOTAL_TIME);
        checkpoint.setLevelsAmount(Object.keys(levelsToWarmUp).length);
        checkpoint.setWarmUpMode();

        await checkpoint.showPrompt('warmUpPrompt');

        showCells();

        await startLevel();
    };

    const $reset = () => {
        clearTimers();
        hideCells();
        flushOpenedNumbers();
        flushPointedNumbers();
        checkpoint.setTestPreparingState();
        checkpoint.$reset();
    };

    useListenEvent('test:timeIsOver', async () => {
        await finishRound();
    });

    return {
        getCellsAmount,
        handleCellOpening,
        isCellOpened,
        isPointVisible,
        finishRound,
        setupStore,

        isCellsHidden,
        openedNumbers,

        $reset,

        // debug
        pointedNumbers,
    };
});
