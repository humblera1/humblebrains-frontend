import { defineStore } from 'pinia';
import type { Component } from 'vue';
import { CheckpointTestTabEnum } from '~/entities/enums/checkpoint/CheckpointTestTabEnum';
import { CognitiveCategoryEnum } from '~/entities/enums/cognitiveCategoryEnum';
import type { ChainComponent } from '~/modules/checkpoint/entities/types/ChainComponent';
import { useUserStore } from '~/modules/user/stores/userStore';
import type { ICheckpointStage } from '~/modules/checkpoint/entities/interfaces/ICheckpointStage';
import { CheckpointTabEnum } from '~/entities/enums/checkpoint/CheckpointTabEnum';

export const useCheckpointPageStore = defineStore('checkpointPageStorage', () => {
    const user = useUserStore();

    const currentTab = ref<CheckpointTestTabEnum>(CheckpointTestTabEnum.preview);

    const currentCategory = ref<string>();

    const componentsChain: ChainComponent[] = [];

    const currentChainIndex = ref<number | undefined>(undefined);

    const currentTestComponent = computed((): ChainComponent | undefined => {
        if (currentChainIndex.value !== undefined) {
            return componentsChain.at(currentChainIndex.value);
        }

        return undefined;
    });

    const isNextComponentExists = computed((): boolean => {
        if (currentChainIndex.value === undefined) {
            return false;
        }

        return currentChainIndex.value + 1 < getNumberOfSteps();
    });

    /**
     * Осуществляет переход к следующему компоненту в цепочке
     */
    const moveChain = () => {
        if (currentChainIndex.value === undefined) {
            return;
        }

        if (currentChainIndex.value + 1 >= getNumberOfSteps()) {
            return;
        }

        ++currentChainIndex.value;
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

    /**
     * https://github.com/vitejs/vite/pull/5491/commits
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
        if (currentChainIndex.value !== undefined) {
            return currentChainIndex.value + 1;
        }

        return 0;
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

    const throwNotFoundError = () => {
        throw createError({
            statusCode: 404,
            statusMessage: 'Unrecognized category',
        });
    };

    const initCategory = async () => {
        const route = useRoute();
        const category = route.params.category;

        await user.getSetupPromise(); // Дожидаемся установки стора пользователя
        const availableCategories = user.stages.map((stage) => stage.category.name);

        if (typeof category !== 'string' || !availableCategories.includes(category)) {
            throwNotFoundError();
        }

        currentCategory.value = category as string;

        const stage = user.stages.find((stage) => stage.category.name === category) as ICheckpointStage;

        if (stage.isCompleted) {
            const checkpointTab = useState('checkpoint');

            checkpointTab.value = CheckpointTabEnum.conclusion;
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

    const setupStore = async () => {
        await initCategory();
        initComponentsChain();
        initChainIndex();
    };

    const destroyStore = () => {
        componentsChain.length = 0;
        currentChainIndex.value = undefined;
        currentCategory.value = undefined;

        selectPreviewTab();
    };

    return {
        currentTab,

        selectPreviewTab,
        isPreviewTabSelected,

        selectGameplayTab,
        isGameplayTabSelected,
        isNextComponentExists,

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
