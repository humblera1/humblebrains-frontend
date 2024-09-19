import { defineStore } from 'pinia';
import { GameStateEnum } from '~/entities/enums/GameStateEnum';

// Базовый стор, отвечающий за действия, характерные всем играм
export const useGameStore = defineStore('gameStorage', () => {
    const gameState = ref<GameStateEnum>();

    const setState = (state: GameStateEnum): void => {
        gameState.value = state;
    };

    const isState = (state: GameStateEnum): boolean => {
        return gameState.value === state;
    };

    const setContemplationState = (): void => {
        setState(GameStateEnum.contemplation);
    };

    const setInteractiveState = (): void => {
        setState(GameStateEnum.interactive);
    };

    const setBuildingState = (): void => {
        setState(GameStateEnum.building);
    };

    const setPromptState = (): void => {
        setState(GameStateEnum.prompt);
    };

    const isContemplationState = (): boolean => {
        return isState(GameStateEnum.contemplation);
    };

    const isInteractiveState = (): boolean => {
        return isState(GameStateEnum.interactive);
    };

    const isBuildingState = (): boolean => {
        return isState(GameStateEnum.building);
    };

    const isPromptState = (): boolean => {
        return isState(GameStateEnum.prompt);
    };

    return {
        setContemplationState,
        setInteractiveState,
        setBuildingState,
        setPromptState,
        isContemplationState,
        isInteractiveState,
        isBuildingState,
        isPromptState,
    };
});
