import { defineStore } from 'pinia';
import { mean } from 'lodash-es';
import { GameStateEnum } from '~/entities/enums/games/GameStateEnum';
import type { IGameLevels } from '~/entities/interfaces/games/IGameLevels';
import type { IGameLevel } from '~/entities/interfaces/games/IGameLevel';
import type { IBaseGameLevel } from '~/entities/interfaces/games/IBaseGameLevel';
import { GameModeEnum } from '~/entities/enums/games/GameModeEnum';
import { GameRegimeEnum } from '~/entities/enums/games/GameRegimeEnum';
import type { GameMessage } from '~/entities/types/GameMessage';
import type { GamePrompt } from '~/entities/types/GamePrompt';
import type { IFinishedGame } from '~/entities/interfaces/games/IFinishedGame';

/**
 * Базовый стор, отвечающий за операции, свойственные всем играм: переключением модов и режимов, запуск таймеров, сбор статистик и сохранение результатов.
 * Также предоставляет методы для работы с сообщениями и подсказками на игровом поле.
 */
export const useGameStore = defineStore('gameStorage', () => {
    /**
     * Количество чисел в обратном отсчёте.
     */
    const COUNTDOWN_INITIAL_VALUE: number = 3;

    /**
     * Время, на которое показывается реакция игрового поля после неправильного ответа
     */
    const TIME_TO_SHOW_INCORRECT_ANSWER_REACTION = 1000;

    /**
     * Сервис с вспомогательными методами (в основном, для запросов к серверу).
     */
    const service = useGameService();

    /**
     * Состояние страницы.
     */
    const page = useGamePageStore();

    /**
     * Переведенное название игры.
     */
    const gameName = ref<string>('');

    /**
     * Изображение.
     */
    const image = ref<string>('');

    /**
     * Текущий режим игры.
     */
    const regime = ref<GameRegimeEnum>(GameRegimeEnum.default);

    /**
     * Текущий мод игры.
     */
    const mode = ref<GameModeEnum>(GameModeEnum.warmUp);

    /**
     * Текущее состояние игры.
     */
    const state = ref<GameStateEnum>();

    /**
     * Предыдущее состояние игры.
     */
    const previousState = ref<GameStateEnum>();

    /**
     * Переменная, в которой хранятся уровни текущей игры.
     */
    const levels = ref<IGameLevel<IBaseGameLevel>>({});

    /**
     * Время, отведённое на игру.
     */
    // const totalTime = ref<number>(90);
    const totalTime = ref<number>(0);

    /**
     * Оставшееся игровое время.
     */
    const totalTimeLeft = ref<number>(0);

    /**
     * Идентификатор таймера, ответственного за уменьшение переменной totalTimeLeft.
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
     * Идентификатор таймера, ответственного за уменьшение переменной roundTime
     */
    let roundTimerId: ReturnType<typeof setTimeout> | null = null;

    /**
     * Текущее значение обратного отсчёта.
     */
    const countdown = ref<number>(COUNTDOWN_INITIAL_VALUE);

    /**
     * Идентификатор таймера, ответственного за обратный отсчёт.
     */
    let countdownTimerId: ReturnType<typeof setTimeout> | null = null;

    /**
     * Количество раундов, в которых был дан правильный ответ, идущих подряд.
     */
    const successfulRoundsStreak = ref<number>(0);

    /**
     * Количество раундов, в которых был дан неправильный ответ, идущих подряд.
     */
    const failedRoundsStreak = ref<number>(0);

    /**
     * Количество неверных ответов в раунде.
     */
    let incorrectAnswersOnRound: number = 0;

    /**
     * Количество верных ответов в раунде.
     */
    let correctAnswersOnRound: number = 0;

    /**
     * Переменная, сигнализирующая о том, что текущий раунд объявлен неуспешным.
     */
    let isRoundFailedFlag: boolean = false;

    /**
     * Номер максимально открытого пользователем уровня в текущей игре.
     */
    const maxUserLevel = ref<number>(0);

    /**
     * Номер текущего уровня пользователя.
     */
    const currentUserLevel = ref<number>(0);

    /**
     * Изначальный уровень пользователя. Не меняется в течение игры.
     */
    let initialUserLevel = 0;

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
     * Переменная, используемая для вывода сообщения.
     */
    const message = ref<GameMessage>({ text: '', translatable: false });

    /**
     * Переменная, используемая для вывода подсказок.
     */
    const prompt = ref<GamePrompt>({ content: '', translatable: false });

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
     * Полное число верных ответов, данных пользователем за всю игру.
     */
    let totalCorrectAnswersAmount: number = 0;

    /**
     * Полное число неверных ответов, данных пользователем за всю игру.
     */
    let totalIncorrectAnswersAmount: number = 0;

    /**
     * Количество очков за игру.
     */
    const totalScore = ref<number>(0);

    /**
     * Количество очков, которое пользователю необходимо набрать, чтобы выполнить цель
     */
    const target = ref<number>(0);

    /**
     * Метка времени, в которое был осуществлен переход в состояние запоминания.
     */
    let startReactionTime: number;

    /**
     * Метка времени, в которое был осуществлен выход из состояния ответа.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let endReactionTime: number;

    /**
     * Суммарное время, затраченное на ответ, с учетом перерывов на паузы.
     */
    let accumulatedReactionTime: number = 0;

    /**
     * Хранит интервалы времени, затраченные пользователем на завершение каждого из сыгранных раундов.
     */
    const reactionTimes: number[] = [];

    /**
     * Вспомогательная переменная, отвечают за анимацию виджетов шаблона при неправильном ответе.
     * При каждом неправильном ответе, данная переменная увеличивается на определённое время, и на поле появляется
     * новый элемент, сигнализирующий о неправильном ответе.
     */
    const incorrectAnswerReactions = ref<{ id: number }[]>([]);

    /**
     * Переменная, сигнализирующая о том, что пользователь выполнил цель в данной игре.
     */
    const isTargetCompleted = ref<boolean>(false);

    /**
     * Переменная с результатом игры.
     */
    // let results: IGameResult | undefined;

    const gameData: IFinishedGame = {
        results: undefined,
        successfullySaved: false,
        hasGameCompletedSession: false,
        hasGameCompletedProgram: false,
    };

    /**
     * Текущий уровень игры.
     */
    const currentLevel = computed((): IBaseGameLevel => {
        return levels.value[currentUserLevel.value];
    });

    /**
     * Максимальный уровень в текущей игре.
     */
    const maxLevelNumber = computed((): number => {
        return Number(Object.keys(levels.value).at(-1));
    });

    /**
     * Переменная, сигнализирующая об окончании игрового времени.
     */
    const isGameTimeOver = computed((): boolean => {
        return totalTimeLeft.value <= 0;
    });

    /**
     * Определяет, является ли текущий уровень максимальным уровнем в игре.
     */
    const isFinalLevel = computed((): boolean => {
        return currentUserLevel.value === Number(Object.keys(levels.value).at(-1));
    });

    /**
     * Определяет, является ли текущий уровень минимальным уровнем в игре.
     */
    const isFirstLevel = computed((): boolean => {
        return currentUserLevel.value === Number(Object.keys(levels.value).at(0));
    });

    /**
     * Вспомогательная переменная для виджетов, связанных с временем, отведенным на раунд.
     */
    const showRoundTimeLine = computed((): boolean => {
        return isInContemplationState() || isInInteractiveState();
    });

    /**
     * Переменная, сигнализирующая о необходимости переключения мода игры.
     */
    const isTimeToSwitchMode = computed((): boolean => {
        return playedWarmUpLevelsAmount.value >= warmUpLevelsAmount.value && isInWarmUpMode();
    });

    /**
     * Проверяет, считается ли текущий раунд неуспешным. Раунд может быть засчитан неуспешным в двух случаях:
     * если количество неправильных ответов достигло максимального допустимого числа, или если раунд был помечен как неуспешным конкретным игровым стором.
     */
    const isRoundFailed = (): boolean => {
        return isRoundFailedFlag || incorrectAnswersOnRound >= currentLevel.value.incorrectAnswersToFail;
    };

    /**
     * Определяет, следует ли повышать уровень игры.
     */
    const isTimeToPromoteLevel = (): boolean => {
        return !isFinalLevel.value && successfulRoundsStreak.value >= currentLevel.value.successfulRoundsBeforePromotion;
    };

    /**
     * Определяет, следует ли понижать уровень игры.
     */
    const isTimeToDemoteLevel = (): boolean => {
        return !isFirstLevel.value && failedRoundsStreak.value >= currentLevel.value.failedRoundsBeforeDemotion;
    };

    /**
     * Определяет, следует ли менять уровень игры.
     */
    const isTimeToChangeLevel = (): boolean => {
        if (isInWarmUpMode() || isInConstructorRegime()) {
            return false;
        }

        return isTimeToPromoteLevel() || isTimeToDemoteLevel();
    };

    /**
     * Определяет, достигло ли количество неправильных ответов на раунде максимально допустимое значение.
     */
    const isTimeToFinishFailedRound = (): boolean => {
        return incorrectAnswersOnRound >= currentLevel.value.incorrectAnswersBeforeFinish;
    };

    /**
     * Определяет, достигло ли количество правильных ответов на раунде необходимого значения.
     */
    const isTimeToFinishSuccessfulRound = (): boolean => {
        return correctAnswersOnRound >= currentLevel.value.correctAnswersBeforeFinish;
    };

    /**
     * Определяет, пришло ли время завершить раунд.
     */
    const isTimeToFinishRound = (): boolean => {
        return isTimeToFinishFailedRound() || isTimeToFinishSuccessfulRound();
    };

    /** ************************************************************************************************************ Работа с сообщениями */

    /**
     * Устанавливает сообщение, которое не будет переводиться.
     * @param value
     */
    const setMessage = (value: string | number): void => {
        message.value = {
            text: value,
            translatable: false,
        };
    };

    /**
     * Устанавливает сообщение, которое используется как ключ в конфигурационном файле i18n.
     * @param value
     */
    const setTranslatableMessage = (value: string): void => {
        message.value = {
            text: value,
            translatable: true,
        };
    };

    /**
     * Очищает текущее сообщение.
     */
    const clearMessage = (): void => {
        message.value = { text: '', translatable: false };
    };

    /**
     * Проверяет, установлено ли сообщение в текущий момент.
     */
    const isMessageSet = () => {
        return message.value.text !== '';
    };

    /** ************************************************************************************************************ Работа с подсказками */

    /**
     * Отображает подсказку на игровом поле.
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

    /**
     * Закрывает подсказку.
     */
    const closePrompt = () => {
        if (promptResolver) {
            promptResolver();
        }
    };

    /**
     * Уничтожает функцию для разрешения промиса, связанного с отображением подсказки.
     */
    const destroyPrompt = () => {
        promptResolver = undefined;
    };

    /** ***************************************************************************************************************** Работа с паузой */

    /**
     * Устанавливает состояние паузы.
     */
    const setPause = () => {
        stopReactionTimer();
        setPauseState();
        pausePromise = new Promise((resolve) => {
            pauseResolver = resolve;
        });
    };

    /**
     * Завершает паузу.
     */
    const endPause = () => {
        startReactionTimer();

        if (previousState.value !== undefined) {
            setState(previousState.value);
        }

        if (pauseResolver) {
            pauseResolver();
        }
    };

    /**
     * Возвращает промис, ответственный за режим паузы.
     */
    const getPausePromise = () => {
        return pausePromise;
    };

    /**
     * Завершает паузу и очищает промис.
     */
    const destroyPause = () => {
        endPause();
        pauseResolver = undefined;
    };

    /** ********************************************************************************************************** Запись времени реакции */

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

    /**
     * Метод для сохранения времени, потраченного на текущий раунд. Используется для среднего времени реакции в текущей игре.
     */
    const storeAndResetReactionTime = () => {
        stopReactionTimer();

        reactionTimes.push(accumulatedReactionTime);

        startReactionTime = 0;
        endReactionTime = 0;
        accumulatedReactionTime = 0;
    };

    /** **************************************************************************************************************** Таймер totalTime */

    /**
     * Устанавливает количество времени на игру.
     * @param seconds время в секундах
     */
    const setTotalTime = (seconds: number): void => {
        totalTime.value = totalTimeLeft.value = seconds;
    };

    /**
     * Запускает игровой таймер.
     */
    const startTotalTimer = () => {
        if (isTotalTimerStarted()) {
            return;
        }

        totalTick();
    };

    /**
     * Уменьшает переменную totalTimeLeft на единицу каждую секунду.
     */
    const totalTick = async (): Promise<void> => {
        if (isInPauseState()) {
            await pausePromise;
        }

        if (isGameTimeOver.value) {
            stopTotalTimer();
        } else {
            decreaseTotalTime();
            totalTimerId = setTimeout(() => totalTick(), 1000);
        }
    };

    /**
     * Уменьшает значение переменной totalTime на единицу
     */
    const decreaseTotalTime = () => {
        totalTimeLeft.value--;
    };

    /**
     * Останавливает уменьшение переменной totalTime
     */
    const stopTotalTimer = () => {
        if (totalTimerId) {
            clearTimeout(totalTimerId);
            totalTimerId = null;
        }
    };

    /**
     * Сбрасывает игровой таймер.
     */
    const resetTotalTimer = () => {
        stopTotalTimer();
        totalTimeLeft.value = totalTime.value;
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

        if (isInPromptState()) {
            return;
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
            resetCountdown();
            countdown.value++;

            await getPausePromise();
        }

        if (countdown.value <= 1) {
            resetCountdown();
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

    /**
     * Проверяет, запущен ли обратный отсчёт (уменьшение переменной countdown).
     */
    const isCountdownStarted = () => {
        return countdownTimerId !== null;
    };

    /** *************************************************************************************************************** Установка режимов */

    /**
     * Устанавливает переданный режим.
     * @param regimeToSet
     */
    const setRegime = (regimeToSet: GameRegimeEnum): void => {
        regime.value = regimeToSet;
    };

    const setInfiniteRegime = () => {
        setRegime(GameRegimeEnum.infinite);
    };

    const setDefaultRegime = () => {
        setRegime(GameRegimeEnum.default);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const setConstructorRegime = () => {
        setRegime(GameRegimeEnum.constructor);
    };

    /** **************************************************************************************************************** Проверка режимов */

    /**
     * Проверяет соответствие переданного режима текущему.
     * @param regimeToCheck
     */
    const isRegime = (regimeToCheck: GameRegimeEnum): boolean => {
        return regime.value === regimeToCheck;
    };

    const isInInfiniteRegime = (): boolean => {
        return isRegime(GameRegimeEnum.infinite);
    };

    const isInDefaultRegime = (): boolean => {
        return isRegime(GameRegimeEnum.default);
    };

    const isInConstructorRegime = (): boolean => {
        return isRegime(GameRegimeEnum.constructor);
    };

    /** ***************************************************************************************************************** Установка модов */

    /**
     * Устанавливает переданный мод.
     * @param modeToSet
     */
    const setMode = (modeToSet: GameModeEnum): void => {
        mode.value = modeToSet;
    };

    const setWarmUpMode = () => {
        setMode(GameModeEnum.warmUp);
    };

    const setGameMode = () => {
        setMode(GameModeEnum.game);
    };

    /** ****************************************************************************************************************** Проверка модов */

    /**
     * Проверяет соответствие переданного мода текущему.
     * @param modeToCheck
     */
    const isMode = (modeToCheck: GameModeEnum): boolean => {
        return mode.value === modeToCheck;
    };

    const isInWarmUpMode = (): boolean => {
        return isMode(GameModeEnum.warmUp);
    };

    const isInGameMode = (): boolean => {
        return isMode(GameModeEnum.game);
    };

    /** ************************************************************************************************************* Установка состояний */

    /**
     * Устанавливает переданное состояние, запоминая предыдущее.
     * @param stateToSet
     */
    const setState = (stateToSet: GameStateEnum): void => {
        previousState.value = state.value;
        state.value = stateToSet;
    };

    const setGamePreparingState = (): void => {
        setState(GameStateEnum.gamePreparing);
    };

    const setLevelPreparingState = (): void => {
        setState(GameStateEnum.levelPreparing);
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

    const setGameFinishingState = (): void => {
        setState(GameStateEnum.gameFinishing);
    };

    const setPromptState = (): void => {
        setState(GameStateEnum.prompt);
    };

    const setPauseState = (): void => {
        setState(GameStateEnum.pause);
    };

    /** ************************************************************************************************************** Проверка состояний */

    /**
     * Проверяет соответствие переданного состояние текущему.
     * @param stateToCheck
     */
    const isState = (stateToCheck: GameStateEnum): boolean => {
        return state.value === stateToCheck;
    };

    const isInGamePreparingState = (): boolean => {
        return isState(GameStateEnum.gamePreparing);
    };

    const isInLevelPreparingState = (): boolean => {
        return isState(GameStateEnum.levelPreparing);
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

    /** ********************************************************************************************************** Логика смены состояний */

    /**
     * Проверяет необходимость завершения разминки и смены мода игры.
     */
    const checkMode = async () => {
        if (isInWarmUpMode() && isTimeToSwitchMode.value) {
            await handleModeSwitching();
        }
    };

    /**
     * Осуществляет смену режима с разминки на игровой.
     */
    const handleModeSwitching = async () => {
        setTranslatableMessage('warmUpCompleted');

        await setPrompt('gameStartPrompt', true);
        setGameMode();
        clearMessage();

        if (isInDefaultRegime()) {
            startTotalTimer();
        }
    };

    /**
     * Осуществляет переход в состояние подготовки игры.
     */
    const handleGamePreparing = async () => {
        if (isInPauseState()) {
            await getPausePromise();
        }

        await handleLevelPreparing();
    };

    /**
     * Осуществляет переход в состояние подготовки уровня. Останавливает таймер на время смены уровня. Запускает обратный отсчёт.
     */
    const handleLevelPreparing = async () => {
        successfulRoundsStreak.value = 0;
        failedRoundsStreak.value = 0;

        clearMessage();
        stopTotalTimer();
        setLevelPreparingState();

        if (isInPauseState()) {
            await getPausePromise();
        }

        await startCountdown();

        if (isInDefaultRegime() && isInGameMode()) {
            startTotalTimer();
        }
    };

    /**
     * Осуществляет переход в состояние подготовки раунда. Обновляет значение переменноЙ roundTime.
     */
    const handleRoundPreparing = (): void => {
        setRoundTime(currentLevel.value.timeToContemplate);
        setRoundPreparingState();
    };

    /**
     * Осуществляет переход в состояние запоминания.
     */
    const handleContemplation = async (): Promise<void> => {
        if (isInPauseState()) {
            await getPausePromise();
        }

        setContemplationState();
        startReactionTimer();

        await startRoundTimer();
    };

    /**
     * Осуществляет переход в состояние ответа.
     */
    const handleInteractive = async (): Promise<void> => {
        if (isInPauseState()) {
            await getPausePromise();
        }

        stopRoundTimer();

        setRoundTime(currentLevel.value.timeToAnswer);
        setInteractiveState();

        await startRoundTimer();
    };

    const handleScoreUpdate = () => {
        totalScore.value += currentLevel.value.pointsPerAnswer;

        if (isTargetCompleted.value || totalScore.value <= target.value) {
            return;
        }

        isTargetCompleted.value = true;
        setTranslatableMessage('targetCompleted');
        setTimeout(() => clearMessage(), 1500);
    };

    /**
     * Обрабатывает верный ответ пользователя.
     */
    const handleCorrectAnswering = () => {
        correctAnswersOnRound++;

        if (isInGameMode()) {
            handleScoreUpdate();
        }
    };

    /**
     * Обрабатывает неверный ответ пользователя.
     */
    const handleIncorrectAnswering = () => {
        incorrectAnswersOnRound++;

        addReaction();
    };

    /**
     * Осуществляет завершение раунда.
     */
    const handleRoundFinishing = () => {
        if (isInGameMode() && isInDefaultRegime()) {
            totalCorrectAnswersAmount += correctAnswersOnRound;
            totalIncorrectAnswersAmount += incorrectAnswersOnRound;

            storeAndResetReactionTime();
        }

        stopRoundTimer();

        if (isInWarmUpMode()) {
            playedWarmUpLevelsAmount.value++;
        }

        if (isRoundFailed()) {
            handleFailedRoundFinishing();
        } else {
            handleSuccessfulRoundFinishing();
        }
    };

    /**
     * Осуществляет завершение раунда, в котором были неверные ответы.
     */
    const handleFailedRoundFinishing = () => {
        if (isInGameMode()) {
            successfulRoundsStreak.value = 0;
            failedRoundsStreak.value++;
        }

        resetRoundAnswers();
        setFailedRoundFinishingState();
    };

    /**
     * Осуществляет завершение раунда без неверных ответов.
     */
    const handleSuccessfulRoundFinishing = () => {
        if (isInGameMode()) {
            failedRoundsStreak.value = 0;
            successfulRoundsStreak.value++;
        }

        resetRoundAnswers();
        setSuccessfulRoundFinishingState();
    };

    /**
     * Осуществляет смену уровня.
     */
    const handleLevelChanging = (): void => {
        stopTotalTimer();

        switch (true) {
            case isTimeToPromoteLevel():
                return handleLevelPromotion();
            case isTimeToDemoteLevel():
                return handleLevelDemotion();
        }
    };

    /**
     * Осуществляет понижение уровня.
     */
    const handleLevelDemotion = () => {
        setTranslatableMessage('levelDown');
        currentUserLevel.value--;
        setLevelDemotionState();
    };

    /**
     * Осуществляет повышение уровня.
     */
    const handleLevelPromotion = () => {
        setTranslatableMessage('levelUp');
        currentUserLevel.value++;

        if (currentUserLevel.value > maxUserLevel.value) {
            maxUserLevel.value = currentUserLevel.value;
        }

        setLevelPromotionState();
    };

    /**
     * Осуществляет завершение игры.
     */
    const handleGameFinishing = async () => {
        try {
            setGameFinishingState();
            setTranslatableMessage('gameSaving');
            generateResults();

            if (gameData.results) {
                const { hasGameCompletedSession, hasGameCompletedProgram } = await service.saveResults(gameData.results);

                gameData.successfullySaved = true;
                gameData.hasGameCompletedSession = hasGameCompletedSession;
                gameData.hasGameCompletedProgram = hasGameCompletedProgram;
            }
        } catch (error) {
            // error handling logic here...
        } finally {
            page.selectResultTab();
        }
    };

    /** **************************************************************************************************************** Сбор статистики  */

    /**
     * Подсчитывает среднюю точность за игру.
     */
    const calculateAccuracy = (): string => {
        const accuracy = (totalCorrectAnswersAmount / (totalCorrectAnswersAmount + totalIncorrectAnswersAmount)) * 100;

        return accuracy.toFixed(1);
    };

    /**
     * Подсчитывает среднее время реакции за игру.
     */
    const calculateMeanReactionTime = (): string => {
        const meanSec = mean(reactionTimes) / 1000;

        return meanSec.toFixed(2);
    };

    /** ********************************************************************************************************** Вспомогательные методы */

    /**
     * Добавляет новый элемент в массив incorrectAnswerReactions.
     * Благодаря этому, в шаблоне появляется новый анимированный элемент, сигнализирующий пользователю о том,
     * что был дан неверный ответ.
     */
    const addReaction = () => {
        const reactionId = Date.now();
        incorrectAnswerReactions.value.push({ id: reactionId });

        setTimeout(() => {
            incorrectAnswerReactions.value = incorrectAnswerReactions.value.filter((reaction) => reaction.id !== reactionId);
        }, TIME_TO_SHOW_INCORRECT_ANSWER_REACTION);
    };

    /**
     * Помечает раунд, как раунд, содержащий неправильный ответ.
     */
    const markRoundAsFailed = () => {
        isRoundFailedFlag = true;
        addReaction();
    };

    /**
     * Формирует результаты игры.
     */
    const generateResults = (): void => {
        gameData.results = {
            game: page.game as string,
            startedFromLevel: initialUserLevel,
            finishedAtLevel: currentUserLevel.value,
            maxUnlockedLevel: maxUserLevel.value,
            withinSession: withinSession.value,
            meanReactionTime: calculateMeanReactionTime(),
            accuracy: calculateAccuracy(),
            correctAnswersAmount: totalCorrectAnswersAmount,
            score: totalScore.value,
            isTargetCompleted: isTargetCompleted.value,
        };
    };

    const resetResults = (): void => {
        gameData.successfullySaved = false;
        gameData.hasGameCompletedSession = false;
        gameData.hasGameCompletedProgram = false;
        gameData.results = undefined;
    };

    /** *********************************************************************************************** Установка и сброс состояния стора */

    /**
     * Получает информацию о текущей игре с сервера: название, набор уровней и прогресс пользователя.
     */
    const setupGame = async () => {
        const data: IGameLevels<IBaseGameLevel> = await service.fetchLevels();

        gameName.value = data.game;
        image.value = data.image;
        maxUserLevel.value = data.maxUserLevel;
        currentUserLevel.value = data.lastUserLevel;
        initialUserLevel = data.lastUserLevel;
        target.value = data.target;

        setTotalTime(data.time);
        setLevels(data.levels);
    };

    /**
     * Устанавливает набор уровней текущей игры, обращаясь к серверу.
     */
    const setLevels = (levelsToSet: IGameLevel<IBaseGameLevel>) => {
        levels.value = levelsToSet;
    };

    /**
     * Сбрасывает информацию об ответах в течение раунда.
     */
    const resetRoundAnswers = () => {
        isRoundFailedFlag = false;

        correctAnswersOnRound = 0;
        incorrectAnswersOnRound = 0;
    };

    /**
     * Сбрасывает набор уровней.
     */
    const resetLevels = () => {
        maxUserLevel.value = 0;
        currentUserLevel.value = 0;
        initialUserLevel = 0;
        levels.value = {};
    };

    /**
     * Сбрасывает основные переменные, используемые стором.
     */
    const resetState = () => {
        successfulRoundsStreak.value = 0;
        failedRoundsStreak.value = 0;
        totalCorrectAnswersAmount = 0;
        totalIncorrectAnswersAmount = 0;
        withinSession.value = false;
        infinityGame.value = false;
        warmUpLevelsAmount.value = 1;
        playedWarmUpLevelsAmount.value = 0;
        incorrectAnswerReactions.value = [];
        previousState.value = undefined;
        totalScore.value = 0;
        isTargetCompleted.value = false;

        accumulatedReactionTime = 0;
        reactionTimes.length = 0;

        resetRoundAnswers();
    };

    /**
     * Инициализация стора.
     */
    const $setup = async () => {
        resetResults();
        setGamePreparingState();

        await setupGame();
    };

    /**
     * Сброс стора.
     */
    const $reset = () => {
        resetCountdown();
        resetRoundTimer();
        resetTotalTimer();
        resetLevels();
        resetState();
        setWarmUpMode();
        clearMessage();
        destroyPause();
        destroyPrompt();
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
        // Работа с состояниями игры
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
        state,
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
        isInPauseState,

        // Работа с модами
        isTimeToSwitchMode,
        checkMode,
        setWarmUpMode,
        setGameMode,
        isInWarmUpMode,
        isInGameMode,

        // Работа с режимами
        isInInfiniteRegime,
        isInDefaultRegime,

        // Ключевые моменты игрового процесса
        handleGamePreparing,
        handleLevelPreparing,
        handleRoundPreparing,
        handleContemplation,
        handleInteractive,
        handleRoundFinishing,
        handleLevelChanging,
        handleGameFinishing,
        handleCorrectAnswering,
        handleIncorrectAnswering,

        // Работа с сообщениями
        message,
        setMessage,
        setTranslatableMessage,
        clearMessage,
        isMessageSet,

        // Работа с подсказками
        prompt,
        setPrompt,
        closePrompt,

        // Работа с паузами
        getPausePromise,
        setPause,
        endPause,

        // Работа с временем, отведенным на игру
        isGameTimeOver,
        totalTime,
        totalTimeLeft,

        // Работа с временем раунда
        roundTime,
        roundTimeLeft,
        showRoundTimeLine,

        // Обратный отсчёт
        countdown,
        startCountdown,

        // Работа с уровнями
        currentLevel,
        currentUserLevel,
        maxUserLevel,
        maxLevelNumber,
        levels,
        isTimeToPromoteLevel,
        isTimeToDemoteLevel,
        isTimeToChangeLevel,
        isTimeToFinishRound,
        isFinalLevel,
        isFirstLevel,

        // Очки и цель
        totalScore,
        target,
        isTargetCompleted,

        // Настройки разминочного режима
        maxWarmUpLevelsAmount,
        warmUpLevelsAmount,
        playedWarmUpLevelsAmount,

        // Конфигурация игры
        withinSession,
        infinityGame,

        // Вспомогательные методы
        isRoundFailed,
        incorrectAnswerReactions,
        markRoundAsFailed,

        successfulRoundsStreak,
        failedRoundsStreak,

        gameData,
        gameName,
        image,

        $setup,
        $reset,

        pauseResolver,
    };
});
