import { defineStore } from 'pinia';
import { CheckpointTestTabEnum } from '~/entities/enums/checkpoint/CheckpointTestTabEnum';

export const useCheckpointPageStore = defineStore('checkpointPageStorage', () => {
    const currentTab = ref<CheckpointTestTabEnum>(CheckpointTestTabEnum.preview);

    const selectTab = (tab: CheckpointTestTabEnum): void => {
        currentTab.value = tab;
    };

    const isTabSelected = (tab: CheckpointTestTabEnum): boolean => {
        return currentTab.value === tab;
    };

    const selectPreviewTab = (): void => {
        selectTab(CheckpointTestTabEnum.preview);
    };

    const selectGameplayTab = (): void => {
        selectTab(CheckpointTestTabEnum.gameplay);
    };

    const isPreviewTabSelected = (): boolean => {
        return isTabSelected(CheckpointTestTabEnum.preview);
    };

    const isGameplayTabSelected = (): boolean => {
        return isTabSelected(CheckpointTestTabEnum.gameplay);
    };

    return {
        currentTab,

        selectPreviewTab,
        isPreviewTabSelected,

        selectGameplayTab,
        isGameplayTabSelected,
    };
});
