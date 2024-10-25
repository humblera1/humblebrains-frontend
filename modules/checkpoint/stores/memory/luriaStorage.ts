import { defineStore } from 'pinia';
import { useCheckpointStore } from '~/modules/checkpoint/stores/checkpointStore';
// import { useCheckpointPageStore } from '~/modules/checkpoint/stores/checkpointPageStore';
import type { Icon } from '~/modules/checkpoint/entities/types/Icon';
import type { LuriaItem } from '~/modules/checkpoint/entities/types/luria/LuriaItem';
import { LuriaItemTypeEnum } from '~/modules/checkpoint/entities/enums/luria/LuriaItemTypeEnum';
import type { ITestLevels } from '~/modules/checkpoint/entities/interfaces/ITestLevels';
import type { LuriaLevel } from '~/modules/checkpoint/entities/types/luria/LuriaLevel';

export const useLuriaStore = defineStore('luriaStorage', () => {
    /**
     * Интервал, с которым новые элементы появляются на поле (ms).
     */
    const ITEM_SHOWING_TIME = 2000;

    const checkpoint = useCheckpointStore();

    // const page = useCheckpointPageStore();

    const service = useCheckpointService();

    /**
     * Набор иконок для упражнения, приходящий с сервера.
     * Данный набор содержит не непосредственные изображения, а ссылки на них.
     */
    let iconPool: Icon[] = [];

    /**
     * Набор слов для упражнения, приходящий с сервера
     */
    let wordPool: string[] = [];

    /**
     * Набор цветов для упражнения.
     */
    // const colorPool: string[] = ['pink', 'green', 'cyan', 'violet', 'purple', 'ocher', 'iris', 'blue'];

    /**
     * Набор элементов, доступных для использования на данном уровне.
     *
     */
    const availableItems: LuriaItem[] = [];

    /**
     * Набор элементов, которые будут предложены пользователю для запоминания.
     */
    const itemsToRemember: LuriaItem[] = [];

    /**
     * Набор предметов, который будет показан пользователю на втором этапе.
     * Задача пользователя - определить, какие элементы из данного набора присутствовали в наборе items,
     * показанном на первом этапе.
     */
    const itemsToGuess: LuriaItem[] = [];

    /**
     * Массив загруженных иконок.
     */
    const imageCache = new Map<string, HTMLImageElement>();

    /**
     * Идентификатор таймера, ответственного за последовательный показ ячеек на поле с интервалом в NUMBER_SHOWING_TIME.
     */
    let itemToRememberShowingTimerId: ReturnType<typeof setTimeout> | null = null;

    const currentItem = ref<LuriaItem>();

    /**
     * Массив уровней, которые будут использованы для разминки.
     */
    const levelsToWarmUp: ITestLevels<LuriaLevel> = {
        1: {
            totalItemsToRemember: 3,
            totalItemsToGuess: 5,
        },
    };

    /**
     * Массив уровней, которые будут использованы для непосредственного тестирования.
     */
    const levels: ITestLevels<LuriaLevel> = {
        1: {
            totalItemsToRemember: 20,
            totalItemsToGuess: 30,
        },
    };

    /**
     * Возвращает текущий уровень.
     */
    const currentLevel = computed((): LuriaLevel => {
        return checkpoint.isInWarmUpMode() ? levelsToWarmUp[checkpoint.currentLevelNumber] : levels[checkpoint.currentLevelNumber];
    });

    /**
     * Определяет количество элементов (слов и символов в совокупности), которое необходимо загрузить с сервера.
     * Основывается на текущем уровне.
     */
    const itemsAmountToLoad = computed((): number => {
        if (currentLevel.value) {
            return currentLevel.value.totalItemsToRemember > currentLevel.value.totalItemsToGuess
                ? currentLevel.value.totalItemsToRemember
                : currentLevel.value.totalItemsToGuess;
        }

        return 0;
    });

    /**
     *
     */
    const startLevel = async () => {
        await setLevelData();

        preloadImages();

        await showItemsToRememberSequentially();

        console.log('done!');
    };

    const showItemsToRememberSequentially = (): Promise<void> => {
        return new Promise((resolve) => {
            let index = 1;
            currentItem.value = itemsToRemember[0];

            const showItem = async () => {
                if (checkpoint.isInPauseState()) {
                    await checkpoint.getPausePromise();
                }

                if (index > itemsToRemember.length) {
                    resolve();

                    return;
                }

                currentItem.value = itemsToRemember[index];
                index++;

                itemToRememberShowingTimerId = setTimeout(showItem, ITEM_SHOWING_TIME);
            };

            itemToRememberShowingTimerId = setTimeout(showItem, ITEM_SHOWING_TIME);
        });
    };

    const setLevelData = async () => {
        await setIconsAndWords();

        setAvailableItems();
        setItemsToRemember();
        setItemsToGuess();
    };

    const flushLevelData = () => {
        flushIconPool();
        flushWordPool();

        flushAvailableItems();
        flushItemsToRemember();
        flushItemsToGuess();
    };

    /**
     * Выбирает необходимое число случайных элементов из availableItems,
     * которые будут предложены пользователю для запоминания.
     */
    const setItemsToRemember = () => {
        if (currentLevel.value) {
            const items = useShuffle([...availableItems]);

            itemsToRemember.push(...items.slice(0, currentLevel.value.totalItemsToRemember));
        }
    };

    /**
     * Очищаем массив с элементами для запоминания.
     */
    const flushItemsToRemember = () => {
        itemsToRemember.length = 0;
    };

    /**
     * Выбирает необходимое число случайных элементов из availableItems,
     * которые будут предложены пользователю для запоминания.
     *
     * Если totalItemsToGuess меньше, чем totalItemsToRemember, то массивы itemsToGuess и itemsToRemember могут даже не пересечься.
     */
    const setItemsToGuess = () => {
        if (currentLevel.value) {
            const items = useShuffle([...availableItems]);

            itemsToGuess.push(...items.slice(0, currentLevel.value.totalItemsToGuess));
        }
    };

    /**
     * Очищаем массив с элементами для воспроизведения.
     */
    const flushItemsToGuess = () => {
        itemsToGuess.length = 0;
    };

    const setAvailableItems = () => {
        // todo: отдельный метод
        availableItems.length = 0;

        for (const icon of iconPool) {
            addIconItem(icon);
        }

        for (const word of wordPool) {
            addWordItem(word);
        }
    };

    /**
     * Очищаем массив с допустимых элементов.
     */
    const flushAvailableItems = () => {
        availableItems.length = 0;
    };

    const addIconItem = (icon: Icon) => {
        availableItems.push({
            id: generateItemId(),
            type: LuriaItemTypeEnum.icon,
            content: icon,
        });
    };

    const addWordItem = (word: string) => {
        availableItems.push({
            id: generateItemId(),
            type: LuriaItemTypeEnum.word,
            content: word,
        });
    };

    const generateItemId = (): number => {
        return availableItems.length + 1;
    };

    const setIconsAndWords = async (): Promise<void> => {
        if (itemsAmountToLoad.value > 0) {
            [iconPool, wordPool] = await fetchIconsAndWords();
        }
    };

    /**
     * Очищаем массив с элементами для воспроизведения.
     */
    const flushIconPool = () => {
        iconPool.length = 0;
    };

    /**
     * Очищаем массив с элементами для воспроизведения.
     */
    const flushWordPool = () => {
        wordPool.length = 0;
    };

    /**
     * Очищаем массив с элементами для воспроизведения.
     */
    const flushPreloadedImages = () => {
        imageCache.clear();
    };

    const flushAllData = () => {
        flushLevelData();
        flushPreloadedImages();
    };

    const fetchIconsAndWords = async (): Promise<[Icon[], string[]]> => {
        const amount = Math.ceil(itemsAmountToLoad.value / 2);

        return await Promise.all([service.fetchIcons(amount), service.fetchWords(amount)]);
    };

    /**
     * Загружает изображения с сервера во внутреннее хранилище.
     */
    const preloadImages = () => {
        iconPool.forEach((icon) => {
            if (!imageCache.has(icon.name)) {
                const img = new Image();
                img.src = icon.src;

                imageCache.set(icon.name, img);
            }
        });
    };

    /**
     * Инициализация стора.
     */
    const $setup = async () => {
        checkpoint.setTestPreparingState();
        checkpoint.setWarmUpMode();

        await checkpoint.showPrompt('warmUpPrompt');

        await startLevel();
    };

    /**
     * Очистка стора.
     */
    const $reset = () => {
        flushAllData();
        checkpoint.$reset();
    };

    return {
        currentItem,

        $setup,
        $reset,
    };
});
