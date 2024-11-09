import { defineStore } from 'pinia';
import { GameStateEnum } from '~/entities/enums/games/GameStateEnum';
import type { IGameLevels } from '~/entities/interfaces/games/IGameLevels';
import type { BaseResponse } from '~/entities/interfaces/responses/BaseResponse';
import type { IGameLevel } from '~/entities/interfaces/games/IGameLevel';
import type { IBaseGameLevel } from '~/entities/interfaces/games/IBaseGameLevel';
import { useEmitGameEvent } from '~/composables/useGameEventBus';

// Базовый стор, отвечающий за действия, характерные всем играм
export const useGameStore = defineStore('gameStorage', () => {
    const COUNTDOWN_INITIAL_VALUE: number = 3;

    const TIME_TO_SHOW_INCORRECT_ANSWER_REACTION = 1000;

    const service = useGameService();

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
     * Количество раундов, в которых был дан правильный ответ, идущих подряд.
     */
    let successfulRoundsStreak: number = 0;

    /**
     * Количество раундов, в которых был дан неправильный ответ, идущих подряд.
     */
    let unsuccessfulRoundsStreak: number = 0;

    /**
     * Сигнализирует о том, что в текущем раунде была допущена ошибка при ответе.
     * todo: deprecated
     */
    const incorrectAnswersOnRound = ref<number>(0);

    /**
     * Вспомогательная переменная, отвечают за анимацию виджетов шаблона при неправильном ответе.
     * При каждом неправильном ответе, данная переменная увеличивается на определённое время, и на поле появляется
     * новый элемент, сигнализирующий о неправильном ответе.
     */
    const incorrectAnswerReactions = ref<{ id: number }[]>([]);

    /**
     * Номер максимально открытого пользователем уровня в текущей игре.
     */
    const maxUserLevel = ref<number>(0);

    /**
     * Номер текущего уровня пользователя.
     */
    const currentUserLevel = ref<number>(0);

    const levels = ref<IGameLevel<IBaseGameLevel>>({});

    /**
     * Предыдущее состояние игры.
     */
    const previousState = ref<GameStateEnum>();

    const gameState = ref<GameStateEnum>();

    /**
     * Полное число ответов, данных пользователем за всю игру. Используется для подсчёта точности.
     */
    let totalAnswersAmount: number = 0;

    /**
     * Полное число неверных ответов, данных пользователем за всю игру. Используется для подсчёта точности.
     */
    let totalIncorrectAnswersAmount: number = 0;

    let isRoundFailed: boolean = false;

    /**
     * Возвращает текущий уровень.
     */
    const currentLevel = computed((): IBaseGameLevel => {
        return levels.value[currentUserLevel.value];
    });

    /** ******************************************************************************************************************* Время реакции */
    let startReactionTime: number;

    let endReactionTime: number;

    let accumulatedReactionTime: number;

    /**
     * Хранит интервалы времени, затраченные пользователем на завершение каждого из сыгранных раундов.
     */
    const reactionTimes: number[] = [];

    const isGameTimeOver = computed((): boolean => {
        return totalTime.value <= 0;
    });

    /**
     * Метод для начала измерения времени.
     */
    function startReactionTimer() {
        startReactionTime = Date.now();
    }

    /**
     * Метод для остановки таймера и накопления времени.
     */
    function stopReactionTimer() {
        const endReactionTime = Date.now();
        accumulatedReactionTime += endReactionTime - startReactionTime;
    }

    const storeAndResetReactionTime = () => {
        stopReactionTimer();

        reactionTimes.push(accumulatedReactionTime);

        startReactionTime = 0;
        endReactionTime = 0;
        accumulatedReactionTime = 0;
    };

    /** **************************************************************************************************************** Таймер totalTime */

    /**
     * Инициирует уменьшение переменной totalTime (на единицу каждую секунду)
     */
    const startTotalTimer = () => {
        // check that totalTimerId is not null (means the timer has already started)
        if (isTotalTimerStarted()) {
            return;
        }

        const tick = () => {
            if (isGameTimeOver.value) {
                useEmitGameEvent('game:timeIsOver');
                stopTotalTimer();
            } else {
                decreaseTotalTime();
                totalTimerId = setTimeout(tick, 1000);
            }
        };

        totalTimerId = setTimeout(tick, 1000);
    };

    /**
     * Останавливает уменьшение переменной totalTime
     */
    const stopTotalTimer = () => {
        if (isTotalTimerStarted()) {
            // @ts-expect-error: we check totalTimerId is not null already
            clearTimeout(totalTimerId);
        }

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
        return isInContemplationState() || isInInteractiveState();
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

                if (isInInteractiveState()) {
                    useEmitGameEvent('game:answeringTimeIsOver');
                }

                if (isInContemplationState()) {
                    useEmitGameEvent('game:contemplationTimeIsOver');
                }

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
        const reactionId = Date.now();
        incorrectAnswerReactions.value.push({ id: reactionId });

        setTimeout(() => {
            incorrectAnswerReactions.value = incorrectAnswerReactions.value.filter((reaction) => reaction.id !== reactionId);
        }, TIME_TO_SHOW_INCORRECT_ANSWER_REACTION);
    };

    /** *********************************************************************************************************************** Состояния */

    const setState = (state: GameStateEnum): void => {
        // Записываем время перехода в данный режим
        if (state === GameStateEnum.contemplation) {
            startReactionTimer();
        }

        // Записываем время, потраченное на раунд (показатель времени реакции пользователя)
        if (state === GameStateEnum.failedRoundFinishing || state === GameStateEnum.successfulRoundFinishing) {
            storeAndResetReactionTime();
        }

        // todo: обработка режима паузы

        previousState.value = gameState.value;
        gameState.value = state;
    };

    const isState = (state: GameStateEnum): boolean => {
        return gameState.value === state;
    };

    const setLevelPreparingState = (): void => {
        setState(GameStateEnum.levelPreparing);
    };

    const handleLevelPreparing = () => {
        successfulRoundsStreak = 0;
        unsuccessfulRoundsStreak = 0;

        setLevelPreparingState();
    };

    const handleGamePreparing = async () => {
        handleLevelPreparing();

        await startCountdown();

        startTotalTimer();
    };

    const setGamePreparingState = (): void => {
        setState(GameStateEnum.gamePreparing);
    };

    const setRoundPreparingState = (): void => {
        setState(GameStateEnum.roundPreparing);
    };

    const handleRoundPreparing = (): void => {
        // todo: обновляем значение времени на ответ перед началом нового раунда.
        setRoundTime(currentLevel.value.timeToContemplate);

        isRoundFailed = false;
        setRoundPreparingState();
    };

    const setContemplationState = (): void => {
        setState(GameStateEnum.contemplation);
    };

    const handleInteractive = () => {
        stopRoundTimer();

        setRoundTime(currentLevel.value.timeToAnswer);
        startRoundTimer();

        setInteractiveState();
    };

    const handleContemplation = (): void => {
        startRoundTimer();
        startReactionTimer();
        setContemplationState();
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

    const setGameFinishingState = (): void => {
        setState(GameStateEnum.gameFinishing);
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

    const isInGameFinishingState = (): boolean => {
        return isState(GameStateEnum.gameFinishing);
    };

    const isInPromptState = (): boolean => {
        return isState(GameStateEnum.prompt);
    };

    const setupLevels = async () => {
        const response: BaseResponse<IGameLevels<any>> = await service.fetchLevels();

        maxUserLevel.value = response.data.maxLevel;
        currentUserLevel.value = response.data.userLevel;
        levels.value = response.data.levels;
    };

    const resetLevels = () => {
        maxUserLevel.value = 0;
        currentUserLevel.value = 0;
        levels.value = {};
    };

    /**
     * Определяет, является ли текущий уровень максимальным уровнем в игре.
     */
    const isFinalLevel = (): boolean => {
        return currentUserLevel.value === Number(Object.keys(levels.value).at(-1));
    };

    /**
     * Определяет, является ли текущий уровень минимальным уровнем в игре.
     */
    const isFirstLevel = (): boolean => {
        return currentUserLevel.value === Number(Object.keys(levels.value).at(0));
    };

    /**
     * Определяет, следует ли повышать уровень игры.
     */
    const isTimeToPromoteLevel = (): boolean => {
        return !isFinalLevel() && successfulRoundsStreak >= currentLevel.value.correctAnswersBeforePromotion;
    };

    /**
     * Определяет, следует ли понижать уровень игры.
     */
    const isTimeToDemoteLevel = (): boolean => {
        return !isFirstLevel() && unsuccessfulRoundsStreak >= currentLevel.value.incorrectAnswersBeforeDemotion;
    };

    const isTimeToChangeLevel = (): boolean => {
        return isTimeToPromoteLevel() || isTimeToDemoteLevel();
    };

    const handleLevelChanging = (): void => {
        switch (true) {
            case isTimeToPromoteLevel():
                return handleLevelPromotion();
            case isTimeToDemoteLevel():
                return handleLevelDemotion();
        }
    };

    const handleLevelPromotion = () => {
        currentUserLevel.value++;
        setLevelPromotionState();
    };

    const handleLevelDemotion = () => {
        currentUserLevel.value--;
        setLevelDemotionState();
    };

    // const finishRoundWithFailure = () => {
    //     setFailedRoundFinishingState();
    // };
    //
    // const finishRoundWithSuccess = () => {
    //     setSuccessfulRoundFinishingState();
    // };

    const handleRoundFinishing = () => {
        stopRoundTimer(); // Останавливаем уменьшение времени roundTime

        if (isRoundFailed) {
            handleFailedRoundFinishing();
        } else {
            handleSuccessfulRoundFinishing();
        }
    };

    const handleSuccessfulRoundFinishing = () => {
        unsuccessfulRoundsStreak = 0;
        successfulRoundsStreak++;

        setSuccessfulRoundFinishingState();
    };

    const handleFailedRoundFinishing = () => {
        successfulRoundsStreak = 0;
        unsuccessfulRoundsStreak++;

        setFailedRoundFinishingState();
    };

    const handleAnswering = () => {
        totalAnswersAmount++;
    };

    const handleIncorrectAnswering = () => {
        totalIncorrectAnswersAmount++;
        markRoundAsFailed();
    };

    const markRoundAsFailed = () => {
        isRoundFailed = true;
        addReaction();
    };

    const $setup = async () => {
        setGamePreparingState();
        await setupLevels();
    };

    const $reset = () => {
        resetLevels();
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
        setGameFinishingState,
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
        isInGameFinishingState,
        isInPromptState,

        handleRoundPreparing,
        handleContemplation,
        handleInteractive,
        handleLevelPreparing,
        handleLevelChanging,
        handleRoundFinishing,
        handleAnswering,
        handleIncorrectAnswering,
        handleGamePreparing,

        isGameTimeOver,
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

        currentLevel,
        currentUserLevel,
        maxUserLevel,
        levels,

        isTimeToPromoteLevel,
        isTimeToDemoteLevel,
        isTimeToChangeLevel,

        isFinalLevel,
        isFirstLevel,

        $setup,
        $reset,
    };
});
