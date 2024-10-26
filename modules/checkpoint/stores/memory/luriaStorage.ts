import { defineStore } from 'pinia';
import { useCheckpointStore } from '~/modules/checkpoint/stores/checkpointStore';
import { useCheckpointPageStore } from '~/modules/checkpoint/stores/checkpointPageStore';
import type { Icon } from '~/modules/checkpoint/entities/types/Icon';
import type { LuriaItem } from '~/modules/checkpoint/entities/types/luria/LuriaItem';
import { LuriaItemTypeEnum } from '~/modules/checkpoint/entities/enums/luria/LuriaItemTypeEnum';
import type { ITestLevels } from '~/modules/checkpoint/entities/interfaces/ITestLevels';
import type { LuriaLevel } from '~/modules/checkpoint/entities/types/luria/LuriaLevel';

export const useLuriaStore = defineStore('luriaStorage', () => {
    /**
     * Время, отведённое на ответ в (ms).
     */
    const TOTAL_ANSWER_TIME = 10000;

    /**
     * Интервал, с которым новые элементы появляются на поле (ms).
     */
    const ITEM_SHOWING_TIME = 2000;

    const checkpoint = useCheckpointStore();

    const page = useCheckpointPageStore();

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
    const colorPool: string[] = ['pink', 'green', 'cyan', 'violet', 'purple', 'ocher', 'iris'];

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
     * Массив загруженных иконок, где ключ - имя иконки, а значение - svg-контент.
     */
    const rawIcons = new Map<string, string>();

    /**
     * Идентификатор таймера, ответственного за последовательный показ ячеек на поле с интервалом в NUMBER_SHOWING_TIME.
     */
    let itemToRememberShowingTimerId: ReturnType<typeof setTimeout> | null = null;

    const currentItem = ref<LuriaItem>();

    let rightAnswers: number = 0;

    /**
     * Массив, хранящий процент правильно выбранных чисел за каждый уровень.
     * По окончанию игры рассчитывается среднее на основании всех элементов массива.
     */
    const subtotals: number[] = [];

    /**
     * Переменная, хранящая функцию для разрешения промиса, который ответственен за состояние паузы.
     * При переходе в состоянии паузы создаётся промис, а его resolve-функция записывается в данную переменную.
     * По выходу из режима паузы должен происходить вызов функции в переменной: это приведёт к разрешению промиса.
     */
    let guessPromiseResolver: (() => void) | undefined;

    /**
     * Массив уровней, которые будут использованы для разминки.
     */
    const levelsToWarmUp: ITestLevels<LuriaLevel> = {
        1: {
            totalItemsToRemember: 2,
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

    const preloadData = async (): Promise<void> => {
        await setLevelData();
        await preloadImages();
    };

    /**
     *
     */
    const startLevel = async () => {
        checkpoint.setLevelPreparingState();

        await checkpoint.startCountdown();
        checkpoint.setContemplationState();

        await showItemsToRememberSequentially();

        await checkpoint.showPrompt('luria:timeToReproduce');
        checkpoint.setLevelPreparingState();

        await checkpoint.startCountdown();
        checkpoint.setInteractiveState();
        await showItemsToGuess();

        await finishLevel();
    };

    const finishLevel = async () => {
        checkpoint.setFailedLevelFinishingState();
        saveSubtotal();
        flushLevelData();

        checkpoint.promoteLevel();

        if (checkpoint.isTimeToFinishTest()) {
            finishTest();

            return;
        }

        if (checkpoint.isTimeToSwitchMode()) {
            await checkpoint.handleModeSwitching(Object.keys(levels).length);
        }

        await preloadData();
        await startLevel();
    };

    const finishTest = () => {
        saveTotal();
        checkpoint.setTestFinishingState();
        checkpoint.setMessage('Отлично! Готовим следующий этап...');

        page.moveChain();
    };

    /**
     * Сохраняет итоговый результат.
     */
    const saveTotal = () => {
        checkpoint.saveTestContribution(subtotals);
    };

    const showItemsToGuess = async (): Promise<void> => {
        for (const item of itemsToGuess) {
            currentItem.value = item;
            checkpoint.startTimer();

            await new Promise<void>((resolve) => {
                guessPromiseResolver = resolve;
            });

            checkpoint.resetTimer();
        }

        return Promise.resolve();
    };

    const makeAnswer = (seenBefore: boolean) => {
        if (checkpoint.isInInteractiveState()) {
            handleAnswering(seenBefore);

            if (guessPromiseResolver) {
                guessPromiseResolver();
            }
        }
    };

    const handleAnswering = (seenBefore: boolean) => {
        if (currentItem.value) {
            const reallyWasBefore = itemsToRemember.some((item) => item.id === currentItem.value?.id);

            if (seenBefore === reallyWasBefore) {
                rightAnswers++;
            }
        }
    };

    const saveSubtotal = () => {
        if (checkpoint.isInGameMode()) {
            const allAnswers = itemsToGuess.length;

            const percent = (rightAnswers / allAnswers) * 100;

            subtotals.push(percent);
        }
    };

    const showItemsToRememberSequentially = (): Promise<void> => {
        return new Promise((resolve) => {
            let index = 0;
            // currentItem.value = itemsToRemember[0];

            const showItem = async () => {
                if (checkpoint.isInPauseState()) {
                    await checkpoint.getPausePromise();
                }

                currentItem.value = itemsToRemember[index];
                index++;

                if (index <= itemsToRemember.length) {
                    itemToRememberShowingTimerId = setTimeout(showItem, ITEM_SHOWING_TIME);
                } else {
                    resolve();
                }
            };

            itemToRememberShowingTimerId = setTimeout(showItem);
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

        flushCurrentItem();
        flushAvailableItems();
        flushItemsToRemember();
        flushItemsToGuess();
    };

    const flushCurrentItem = () => {
        currentItem.value = undefined;
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
            color: generateItemColor(),
        });
    };

    const addWordItem = (word: string) => {
        availableItems.push({
            id: generateItemId(),
            type: LuriaItemTypeEnum.word,
            content: word,
            color: generateItemColor(),
        });
    };

    const generateItemId = (): number => {
        return availableItems.length + 1;
    };

    const generateItemColor = (): string => {
        return useSample(colorPool) as string;
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
    const flushRawIcons = () => {
        rawIcons.clear();
    };

    const flushAllData = () => {
        flushLevelData();
        flushRawIcons();
    };

    const fetchIconsAndWords = async (): Promise<[Icon[], string[]]> => {
        const amount = Math.ceil(itemsAmountToLoad.value / 2);

        return await Promise.all([service.fetchIcons(amount), service.fetchWords(amount)]);
    };

    /**
     * Получает иконки с сервера в виде Blob-объектов и загружает сырой xml во внутреннее хранилище.
     */
    const preloadImages = async (): Promise<void> => {
        const promises = iconPool.map(async (icon) => {
            if (!rawIcons.has(icon.name)) {
                const rawSvgContent = await service.fetchRawSvgContent(icon.src);
                rawIcons.set(icon.name, rawSvgContent);
            }
        });

        await Promise.all(promises);
    };

    const isCurrentItemIcon = computed((): boolean => {
        return currentItem.value?.type === LuriaItemTypeEnum.icon;
    });

    const isCurrentItemWord = computed((): boolean => {
        return currentItem.value?.type === LuriaItemTypeEnum.word;
    });

    const getCurrentIconRawSvg = (): string => {
        if (isCurrentItemIcon.value) {
            const iconItem = currentItem.value?.content as Icon;

            if (rawIcons.has(iconItem.name)) {
                return rawIcons.get(iconItem.name) as string;
            }
        }

        return '';
    };

    /**
     * Инициализация стора.
     */
    const $setup = async () => {
        checkpoint.setTestPreparingState();
        checkpoint.setWarmUpMode();

        checkpoint.setTotalTime(TOTAL_ANSWER_TIME);
        checkpoint.setLevelsAmount(Object.keys(levelsToWarmUp).length);

        await preloadData();

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
        isCurrentItemWord,
        isCurrentItemIcon,
        getCurrentIconRawSvg,
        makeAnswer,

        $setup,
        $reset,

        // debugging
        // imageCache,
        showItemsToRememberSequentially,
    };
});
