import { defineStore } from 'pinia';
import type { Component } from 'vue';
import { CheckpointTestTabEnum } from '~/entities/enums/checkpoint/CheckpointTestTabEnum';
import { CognitiveCategoryEnum } from '~/entities/enums/cognitiveCategoryEnum';
import type { ChainComponent } from '~/modules/checkpoint/entities/types/ChainComponent';
import { CheckpointTabEnum } from '~/entities/enums/checkpoint/CheckpointTabEnum';
import { useCheckpointStore } from '~/modules/checkpoint/stores/checkpointStore';
import { useCheckpointService } from '~/modules/checkpoint/composables/useCheckpointService';

export const useCheckpointPageStore = defineStore('checkpointPageStorage', () => {
    const checkpoint = useCheckpointStore();

    const service = useCheckpointService();

    const currentTab = ref<CheckpointTestTabEnum>(CheckpointTestTabEnum.preview);

    const currentCategory = ref<CognitiveCategoryEnum>();

    const componentsChain: ChainComponent[] = [];

    const currentChainIndex = ref<number>(0);

    // todo: error
    const currentTestComponent = computed((): ChainComponent | undefined => {
        return componentsChain.at(currentChainIndex.value);
    });

    /**
     * Осуществляет переход к следующему компоненту в цепочке
     */
    const moveChain = async () => {
        if (++currentChainIndex.value >= getNumberOfSteps()) {
            const checkpointTab = useState('checkpoint');

            if (currentCategory.value) {
                await service.sendStageResults(currentCategory.value, checkpoint.getTotal());

                checkpointTab.value = CheckpointTabEnum.conclusion;

                checkpoint.$reset();
            }
        }
    };

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

    const isCategoryEnum = (value: any): value is CognitiveCategoryEnum => {
        return Object.values(CognitiveCategoryEnum).includes(value);
    };

    /**
     * https://github.com/vitejs/vite/pull/5491/commits
     *
     * todo: default value
     */
    const getComponents = (): Record<string, { default: Component }> | null => {
        switch (currentCategory.value) {
            case CognitiveCategoryEnum.memory:
                return import.meta.glob('@/modules/checkpoint/widgets/memory/*/index.vue', { eager: true });
            case CognitiveCategoryEnum.logic:
                return import.meta.glob('@/modules/checkpoint/widgets/logic/*/index.vue', { eager: true });
            case CognitiveCategoryEnum.attention:
                return import.meta.glob('@/modules/checkpoint/widgets/attention/*/index.vue', { eager: true });
            default:
                return null;
        }
    };

    const getStep = (): number => {
        return currentChainIndex.value + 1;
    };

    const getNumberOfSteps = (): number => {
        return componentsChain.length;
    };

    const getCategory = (): string => {
        return currentCategory.value ?? '';
    };

    const getComponentName = (): string => {
        if (currentTestComponent.value) {
            return currentTestComponent.value.name;
        }

        return '';
    };

    const initCategory = () => {
        const route = useRoute();
        const category = route.params.category;

        if (typeof category === 'string' && isCategoryEnum(category)) {
            currentCategory.value = category;
        } else {
            // todo: недопустимая категория
        }
    };

    /**
     *
     */
    const initComponentsChain = () => {
        if (!currentCategory.value) {
            return;
        }

        const components = getComponents();

        for (const path in components) {
            if (path) {
                const componentName = path.split('/').slice(-2, -1)[0];
                const component = components[path];

                componentsChain.push({
                    name: componentName,
                    component: component.default,
                });
            }
        }
    };

    const initChainIndex = (): void => {
        currentChainIndex.value = 0;
    };

    const setupStore = () => {
        initCategory();
        initComponentsChain();
        initChainIndex();
    };

    const destroyStore = () => {
        componentsChain.length = 0;
        currentChainIndex.value = 0;
        currentCategory.value = undefined;

        selectPreviewTab();
    };

    return {
        currentTab,

        selectPreviewTab,
        isPreviewTabSelected,

        selectGameplayTab,
        isGameplayTabSelected,

        setupStore,
        destroyStore,

        getStep,
        getNumberOfSteps,
        getCategory,
        getComponentName,

        componentsChain,

        currentTestComponent,

        moveChain,
    };
});
