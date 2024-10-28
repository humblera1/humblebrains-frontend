import { defineStore } from 'pinia';
import { useCheckpointStore } from '~/modules/checkpoint/stores/checkpointStore';
import { useCheckpointPageStore } from '~/modules/checkpoint/stores/checkpointPageStore';
import type { Icon } from '~/modules/checkpoint/entities/types/Icon';
import type { LuriaItem } from '~/modules/checkpoint/entities/types/luria/LuriaItem';
import { LuriaItemTypeEnum } from '~/modules/checkpoint/entities/enums/luria/LuriaItemTypeEnum';
import type { ITestLevels } from '~/modules/checkpoint/entities/interfaces/ITestLevels';
import type { LuriaLevel } from '~/modules/checkpoint/entities/types/luria/LuriaLevel';

/**
 * Стор предоставляет основной функционал для реализации теста Лурия.
 * Данный тест используется для исследования таких процессов памяти, как запоминание, сохранение и воспроизведение.
 * Суть теста заключается в следующем: на первом этапе испытуемому демонстрируется набор символов или слов, которые ему предстоит запомнить.
 * Слова/символы показываются последовательно, с интервалом в ITEM_SHOWING_TIME.
 * На втором этапе испытуемому предстоит по памяти воспроизвести показанные ранее элементы. В данном случаем, пользователю будет показан другой ряд,
 * относительно каждого элемента в котором он должен предоставить ответ: был элемент показан на первом этапе или нет.
 */
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
     * Набор url иконок для упражнения, приходящий с сервера.
     */
    let iconPool: Icon[] = [];

    /**
     * Набор слов для упражнения, приходящий с сервера.
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
     * Набор элементов, который будет показан пользователю на втором этапе.
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

    /**
     * Переменная, хранящая функцию для разрешения промиса, который ответственен за ожидание ответа от пользователя.
     */
    let guessPromiseResolver: (() => void) | undefined;

    /**
     * Текущий элемент последовательности, демонстрируемый пользователю.
     */
    const currentItem = ref<LuriaItem>();

    /**
     * Количество правильных ответов на текущем уровне.
     */
    let correctAnswers: number = 0;

    /**
     * Массив, хранящий процент верно опознанных элементов за каждый уровень.
     * По окончанию игры рассчитывается среднее на основании всех элементов массива.
     */
    const subtotals: number[] = [];

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
     * Проверяет тип текущего элемента.
     */
    const isCurrentItemIcon = computed((): boolean => {
        return currentItem.value?.type === LuriaItemTypeEnum.icon;
    });

    /**
     * Проверяет тип текущего элемента.
     */
    const isCurrentItemWord = computed((): boolean => {
        return currentItem.value?.type === LuriaItemTypeEnum.word;
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
     * Начинает новый уровень. Показывает последовательность элементов для запоминания,
     * после чего осуществляет переход на второй этап и демонстрирует новую последовательность.
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

    /**
     * Завершает уровень. Очищает данные, связанные с текущим уровнем.
     * При необходимости завершает тест или осуществляет переход из режима разминки в режим непосредственно тестирования.
     * Метод также осуществляет предзагрузки данных для следующего уровня.
     */
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

    /**
     * Завершает тестовое упражнение. Осуществляет сохранение итогового результата, переход к следующему компоненту.
     */
    const finishTest = () => {
        saveTotal();
        checkpoint.setTestFinishingState();
        checkpoint.setMessage('Отлично! Готовим следующий этап...');

        page.moveChain();
    };

    /**
     * Получает новый набор иконок и слов, генерирует наборы элементов для запоминания и воспроизведения.
     */
    const setLevelData = async () => {
        await setIconsAndWords();

        setAvailableItems();
        setItemsToRemember();
        setItemsToGuess();
    };

    /**
     *  Очищает все данные, связанные с текущим уровнем.
     */
    const flushLevelData = () => {
        flushIconPool();
        flushWordPool();

        flushCorrectAnswers();
        flushCurrentItem();
        flushAvailableItems();
        flushItemsToRemember();
        flushItemsToGuess();
    };

    /**
     * Устанавливает слова и url иконок, которые будут фигурировать на уровне.
     */
    const setIconsAndWords = async (): Promise<void> => {
        if (itemsAmountToLoad.value > 0) {
            [iconPool, wordPool] = await fetchIconsAndWords();
        }
    };

    /**
     * Получает необходимое количество слов и url иконок с сервера.
     */
    const fetchIconsAndWords = async (): Promise<[Icon[], string[]]> => {
        const amount = Math.ceil(itemsAmountToLoad.value / 2);

        return await Promise.all([service.fetchIcons(amount), service.fetchWords(amount)]);
    };

    /**
     * Очищаем массив с допустимыми url иконок.
     */
    const flushIconPool = () => {
        iconPool.length = 0;
    };

    /**
     * Очищаем массив с допустимыми словами.
     */
    const flushWordPool = () => {
        wordPool.length = 0;
    };

    /**
     * Генерирует массив допустимых элементов на основе массивов допустимых слов и иконок.
     */
    const setAvailableItems = () => {
        for (const icon of iconPool) {
            addIconItem(icon);
        }

        for (const word of wordPool) {
            addWordItem(word);
        }
    };

    /**
     * Создает элемент LuriaItem на основе переданной иконки.
     *
     * @param icon
     */
    const addIconItem = (icon: Icon) => {
        availableItems.push({
            id: generateItemId(),
            type: LuriaItemTypeEnum.icon,
            content: icon,
            color: generateItemColor(),
        });
    };

    /**
     * Создает элемент LuriaItem на основе переданного слова.
     *
     * @param word
     */
    const addWordItem = (word: string) => {
        availableItems.push({
            id: generateItemId(),
            type: LuriaItemTypeEnum.word,
            content: word,
            color: generateItemColor(),
        });
    };

    /**
     * Очищаем массив допустимых элементов.
     */
    const flushAvailableItems = () => {
        availableItems.length = 0;
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
     * которые будут предложены пользователю для воспроизведения.
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

    /**
     * Очищаем массив предзагруженного xml-контента иконок.
     */
    const flushRawIcons = () => {
        rawIcons.clear();
    };

    /**
     * Удаляет текущий демонстрируемый элемент.
     */
    const flushCurrentItem = () => {
        currentItem.value = undefined;
    };

    /**
     * Сбрасывает информацию о количестве правильных ответов
     */
    const flushCorrectAnswers = () => {
        correctAnswers = 0;
    };

    /**
     * Осуществляет сброс всей информации стора, включая предзагруженный контент иконок.
     */
    const flushAllData = () => {
        flushLevelData();
        flushRawIcons();
    };

    /**
     * Осуществляет показ массива элементов на первом этапе, которые пользователю необходимо запомнить.
     */
    const showItemsToRememberSequentially = (): Promise<void> => {
        return new Promise((resolve) => {
            let index = 0;
            currentItem.value = itemsToRemember[index];

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

    /**
     * Осуществляет показ массива элементов на втором этапе,
     * которые пользователю необходимо сравнить с массивом символов с первого этапа (itemsToRemember).
     */
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

    /**
     * Принимает ответ пользователя.
     *
     * @param seenBefore
     */
    const makeAnswer = (seenBefore: boolean | undefined = undefined) => {
        if (checkpoint.isInInteractiveState()) {
            handleAnswering(seenBefore);

            if (guessPromiseResolver) {
                guessPromiseResolver();
            }
        }
    };

    /**
     * Обрабатывает ответ пользователя.
     *
     * @param seenBefore
     */
    const handleAnswering = (seenBefore: boolean | undefined = undefined) => {
        if (currentItem.value) {
            const reallyWasBefore = itemsToRemember.some((item) => item.id === currentItem.value?.id);

            if (seenBefore === reallyWasBefore) {
                correctAnswers++;
            }
        }
    };

    /**
     * Вспомогательный метод для генерации уникального идентификатора элемента в последовательности availableItems.
     */
    const generateItemId = (): number => {
        return availableItems.length + 1;
    };

    /**
     * Вспомогательный метод для генерации цвета элемента.
     */
    const generateItemColor = (): string => {
        return useSample(colorPool) as string;
    };

    /**
     * Предоставляет xml-контент иконки из текущего элемента.
     * Контент используется для отображения иконки на странице с использованием атрибута v-html.
     */
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
     * Сохраняет промежуточный результат.
     */
    const saveSubtotal = () => {
        if (checkpoint.isInGameMode()) {
            const allAnswers = itemsToGuess.length;

            const percent = (correctAnswers / allAnswers) * 100;

            subtotals.push(percent);
        }
    };

    /**
     * Очищает таймер, ответственный за показ элементов на поле на этапе запоминания.
     */
    const clearItemToRememberShowingTimer = () => {
        if (itemToRememberShowingTimerId) {
            clearTimeout(itemToRememberShowingTimerId);
            itemToRememberShowingTimerId = null;
        }
    };

    /**
     * Очищает все таймеры.
     */
    const clearTimers = () => {
        clearItemToRememberShowingTimer();
    };

    /**
     * Сохраняет итоговый результат.
     */
    const saveTotal = () => {
        checkpoint.saveTestContribution(subtotals);
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
        clearTimers();
        flushAllData();
        checkpoint.$reset();
    };

    /**
     * Обработка события окончания таймера.
     */
    useListenEvent('test:timeIsOver', () => {
        if (checkpoint.isInInteractiveState()) {
            makeAnswer();
        }
    });

    return {
        currentItem,
        isCurrentItemWord,
        isCurrentItemIcon,
        getCurrentIconRawSvg,
        makeAnswer,

        $setup,
        $reset,
    };
});
