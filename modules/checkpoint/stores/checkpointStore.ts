import { defineStore } from 'pinia';
import { TestModeEnum } from '~/modules/checkpoint/entities/enums/TestModeEnum';
import { TestStateEnum } from '~/modules/checkpoint/entities/enums/TestStateEnum';

// Базовый стор, отвечающий за действия, свойственные всем тестам
export const useCheckpointStore = defineStore('checkpointStorage', () => {
    const COUNTDOWN_INITIAL_VALUE = 3;

    /**
     * Текущий режим теста
     */
    const mode = ref<TestModeEnum>();

    /**
     * Текущее состояние тестового упражнения
     */
    const state = ref<TestStateEnum>(TestStateEnum.testPreparing);

    /**
     * Предыдущее состояние тестового упражнения
     */
    const previousState = ref<TestStateEnum>();

    /**
     * Переменная, хранящая функцию для разрешения промиса, который ответственен за показ подсказки пользователю во время теста.
     */
    let promptResolver: (() => void) | undefined;

    /**
     * Переменная, хранящая функцию для разрешения промиса, который ответственен за состояние паузы.
     * При переходе в состоянии паузы создаётся промис, а его resolve-функция записывается в данную переменную.
     * По выходу из режима паузы должен происходить вызов функции в переменной: это приведёт к разрешению промиса.
     */
    let pauseResolver: (() => void) | undefined;

    /**
     * Промис, создаваемый при переходе в режим паузы. Его разрешение означает выход из режима.
     */
    let pausePromise: Promise<void>;

    /**
     * Содержимое подсказки
     */
    const promptContent = ref<string>('');

    /**
     * Вспомогательная переменная, хранит неизменяемое значение времени на тест
     */
    const totalTime = ref<number>(0);

    /**
     * Время на решение тестового задания, устанавливается конкретным стором, уменьшается после запуска startTimer()
     */
    const time = ref<number>(0);

    /**
     * Идентификатор таймера, ответственного за уменьшение переменной time
     */
    let timerId: ReturnType<typeof setTimeout> | null = null;

    /**
     * Количество шагов в тестовом задании, после выполнения всех шагов тестовое задание будет завершено
     */
    const steps = ref<number>(0);

    /**
     * Текущий шаг, на котором находится пользователь
     */
    const currentStep = ref<number>(0);

    /**
     * Номер текущего уровня
     */
    const currentLevelNumber = ref<number>(1);

    /**
     * Общее количество уровней, загружается стором теста
     */
    const levelsAmount = ref<number>(1);

    /**
     *
     */
    const finishedLevelsAmount = ref<number>(0);

    /**
     *
     */
    const message = ref<string | number>('');

    /**
     *
     */
    const countdown = ref<number>(COUNTDOWN_INITIAL_VALUE);

    /**
     *
     */
    let countdownTimerId: ReturnType<typeof setTimeout> | null = null;

    /**
     * Вклады тестовых упражнений в результат данного этапа
     */
    const testContributions: number[] = [];

    const saveTestContribution = (subtotals: number[]) => {
        const mean = useMean(subtotals);
        const contribution = parseFloat(mean.toFixed(2));

        testContributions.push(contribution);
    };

    /**
     * todo: //
     */
    const showPrompt = (content: string): Promise<void> => {
        promptContent.value = content;
        setPromptState();
        return new Promise((resolve) => {
            promptResolver = resolve;
        });
    };

    const closePrompt = () => {
        if (promptResolver) {
            promptResolver();
        }
    };

    const setPause = () => {
        setPauseState();
        pausePromise = new Promise((resolve) => {
            pauseResolver = resolve;
        });
    };

    const endPause = () => {
        if (previousState.value !== undefined) {
            setState(previousState.value);
        }

        if (pauseResolver) {
            pauseResolver();
        }
    };

    const getPausePromise = () => {
        return pausePromise;
    };

    const setMessage = (value: string | number): void => {
        message.value = value;
    };

    /**
     * @param amount
     */
    const setLevelsAmount = (amount: number) => {
        levelsAmount.value = amount;
    };

    const resetProgress = () => {
        currentLevelNumber.value = 1;
        finishedLevelsAmount.value = 0;
    };

    const clearMessage = (): void => {
        message.value = '';
    };

    const isMessageSet = () => {
        return message.value !== '';
    };

    const startCountdown = (): Promise<void> => {
        if (isCountdownStarted()) {
            throw new Error('Countdown already started');
        }

        return new Promise((resolve) => {
            const tick = async () => {
                if (isInPauseState()) {
                    await pausePromise;
                    resetCountdown();
                }

                if (countdown.value < 1) {
                    clearMessage();
                    resetCountdown();

                    resolve();

                    return;
                }

                setMessage(countdown.value);

                decreaseCountdown();
                countdownTimerId = setTimeout(tick, 1000);
            };

            countdownTimerId = setTimeout(tick, 1000);
        });
    };

    const clearCountdownTimer = () => {
        if (countdownTimerId) {
            clearTimeout(countdownTimerId);
            countdownTimerId = null;
        }
    };

    const resetCountdown = () => {
        clearCountdownTimer();
        countdown.value = COUNTDOWN_INITIAL_VALUE;
    };

    /**
     * Уменьшает значение переменной countdown на единицу
     */
    const decreaseCountdown = () => {
        countdown.value--;
    };

    /**
     * Проверяет, запущено ли уменьшение времени countdown
     */
    const isCountdownStarted = () => {
        return countdownTimerId !== null;
    };

    /**
     *
     */
    const promoteLevel = () => {
        if (finishedLevelsAmount.value < levelsAmount.value) {
            finishedLevelsAmount.value++;
        }

        if (currentLevelNumber.value < levelsAmount.value) {
            currentLevelNumber.value++;
        }
    };

    /**
     * Инициирует уменьшение переменной totalTime (на единицу каждую секунду).
     * Когда время выходит, необходимо прерывать уровень тестового задания и переходить к следующему.
     */
    const startTimer = () => {
        // check if timer is already started
        if (isTimerStarted()) {
            return;
        }

        const tick = async () => {
            if (isInPauseState()) {
                await pausePromise;
            }

            if (time.value <= 0) {
                // @ts-ignore
                clearTimeout(timerId);
                useEmitEvent('test:timeIsOver');
            } else {
                decreaseTime();
                timerId = setTimeout(tick, 1000);
            }
        };

        timerId = setTimeout(tick, 1000);
    };

    /**
     * Останавливает уменьшение переменной time
     */
    const stopTimer = () => {
        // @ts-ignore
        clearTimeout(timerId);
        timerId = null;
    };

    const resetTimer = () => {
        stopTimer();
        time.value = totalTime.value;
    };

    /**
     * Проверяет, запущено ли уменьшение времени time
     */
    const isTimerStarted = () => {
        return timerId !== null;
    };

    /**
     * Уменьшает значение переменной time на единицу
     */
    const decreaseTime = () => {
        time.value--;
    };

    /** ****************************************************************************************************** Работа с состояниями теста */

    /**
     * Устанавливает переданное состояние.
     * @param stateToSet
     */
    const setState = (stateToSet: TestStateEnum): void => {
        previousState.value = state.value;
        state.value = stateToSet;
    };

    /**
     * Проверяет соответствие переданного состояния текущему состоянию тестового задания.
     * @param stateToCheck
     */
    const isState = (stateToCheck: TestStateEnum): boolean => {
        return state.value === stateToCheck;
    };

    const setTestPreparingState = (): void => {
        setState(TestStateEnum.testPreparing);
    };

    const setLevelPreparingState = (): void => {
        setState(TestStateEnum.levelPreparing);
    };

    const setContemplationState = (): void => {
        setState(TestStateEnum.contemplation);
    };

    const setInteractiveState = (): void => {
        setState(TestStateEnum.interactive);
    };

    const setSuccessfulLevelFinishingState = (): void => {
        setState(TestStateEnum.successfulLevelFinishing);
    };

    const setFailedLevelFinishingState = (): void => {
        setState(TestStateEnum.failedLevelFinishing);
    };

    const setTestFinishingState = (): void => {
        setState(TestStateEnum.testFinishing);
    };

    const setPromptState = (): void => {
        setState(TestStateEnum.prompt);
    };

    const setPauseState = (): void => {
        setState(TestStateEnum.pause);
    };

    const isInTestPreparingState = (): boolean => {
        return isState(TestStateEnum.testPreparing);
    };

    const isLevelPreparingState = (): boolean => {
        return isState(TestStateEnum.levelPreparing);
    };

    const isInContemplationState = (): boolean => {
        return isState(TestStateEnum.contemplation);
    };

    const isInInteractiveState = (): boolean => {
        return isState(TestStateEnum.interactive);
    };

    const isInSuccessfulLevelFinishingState = (): boolean => {
        return isState(TestStateEnum.successfulLevelFinishing);
    };

    const isInFailedLevelFinishingState = (): boolean => {
        return isState(TestStateEnum.failedLevelFinishing);
    };

    const isInLevelFinishingState = (): boolean => {
        return isInSuccessfulLevelFinishingState() || isInFailedLevelFinishingState();
    };

    const isInTestFinishingState = (): boolean => {
        return isState(TestStateEnum.testFinishing);
    };

    const isInPromptState = (): boolean => {
        return isState(TestStateEnum.prompt);
    };

    const isInPauseState = (): boolean => {
        return isState(TestStateEnum.pause);
    };

    /** ********************************************************************************************************* Работа с режимами теста */

    /**
     * Устанавливает переданный режим
     * @param modeToSet
     */
    const setMode = (modeToSet: TestModeEnum): void => {
        mode.value = modeToSet;
    };

    /**
     * Проверяет соответствие переданного режима текущему
     * @param modeToCheck
     */
    const isMode = (modeToCheck: TestModeEnum): boolean => {
        return mode.value === modeToCheck;
    };

    const setWarmUpMode = () => {
        setMode(TestModeEnum.warmUp);
    };

    const setGameMode = () => {
        setMode(TestModeEnum.game);
    };

    const isInWarmUpMode = (): boolean => {
        return isMode(TestModeEnum.warmUp);
    };

    const isInGameMode = (): boolean => {
        return isMode(TestModeEnum.game);
    };

    /**
     * Вспомогательный метод, сигнализирует о том, что достигнут максимальный уровень в упражнении.
     */
    const isTimeToFinishTest = () => {
        return finishedLevelsAmount.value >= levelsAmount.value;
    };

    const setTotalTime = (timeToSet: number) => {
        time.value = timeToSet;
        totalTime.value = timeToSet;
    };

    const getTotal = (): number => {
        return Math.round(useMean(testContributions));
    };

    /**
     * Выполняет стандартный набор действий по завершении уровня.
     */
    const finishLevel = () => {
        // todo: level finishing state
        setFailedLevelFinishingState();
        resetTimer();
        clearMessage();
        promoteLevel();
    };

    const $reset = () => {
        resetCountdown();
        resetTimer();
        resetProgress();
        setGameMode();
        clearMessage();
        // ...
    };

    return {
        totalTime,
        time,
        steps,
        currentStep,
        startTimer,
        stopTimer,
        resetTimer,
        setTotalTime,

        startCountdown,

        levelsAmount,
        finishedLevelsAmount,
        currentLevelNumber,

        // setCurrentLevel,
        // setFirstLevel,
        resetProgress,

        promoteLevel,
        setLevelsAmount,

        isTimeToFinishTest,
        finishLevel,

        // Паузы
        getPausePromise,
        setPause,
        endPause,

        // Работа с сообщениями
        message,
        clearMessage,
        setMessage,
        isMessageSet,

        // Работа с подсказками
        promptContent,
        showPrompt,
        closePrompt,

        // Обработка результатов
        saveTestContribution,

        // Работа с режимами
        setWarmUpMode,
        setGameMode,
        isInWarmUpMode,
        isInGameMode,

        // Работа с состояниями
        setTestPreparingState,
        setLevelPreparingState,
        setContemplationState,
        setInteractiveState,
        setSuccessfulLevelFinishingState,
        setFailedLevelFinishingState,
        setTestFinishingState,
        setPromptState,
        setPauseState,
        isInTestPreparingState,
        isLevelPreparingState,
        isInContemplationState,
        isInInteractiveState,
        isInSuccessfulLevelFinishingState,
        isInFailedLevelFinishingState,
        isInLevelFinishingState,
        isInTestFinishingState,
        isInPromptState,
        isInPauseState,

        $reset,

        // Результат тестовых упражнений
        getTotal,
    };
});
