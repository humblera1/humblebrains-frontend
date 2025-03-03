import { defineStore } from 'pinia';
import { GameTabEnum } from '~/entities/enums/games/GameTabEnum';
import { GameEnum } from '~/entities/enums/games/GameEnum';

/**
 * Предоставляет вспомогательные методы для облегчения навигации по вкладкам на странице игры.
 * Также содержит метод для осуществления перехода на конкретную вкладку на страницу переданной игры.
 *
 * Текущая игра устанавливается в компоненте <WidgetGame /> на основании параметра строки запроса.
 */
export const useGamePageStore = defineStore('gamePageStorage', () => {
    /**
     * Вкладка, отображаемая на странице по умолчанию, когда не выбрана никакая другая.
     */
    const DEFAULT_TAB: GameTabEnum = GameTabEnum.preview;

    const gameStore = useGameStore();

    /**
     * Коллекция, хранящая вкладки в виде 'игра-вкладка'.
     * Такой подход используется, чтобы предоставить возможность перехода на произвольную вкладку определённой игры.
     */
    const tabs = ref<Map<GameEnum, GameTabEnum>>(new Map());

    /**
     * Игра, по странице которой осуществляется навигация.
     * Устанавливается в компоненте <WidgetGame /> на основании параметра строки запроса.
     */
    const game = ref<GameEnum>();

    /**
     * Состояние загрузки компонента.
     */
    const isLoading = ref<boolean>(false);

    const resolvedComponent = shallowRef<null | object>(null);

    /**
     * Текущая вкладка: значение из коллекции tabs под ключом игры или вкладка по умолчанию, если ключ отсутствует.
     */
    const currentTab = computed((): GameTabEnum => {
        if (game.value && tabs.value.has(game.value)) {
            return tabs.value.get(game.value) as GameTabEnum;
        }

        return DEFAULT_TAB;
    });

    /**
     * Устанавливает переданную вкладку активной для текущей страницы игры.
     * @param tabToSelect
     */
    const selectTab = (tabToSelect: GameTabEnum): void => {
        // todo: throw error if there is no game
        if (game.value) {
            tabs.value.set(game.value, tabToSelect);
        }
    };

    /**
     * Устанавливает переданную вкладку активной для переданной страницы игры.
     * @param tabToSelect
     * @param game
     */
    const selectTabOfGame = (tabToSelect: GameTabEnum, game: GameEnum): void => {
        tabs.value.set(game, tabToSelect);
    };

    /**
     * Текущая игра: устанавливается компонентом на основании route.params.id.
     * @param gameToSetup
     */
    const setupGame = (gameToSetup: GameEnum) => {
        game.value = gameToSetup;
    };

    /**
     * Удаляет значение выбранной вкладки из коллекции tabs.
     * Вызывается при переходе со страницы, чтобы вернуть последнюю в состояние по умолчанию.
     */
    const resetSelectedTab = () => {
        if (game.value) {
            tabs.value.delete(game.value);
        }
    };

    const isTabSelected = (tab: GameTabEnum): boolean => {
        return currentTab.value === tab;
    };

    const isPreviewTabSelected = (): boolean => {
        return isTabSelected(GameTabEnum.preview);
    };

    const isFieldTabSelected = (): boolean => {
        return isTabSelected(GameTabEnum.field);
    };

    const isConstructorTabSelected = (): boolean => {
        return isTabSelected(GameTabEnum.constructor);
    };

    const isResultTabSelected = (): boolean => {
        return isTabSelected(GameTabEnum.result);
    };

    const selectPreviewTab = (): void => {
        selectTab(GameTabEnum.preview);
    };

    const selectFieldTab = (): void => {
        selectTab(GameTabEnum.field);
    };

    const selectConstructorTab = (): void => {
        selectTab(GameTabEnum.constructor);
    };

    const selectResultTab = (): void => {
        selectTab(GameTabEnum.result);
    };

    const navigateToTabOfGame = (tab: GameTabEnum, game: GameEnum) => {
        selectTabOfGame(tab, game);
        navigateTo(`/games/${game}`);
    };

    const resolveComponent = async () => {
        if (!game.value) {
            console.error('Game is not defined');
            return;
        }

        isLoading.value = true;

        // Используем import.meta.glob для динамического импорта всех компонентов игр
        const modules = import.meta.glob('../widgets/games/*/index.vue');
        const componentPath = `../widgets/games/${game.value}/index.vue`;

        try {
            if (modules[componentPath]) {
                const componentModule = (await modules[componentPath]()) as { default: object };
                await gameStore.$setup();

                resolvedComponent.value = componentModule.default;
            } else {
                console.error('Component module not found for path:', componentPath);
                resolvedComponent.value = null;
            }
        } catch (error) {
            console.error('Error loading component:', error);
            resolvedComponent.value = null;
        } finally {
            isLoading.value = false;
        }
    };

    return {
        game,
        isLoading,
        resolvedComponent,

        resolveComponent,

        selectPreviewTab,
        selectFieldTab,
        selectConstructorTab,
        selectResultTab,

        resetSelectedTab,

        isPreviewTabSelected,
        isFieldTabSelected,
        isConstructorTabSelected,
        isResultTabSelected,

        navigateToTabOfGame,

        setupGame,
    };
});
