// Базовый стор, отвечающий за действия, свойственные всем тестам
import { defineStore } from 'pinia';

export const useCheckpointStore = defineStore('checkpointStorage', () => {
    const COUNTDOWN_INITIAL_VALUE = 3;

    /**
     * Вспомогательная переменная, хранит неизменяемое значение времени на тест
     */
    const totalTime = ref<number>(50);

    /**
     * Время на решение тестового задания, устанавливается конкретным стором, уменьшается после запуска startTimer()
     */
    const time = ref<number>(50);

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
     * todo: //
     */
    // const finishedLevelsAmount = computed((): number => {
    //     return currentLevelNumber.value - 1;
    // });

    const setMessage = (value: string | number): void => {
        message.value = value;
    };

    const getMessage = (): string | number => {
        return message.value;
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
        return new Promise((resolve, reject) => {
            // check if timer is already started
            if (isCountdownStarted()) {
                return reject(new Error('Countdown already started'));
            }

            setTimeout(() => {
                // todo: restarting behavior
                const tick = () => {
                    if (countdown.value < 1) {
                        // @ts-ignore
                        clearTimeout(countdownTimerId);
                        countdownTimerId = null;

                        resolve(); // Resolve the promise when countdown finishes

                        clearMessage();

                        countdown.value = COUNTDOWN_INITIAL_VALUE;

                        return;
                    }

                    setMessage(countdown.value);

                    decreaseCountdown();
                    countdownTimerId = setTimeout(tick, 1000);
                };

                countdownTimerId = setTimeout(tick, 1000);
            }, 250);
        });
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
     * Инициирует уменьшение переменной totalTime (на единицу каждую секунду)
     */
    const startTimer = () => {
        // check if timer is already started
        if (isTimerStarted()) {
            return;
        }

        timerId = setTimeout(function tick() {
            if (time.value <= 0) {
                // @ts-ignore
                clearTimeout(timerId);
                // todo:
                console.log('Вышло время на ответ');

                return;
            }
            decreaseTime();
            timerId = setTimeout(tick, 1000);
        });
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
    }

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

    return {
        totalTime,
        time,
        steps,
        currentStep,
        startTimer,
        stopTimer,
        resetTimer,

        clearMessage,
        setMessage,
        getMessage,
        isMessageSet,

        startCountdown,

        levelsAmount,
        finishedLevelsAmount,
        currentLevelNumber,

        // setCurrentLevel,
        // setFirstLevel,
        resetProgress,

        promoteLevel,
        setLevelsAmount,
    };
});
