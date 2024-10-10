import { defineStore } from 'pinia';
import { TestStateEnum } from '~/modules/checkpoint/entities/enums/TestStateEnum';

/**
 * Стор для управления состояниями тестовых задания во время контрольной точки.
 * Во многом повторяет логику аналогичного стора для упражнений приложения.
 */
export const useStateStore = defineStore('checkpointTestStateStorage', () => {
    const testState = ref<TestStateEnum>();

    /**
     * Устанавливает переданное состояние.
     * @param state
     */
    const setState = (state: TestStateEnum): void => {
        testState.value = state;
    };

    /**
     * Проверяет соответствие переданного состояния текущему состоянию тестового задания.
     * @param state
     */
    const isState = (state: TestStateEnum): boolean => {
        return testState.value === state;
    };

    /** *********************************************************************************************************************** Установки */

    const setTestPreparingState = (): void => {
        setState(TestStateEnum.testPreparing);
    };

    const setRoundPreparingState = (): void => {
        setState(TestStateEnum.roundPreparing);
    };

    const setContemplationState = (): void => {
        setState(TestStateEnum.contemplation);
    };

    const setInteractiveState = (): void => {
        setState(TestStateEnum.interactive);
    };

    const setRoundFinishingState = (): void => {
        setState(TestStateEnum.roundFinishing);
    };

    const setPromptState = (): void => {
        setState(TestStateEnum.prompt);
    };

    const setPauseState = (): void => {
        setState(TestStateEnum.pause);
    };

    /** ************************************************************************************************************************ Проверки */

    const isInTestPreparingState = (): boolean => {
        return isState(TestStateEnum.testPreparing);
    };

    const isRoundPreparing = (): boolean => {
        return isState(TestStateEnum.roundPreparing);
    };

    const isInContemplationState = (): boolean => {
        return isState(TestStateEnum.contemplation);
    };

    const isInteractive = (): boolean => {
        return isState(TestStateEnum.interactive);
    };

    const isRoundFinishing = (): boolean => {
        return isState(TestStateEnum.roundFinishing);
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

    return {
        setTestPreparingState,
        setRoundPreparingState,
        setContemplationState,
        setInteractiveState,
        setRoundFinishingState,
        setPromptState,
        setPauseState,
        isInTestPreparingState,
        isRoundPreparing,
        isInContemplationState,
        isInteractive,
        isRoundFinishing,
        isInTestFinishingState,
        isInPromptState,
        isInPauseState,
    };
});
