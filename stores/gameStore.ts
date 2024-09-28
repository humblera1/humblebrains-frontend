import { defineStore } from 'pinia';
import { GameStateEnum } from '~/entities/enums/games/GameStateEnum';

// Базовый стор, отвечающий за действия, характерные всем играм
export const useGameStore = defineStore('gameStorage', () => {
    const COUNTDOWN_INITIAL_VALUE: number = 3;

    const TIME_TO_SHOW_INCORRECT_ANSWER_REACTION = 1000;

    /**
     * Время на игру в секундах, скорее сего, будет приходить с бэка
     */
    const totalTime = ref<number>(90);

    /**
     * Идентификатор таймера, ответственного за уменьшение переменной totalTime
     */
    let totalTimerId: ReturnType<typeof setTimeout> | null = null;

    /**
     * Время, отведенное на запоминание условий или на ответ, устанавливается стором конкретной игры
     */
    const roundTime = ref<number>(0);

    /**
     * Вспомогательная переменная, хранит оригинальное значение roundTime
     */
    const totalRoundTime = ref<number>(0);

    /**
     *
     */
    const countdown = ref<number>(COUNTDOWN_INITIAL_VALUE);

    /**
     *
     */
    let countdownTimerId: ReturnType<typeof setTimeout> | null = null;

    /**
     * Идентификатор таймера, ответственного за уменьшение переменной roundTime
     */
    let roundTimerId: ReturnType<typeof setTimeout> | null = null;

    /**
     * Сигнализирует о том, что в текущем раунде была допущена ошибка при ответе.
     */
    const incorrectAnswersOnRound = ref<number>(0);

    /**
     * Вспомогательная переменная, отвечают за анимацию виджетов шаблона при неправильном ответе.
     * При каждом неправильном ответе, данная переменная увеличивается на определённое время, и на поле появляется
     * новый элемент, сигнализирующий о неправильном ответе.
     */
    const incorrectAnswerReactions = ref<{ id: number }[]>([]);

    const gameState = ref<GameStateEnum>();

    /** **************************************************************************************************************** Таймер totalTime */

    /**
     * Инициирует уменьшение переменной totalTime (на единицу каждую секунду)
     */
    const startTotalTimer = () => {
        // check if timer is already started
        if (isTotalTimerStarted()) {
            return;
        }

        totalTimerId = setTimeout(function tick() {
            if (totalTime.value <= 0) {
                // @ts-ignore
                clearTimeout(totalTimerId);
                // todo:
                console.log('Вышло время на игру');

                return;
            }
            decreaseTotalTime();
            totalTimerId = setTimeout(tick, 1000);
        });
    };

    /**
     * Останавливает уменьшение переменной totalTime
     */
    const stopTotalTimer = () => {
        // @ts-ignore
        clearTimeout(totalTimerId);
        totalTimerId = null;
    };

    /**
     * Уменьшает значение переменной totalTime на единицу
     */
    const decreaseTotalTime = () => {
        totalTime.value--;
    };

    /**
     * Проверяет, запущено ли уменьшение времени totalTime
     */
    const isTotalTimerStarted = () => {
        return totalTimerId !== null;
    };

    /** **************************************************************************************************************** Таймер roundTime */

    /**
     * Устанавливает значение переменной roundTime (которая будет изменяться по ходу раунда)
     * и вспомогательной переменной totalRoundTime
     * @param seconds время в секундах
     */
    const setRoundTime = (seconds: number) => {
        totalRoundTime.value = seconds;
        roundTime.value = seconds;
    };

    const showRoundTimeLine = computed((): boolean => {
        return roundTime.value !== 0;
    });

    /**
     * Инициирует уменьшение переменной roundTime (на единицу каждую секунду)
     */
    const startRoundTimer = () => {
        // check if timer is already started
        if (isRoundTimerStarted()) {
            return;
        }

        totalRoundTime.value = roundTime.value;
        roundTimerId = setTimeout(function tick() {
            if (roundTime.value <= 0) {
                // @ts-ignore
                clearTimeout(roundTimerId);
                // todo:
                console.log('Вышло время на запоминание');

                return;
            }
            decreaseRoundTime();
            roundTimerId = setTimeout(tick, 1000);
        });
    };

    /**
     * Останавливает уменьшение переменной roundTime
     */
    const stopRoundTimer = () => {
        // @ts-ignore
        clearTimeout(roundTimerId);
        roundTimerId = null;
    };

    /**
     * Уменьшает значение переменной roundTime на единицу
     */
    const decreaseRoundTime = () => {
        roundTime.value--;
    };

    /**
     * Проверяет, запущено ли уменьшение времени roundTime
     */
    const isRoundTimerStarted = () => {
        return roundTimerId !== null;
    };

    /** ***************************************************************************************************************** Обратный отсчёт */

    const startCountdown = (): Promise<void> => {
        return new Promise((resolve, reject) => {
            // check if timer is already started
            if (isCountdownStarted()) {
                return reject(new Error('Countdown already started'));
            }

            setTimeout(() => {
                // todo: restarting behavior
                const tick = () => {
                    if (countdown.value <= 1) {
                        // @ts-ignore
                        clearTimeout(countdownTimerId);
                        countdownTimerId = null;

                        resolve(); // Resolve the promise when countdown finishes

                        countdown.value = COUNTDOWN_INITIAL_VALUE;
                        return;
                    }

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
     * Добавляет новый элемент в массив incorrectAnswerReactions.
     * Благодаря этому, в шаблоне рендерится новый анимированный элемент, сигнализирующий пользователю о том,
     * что был дан неверный ответ.
     */
    const addReaction = () => {
        const reactionId = incorrectAnswersOnRound.value;
        incorrectAnswerReactions.value.push({ id: reactionId });

        setTimeout(() => {
            incorrectAnswerReactions.value = incorrectAnswerReactions.value.filter((reaction) => reaction.id !== reactionId);
        }, TIME_TO_SHOW_INCORRECT_ANSWER_REACTION);
    };

    /**
     * Помечает раунд как проигранный.
     */
    const markRoundAsFailed = (): void => {
        incorrectAnswersOnRound.value++;
        addReaction();
    };

    const clearIncorrectAnswers = () => {
        incorrectAnswersOnRound.value = 0;
    };

    const isRoundFailed = computed((): boolean => {
        return incorrectAnswersOnRound.value !== 0;
    });

    /** *********************************************************************************************************************** Состояния */

    const setState = (state: GameStateEnum): void => {
        gameState.value = state;
    };

    const isState = (state: GameStateEnum): boolean => {
        return gameState.value === state;
    };

    const setLevelPreparingState = (): void => {
        setState(GameStateEnum.levelPreparing);
    };

    const setGamePreparingState = (): void => {
        setState(GameStateEnum.gamePreparing);
    };

    const setRoundPreparingState = (): void => {
        setState(GameStateEnum.roundPreparing);
    };

    const setContemplationState = (): void => {
        setState(GameStateEnum.contemplation);
    };

    const setInteractiveState = (): void => {
        setState(GameStateEnum.interactive);
    };

    const setFailedRoundFinishingState = (): void => {
        setState(GameStateEnum.failedRoundFinishing);
    };

    const setSuccessfulRoundFinishingState = (): void => {
        setState(GameStateEnum.successfulRoundFinishing);
    };

    const setLevelDemotionState = (): void => {
        setState(GameStateEnum.levelDemotion);
    };

    const setLevelPromotionState = (): void => {
        setState(GameStateEnum.levelPromotion);
    };

    const setPromptState = (): void => {
        setState(GameStateEnum.prompt);
    };

    /** ************************************************************************************************************************ Проверки */

    const isInLevelPreparingState = (): boolean => {
        return isState(GameStateEnum.levelPreparing);
    };

    const isInGamePreparingState = (): boolean => {
        return isState(GameStateEnum.gamePreparing);
    };

    const isInRoundPreparingState = (): boolean => {
        return isState(GameStateEnum.roundPreparing);
    };

    const isInContemplationState = (): boolean => {
        return isState(GameStateEnum.contemplation);
    };

    const isInInteractiveState = (): boolean => {
        return isState(GameStateEnum.interactive);
    };

    const isInFailedRoundFinishingState = (): boolean => {
        return isState(GameStateEnum.failedRoundFinishing);
    };

    const isInSuccessfulRoundFinishingState = (): boolean => {
        return isState(GameStateEnum.successfulRoundFinishing);
    };

    const isInRoundFinishingState = (): boolean => {
        return isInSuccessfulRoundFinishingState() || isInFailedRoundFinishingState();
    };

    const isInLevelFinishingState = (): boolean => {
        return isInLevelDemotionState() || isInLevelPromotionState();
    };

    const isInLevelDemotionState = (): boolean => {
        return isState(GameStateEnum.levelDemotion);
    };

    const isInLevelPromotionState = (): boolean => {
        return isState(GameStateEnum.levelPromotion);
    };

    const isInPromptState = (): boolean => {
        return isState(GameStateEnum.prompt);
    };

    return {
        setLevelPreparingState,
        setGamePreparingState,
        setRoundPreparingState,
        setContemplationState,
        setInteractiveState,
        setFailedRoundFinishingState,
        setSuccessfulRoundFinishingState,
        setLevelDemotionState,
        setLevelPromotionState,
        setPromptState,
        gameState,
        isInLevelPreparingState,
        isInGamePreparingState,
        isInRoundPreparingState,
        isInContemplationState,
        isInInteractiveState,
        isInFailedRoundFinishingState,
        isInSuccessfulRoundFinishingState,
        isInRoundFinishingState,
        isInLevelFinishingState,
        isInLevelDemotionState,
        isInLevelPromotionState,
        isInPromptState,

        totalTime,
        startTotalTimer,
        stopTotalTimer,

        roundTime,
        totalRoundTime,
        showRoundTimeLine,
        setRoundTime,
        startRoundTimer,
        stopRoundTimer,

        countdown,
        startCountdown,

        isRoundFailed,
        incorrectAnswersOnRound,
        incorrectAnswerReactions,
        markRoundAsFailed,
        clearIncorrectAnswers,
    };
});
