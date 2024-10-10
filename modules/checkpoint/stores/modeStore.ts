import { defineStore } from 'pinia';
import { TestModeEnum } from '~/modules/checkpoint/entities/enums/TestModeEnum';

/**
 * Стор, используемый для управления режимами тестового задания.
 */
export const useModeStore = defineStore('checkpointTestModeStorage', () => {
    /**
     * Текущий режим
     */
    const testMode = ref<TestModeEnum>();

    /**
     * Устанавливает переданный режим
     * @param mode
     */
    const setMode = (mode: TestModeEnum): void => {
        testMode.value = mode;
    };

    /**
     * Проверяет соответствие переданного режима текущему
     * @param mode
     */
    const isMode = (mode: TestModeEnum): boolean => {
        return testMode.value === mode;
    };

    const setWarmUpMode = () => {
        setMode(TestModeEnum.warmUp);
    };

    const setGameMode = () => {
        setMode(TestModeEnum.game);
    };

    const isWarmUp = (): boolean => {
        return isMode(TestModeEnum.warmUp);
    };

    const isGame = (): boolean => {
        return isMode(TestModeEnum.game);
    };

    return {
        setWarmUpMode,
        setGameMode,
        isWarmUp,
        isGame,
    };
});
