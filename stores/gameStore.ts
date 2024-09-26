import { defineStore } from 'pinia';
import { GameStateEnum } from '~/entities/enums/GameStateEnum';

// Базовый стор, отвечающий за действия, характерные всем играм
export const useGameStore = defineStore('gameStorage', () => {
    /**
     * Время на игру в секундах, скорее сего, будет приходить с бэка
     */
    const totalTime = ref<number>(90);

    /**
     * Идентификатор таймера, ответственного за уменьшение переменной totalTime
     */
    let totalTimerId: ReturnType<typeof setTimeout> | null = null;

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

    const setRoundPreparingState = (): void => {
        setState(GameStateEnum.roundPreparing);
    };

    const setContemplationState = (): void => {
        setState(GameStateEnum.contemplation);
    };

    const setInteractiveState = (): void => {
        setState(GameStateEnum.interactive);
    };

    const setRoundFinishingState = (): void => {
        setState(GameStateEnum.roundFinishing);
    };

    const setLevelFinishingState = (): void => {
        setState(GameStateEnum.levelFinishing);
    };

    const setPromptState = (): void => {
        setState(GameStateEnum.prompt);
    };

    /** Проверки */

    const isLevelPreparingState = (): boolean => {
        return isState(GameStateEnum.levelPreparing);
    };

    const isRoundPreparingState = (): boolean => {
        return isState(GameStateEnum.roundPreparing);
    };

    const isContemplationState = (): boolean => {
        return isState(GameStateEnum.contemplation);
    };

    const isInteractiveState = (): boolean => {
        return isState(GameStateEnum.interactive);
    };

    const isRoundFinishingState = (): boolean => {
        return isState(GameStateEnum.roundFinishing);
    };

    const isLevelFinishingState = (): boolean => {
        return isState(GameStateEnum.levelFinishing);
    };

    const isPromptState = (): boolean => {
        return isState(GameStateEnum.prompt);
    };

    return {
        setLevelPreparingState,
        setRoundPreparingState,
        setContemplationState,
        setInteractiveState,
        setRoundFinishingState,
        setLevelFinishingState,
        setPromptState,
        gameState,
        isLevelPreparingState,
        isRoundPreparingState,
        isContemplationState,
        isInteractiveState,
        isRoundFinishingState,
        isLevelFinishingState,
        isPromptState,

        totalTime,
        startTotalTimer,
        stopTotalTimer,
    };
});
