import { defineStore } from 'pinia';
import { GameStateEnum } from '~/entities/enums/games/GameStateEnum';
import type { IGameLevels } from '~/entities/interfaces/games/IGameLevels';
import type { BaseResponse } from '~/entities/interfaces/responses/BaseResponse';
import type { IGameLevel } from '~/entities/interfaces/games/IGameLevel';
import type { IBaseGameLevel } from '~/entities/interfaces/games/IBaseGameLevel';
import { useEmitGameEvent } from '~/composables/useGameEventBus';
import type { IGameResult } from '~/entities/interfaces/games/IGameResult';
import { GameModeEnum } from '~/entities/enums/games/GameModeEnum';
import { GameRegimeEnum } from '~/entities/enums/games/GameRegimeEnum';
import type { GameMessage } from '~/entities/types/GameMessage';
import type { GamePrompt } from '~/entities/types/GamePrompt';

// Базовый стор, отвечающий за действия, характерные всем играм
export const useGameStore = defineStore('gameStorage', () => {
    const COUNTDOWN_INITIAL_VALUE: number = 3;

    const TIME_TO_SHOW_INCORRECT_ANSWER_REACTION = 1000;

    /**
     * Текущий мод игры.
     */
    const mode = ref<GameModeEnum>(GameModeEnum.warmUp);

    /**
     * Текущий режим игры.
     */
    const regime = ref<GameRegimeEnum>(GameRegimeEnum.default);

    const service = useGameService();

    /**
     * Время на игру в секундах, скорее сего, будет приходить с бэка
     * todo: implement logic to get game duration from backend
     */
    const totalTime = ref<number>(90);

    /**
     * Идентификатор таймера, ответственного за уменьшение переменной totalTime
     */
    let totalTimerId: ReturnType<typeof setTimeout> | null = null;

    /**
     * Время, отведенное на запоминание условий или на ответ.
     * Обновляется при переходе в режим contemplation (на время на запоминание) и в режим interactive (на время на ответ).
     */
    const roundTime = ref<number>(0);

    /**
     * Вспомогательная переменная, хранит оставшееся значение времени roundTime.
     */
    const roundTimeLeft = ref<number>(0);

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
     * Максимальное допустимое количество разминочных раундов, доступное для выбора пользователем.
     */
    const maxWarmUpLevelsAmount: number = 3;

    /**
     * Количество разминочных раундов, которое установил пользователь.
     */
    const warmUpLevelsAmount = ref<number>(1);

    /**
     * Количество разминочных раундов, уже сыгранных пользователем.
     * Используется для отслеживания момента, когда необходимо переключить разминочный мод.
     */
    const playedWarmUpLevelsAmount = ref<number>(0);

    /**
     * Сигнализирует о том, что игра будет сыграна в рамках сессии.
     */
    const withinSession = ref<boolean>(false);

    /**
     * Сигнализирует о том, что выбран режим бесконечной игры.
     */
    const infinityGame = ref<boolean>(false);

    /**
     * Предыдущее состояние игры.
     */
    const previousState = ref<GameStateEnum>();

    const gameState = ref<GameStateEnum>();

    /**
     *
     */
    const message = ref<GameMessage>({ text: '', translatable: false });

    /**
     * Содержимое подсказки
     */
    const prompt = ref<GamePrompt>({ content: '', translatable: false });

    /**
     * Переменная, хранящая функцию для разрешения промиса, который ответственен за показ подсказки пользователю во время теста.
     */
    let promptResolver: (() => void) | undefined;

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

    let accumulatedReactionTime: number = 0;

    /**
     * Хранит интервалы времени, затраченные пользователем на завершение каждого из сыгранных раундов.
     */
    const reactionTimes: number[] = [];

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

    const isGameTimeOver = computed((): boolean => {
        return totalTime.value <= 0;
    });

    const maxLevelNumber = computed((): number => {
        return Number(Object.keys(levels.value).at(-1));
    });

    const setMessage = (value: string | number): void => {
        message.value = {
            text: value,
            translatable: false,
        };
    };

    const setTranslatableMessage = (value: string): void => {
        message.value = {
            text: value,
            translatable: true,
        };
    };

    const clearMessage = (): void => {
        message.value = { text: '', translatable: false };
    };

    const isMessageSet = () => {
        return message.value.text !== '';
    };

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

        const tick = async () => {
            if (isInPauseState()) {
                await pausePromise;
            }

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
     * Вспомогательная переменная для виджетов, связанных с временем, отведенным на раунд.
     */
    const showRoundTimeLine = computed((): boolean => {
        return isInContemplationState() || isInInteractiveState();
    });

    /**
     * Устанавливает значение переменной roundTime (которая будет изменяться по ходу раунда)
     * и вспомогательной переменной totalRoundTime
     * @param seconds время в секундах
     */
    const setRoundTime = (seconds: number): void => {
        roundTimeLeft.value = roundTime.value = seconds;
    };

    /**
     * Запускает таймер раунда. Отвечает за логику ограничения времени на запоминание/ответ.
     */
    const startRoundTimer = (): Promise<void> => {
        return new Promise((resolve) => {
            if (isRoundTimerStarted()) {
                return;
            }

            roundTick(resolve);
            // roundTimerId = setTimeout(() => roundTick(resolve), 1000);
        });
    };

    /**
     * Уменьшает переменную roundTime на единицу каждую секунду.
     * @param resolve
     */
    const roundTick = async (resolve: (value: void | PromiseLike<void>) => void): Promise<void> => {
        if (isInPauseState()) {
            await pausePromise;
        }

        if (roundTimeLeft.value <= 0) {
            stopRoundTimer();
            resolve();
        } else {
            decreaseRoundTime();
            roundTimerId = setTimeout(() => roundTick(resolve), 1000);
        }
    };

    /**
     * Уменьшает значение переменной roundTime на единицу.
     */
    const decreaseRoundTime = (): void => {
        roundTimeLeft.value--;
    };

    /**
     * Останавливает уменьшение переменной roundTime.
     */
    const stopRoundTimer = (): void => {
        if (roundTimerId) {
            clearTimeout(roundTimerId);
            roundTimerId = null;
        }
    };

    /**
     * Сбрасывает таймер раунда.
     */
    const resetRoundTimer = (): void => {
        stopRoundTimer();
        setRoundTime(0);
    };

    /**
     * Проверяет, запущено ли уменьшение времени roundTime.
     */
    const isRoundTimerStarted = (): boolean => {
        return roundTimerId !== null;
    };

    /** ***************************************************************************************************************** Обратный отсчёт */

    /**
     * Запускает обратный отсчёт.
     */
    const startCountdown = (): Promise<void> => {
        return new Promise((resolve) => {
            if (isCountdownStarted()) {
                return;
            }

            countdownTimerId = setTimeout(() => countdownTick(resolve), 1000);
        });
    };

    /**
     * Уменьшает переменную countdown на единицу каждую секунду.
     * @param resolve
     */
    const countdownTick = async (resolve: (value: void | PromiseLike<void>) => void): Promise<void> => {
        if (isInPauseState()) {
            await pausePromise;
            resetCountdown();
        }

        if (countdown.value <= 1) {
            resetCountdown();

            if (isInGameMode() && isInDefaultRegime()) {
                startTotalTimer();
            }

            resolve();
        } else {
            decreaseCountdown();
            countdownTimerId = setTimeout(() => countdownTick(resolve), 1000);
        }
    };

    /**
     * Уменьшает значение переменной countdown на единицу.
     */
    const decreaseCountdown = () => {
        countdown.value--;
    };

    /**
     * Проверяет, запущен ли обратный отсчёт (уменьшение переменной countdown).
     */
    const isCountdownStarted = () => {
        return countdownTimerId !== null;
    };

    /**
     * Останавливает обратный отсчёт, очищая соответствующий timerId.
     */
    const stopCountdown = () => {
        if (countdownTimerId) {
            clearTimeout(countdownTimerId);
            countdownTimerId = null;
        }
    };

    /**
     * Останавливает обратный отсчёт и сбрасывает значение переменной countdown.
     */
    const resetCountdown = () => {
        stopCountdown();
        countdown.value = COUNTDOWN_INITIAL_VALUE;
    };

    /** ************************************************************************************************************************** - */

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

    /** ************************************************************************************************************************** Режимы */

    /**
     * Устанавливает переданный режим.
     * @param regimeToSet
     */
    const setRegime = (regimeToSet: GameRegimeEnum): void => {
        regime.value = regimeToSet;
    };

    /**
     * Проверяет соответствие переданного режима текущему.
     * @param regimeToCheck
     */
    const isRegime = (regimeToCheck: GameRegimeEnum): boolean => {
        return regime.value === regimeToCheck;
    };

    const setInfiniteRegime = () => {
        setRegime(GameRegimeEnum.infinite);
    };

    const setDefaultRegime = () => {
        setRegime(GameRegimeEnum.default);
    };

    const isInInfiniteRegime = (): boolean => {
        return isRegime(GameRegimeEnum.infinite);
    };

    const isInDefaultRegime = (): boolean => {
        return isRegime(GameRegimeEnum.default);
    };

    /** **************************************************************************************************************************** Моды */

    /**
     * Устанавливает переданный мод.
     * @param modeToSet
     */
    const setMode = (modeToSet: GameModeEnum): void => {
        mode.value = modeToSet;
    };

    /**
     * Проверяет соответствие переданного мода текущему.
     * @param modeToCheck
     */
    const isMode = (modeToCheck: GameModeEnum): boolean => {
        return mode.value === modeToCheck;
    };

    const setWarmUpMode = () => {
        setMode(GameModeEnum.warmUp);
    };

    const setGameMode = () => {
        setMode(GameModeEnum.game);
    };

    const isInWarmUpMode = (): boolean => {
        return isMode(GameModeEnum.warmUp);
    };

    const isInGameMode = (): boolean => {
        return isMode(GameModeEnum.game);
    };

    /** *********************************************************************************************************************** Состояния */

    const setState = (state: GameStateEnum): void => {
        previousState.value = gameState.value;
        gameState.value = state;
    };

    const isState = (state: GameStateEnum): boolean => {
        return gameState.value === state;
    };

    const setLevelPreparingState = (): void => {
        setState(GameStateEnum.levelPreparing);
    };

    const handleLevelPreparing = async () => {
        successfulRoundsStreak = 0;
        unsuccessfulRoundsStreak = 0;

        stopTotalTimer();
        setLevelPreparingState();

        await startCountdown();

        if (isInDefaultRegime() && isInGameMode()) {
            startTotalTimer();
        }
    };

    const handleGamePreparing = async () => {
        await handleLevelPreparing();
    };

    const setGamePreparingState = (): void => {
        setState(GameStateEnum.gamePreparing);
    };

    const setRoundPreparingState = (): void => {
        setState(GameStateEnum.roundPreparing);
    };

    const handleRoundPreparing = (): void => {
        setRoundTime(currentLevel.value.timeToContemplate);

        isRoundFailed = false;
        setRoundPreparingState();
    };

    const setContemplationState = (): void => {
        setState(GameStateEnum.contemplation);
    };

    const handleInteractive = async (): Promise<void> => {
        stopRoundTimer();
        setRoundTime(currentLevel.value.timeToAnswer);
        setInteractiveState();

        await startRoundTimer();
    };

    const handleContemplation = async (): Promise<void> => {
        setContemplationState();
        startReactionTimer();

        await startRoundTimer();
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

    const setPauseState = (): void => {
        setState(GameStateEnum.pause);
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

    const isInPauseState = (): boolean => {
        return isState(GameStateEnum.pause);
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
        // todo: isInConstructorRegime() check
        if (isInWarmUpMode()) {
            return false;
        }

        return isTimeToPromoteLevel() || isTimeToDemoteLevel();
    };

    const handleLevelChanging = (): void => {
        stopTotalTimer();

        switch (true) {
            case isTimeToPromoteLevel():
                return handleLevelPromotion();
            case isTimeToDemoteLevel():
                return handleLevelDemotion();
        }
    };

    const handleLevelPromotion = () => {
        currentUserLevel.value++;

        // Сохраняем открытый пользователем уровень
        if (currentUserLevel.value > maxUserLevel.value) {
            maxUserLevel.value = currentUserLevel.value;
        }

        setLevelPromotionState();
    };

    const handleLevelDemotion = () => {
        currentUserLevel.value--;
        setLevelDemotionState();
    };

    const calculateMeanReactionTime = (): number => {
        const meanSec = useMean(reactionTimes) / 1000;

        return Number(meanSec.toFixed(2));
    };

    const calculateAccuracy = (): number => {
        const accuracy = ((totalAnswersAmount - totalIncorrectAnswersAmount) / totalAnswersAmount) * 100;

        return Number(accuracy.toFixed(1));
    };

    const getResults = (): IGameResult => {
        // todo
        const gamePage = useGamePageStore();

        return {
            game: gamePage.game as string,
            finishedAtTheLevel: currentUserLevel.value,
            maxUnlockedLevel: maxUserLevel.value,
            meanReactionTime: calculateMeanReactionTime(),
            accuracy: calculateAccuracy(),
            withinSession: false, // todo: implement withinSession logic
        };
    };

    const isTimeToSwitchMode = computed((): boolean => {
        return playedWarmUpLevelsAmount.value >= warmUpLevelsAmount.value && isInWarmUpMode();
    });

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

    /**
     * todo: //
     */
    const setPrompt = (content: string, translatable: boolean = false): Promise<void> => {
        closePrompt();

        prompt.value = {
            content,
            translatable,
        };

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

    const destroyPrompt = () => {
        promptResolver = undefined;
    };

    const handleModeSwitching = async () => {
        setGameMode();
        setTranslatableMessage('warmUpCompleted');
        await setPrompt('gameStartPrompt');

        clearMessage();

        if (isInDefaultRegime()) {
            startTotalTimer();
        }
    };

    const handleGameFinishingState = async () => {
        const gamePage = useGamePageStore();

        if (isInDefaultRegime()) {
            await service.saveResults(getResults());
        }

        gamePage.selectResultTab();
    };

    const checkMode = async () => {
        if (isInWarmUpMode() && isTimeToSwitchMode.value) {
            await handleModeSwitching();
        }
    };

    const handleRoundFinishing = () => {
        if (isInGameMode() && isInDefaultRegime()) {
            storeAndResetReactionTime(); // Записываем время, затраченное пользователем на раунд
        }

        stopRoundTimer(); // Останавливаем уменьшение времени roundTime

        if (isInWarmUpMode()) {
            playedWarmUpLevelsAmount.value++;
        }

        if (isRoundFailed) {
            handleFailedRoundFinishing();
        } else {
            handleSuccessfulRoundFinishing();
        }
    };

    const handleSuccessfulRoundFinishing = () => {
        if (isInGameMode()) {
            unsuccessfulRoundsStreak = 0;
            successfulRoundsStreak++;
        }

        setSuccessfulRoundFinishingState();
    };

    const handleFailedRoundFinishing = () => {
        if (isInGameMode()) {
            successfulRoundsStreak = 0;
            unsuccessfulRoundsStreak++;
        }

        setFailedRoundFinishingState();
    };

    const handleAnswering = () => {
        if (isInGameMode() && isInDefaultRegime()) {
            totalAnswersAmount++;
        }
    };

    const handleIncorrectAnswering = () => {
        if (isInGameMode() && isInDefaultRegime()) {
            totalIncorrectAnswersAmount++;
        }

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
        resetCountdown();
        resetRoundTimer();
        resetLevels();
    };

    /**
     * Установка мода игры в зависимости от выбора количества разминочных раундов.
     */
    watch(warmUpLevelsAmount, (newVal) => {
        if (isInGamePreparingState()) {
            if (newVal === 0) {
                setGameMode();
            } else {
                setWarmUpMode();
            }
        }
    });

    /**
     * Установка режима игры.
     */
    watch(infinityGame, (newVal) => {
        if (isInGamePreparingState()) {
            if (newVal) {
                setInfiniteRegime();
            } else {
                setDefaultRegime();
            }
        }
    });

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

        handleGamePreparing,
        handleLevelPreparing,
        handleRoundPreparing,
        handleContemplation,
        handleInteractive,
        handleRoundFinishing,
        handleLevelChanging,
        handleGameFinishingState,
        handleAnswering,
        handleIncorrectAnswering,

        // Работа с модами
        isTimeToSwitchMode,
        checkMode,
        setWarmUpMode,
        setGameMode,
        isInWarmUpMode,
        isInGameMode,
        // handleModeSwitching,

        // Работа с режимами
        isInInfiniteRegime,
        isInDefaultRegime,

        // Работа с сообщениями
        message,
        setMessage,
        setTranslatableMessage,
        clearMessage,
        isMessageSet,

        // Работа с промптами
        prompt,
        setPrompt,
        closePrompt,

        // Работа с паузами
        getPausePromise,
        setPause,
        endPause,

        isGameTimeOver,
        totalTime,
        startTotalTimer,
        stopTotalTimer,

        // Работа с временем раунда
        roundTime,
        roundTimeLeft,
        showRoundTimeLine,

        countdown,
        startCountdown,

        isRoundFailed,
        // incorrectAnswersOnRound,
        incorrectAnswerReactions,
        markRoundAsFailed,

        currentLevel,
        currentUserLevel,
        maxUserLevel,
        maxLevelNumber,
        levels,

        isTimeToPromoteLevel,
        isTimeToDemoteLevel,
        isTimeToChangeLevel,

        isFinalLevel,
        isFirstLevel,

        maxWarmUpLevelsAmount,
        warmUpLevelsAmount,
        playedWarmUpLevelsAmount,
        withinSession,
        infinityGame,

        $setup,
        $reset,
    };
});
