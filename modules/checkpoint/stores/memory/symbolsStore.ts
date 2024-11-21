import { defineStore } from 'pinia';
import { map, max } from 'lodash';
import { useCheckpointStore } from '~/modules/checkpoint/stores/checkpointStore';
import type { ITestLevels } from '~/modules/checkpoint/entities/interfaces/ITestLevels';
import type { SymbolsLevel } from '~/modules/checkpoint/entities/types/symbols/symbolsLevel';
import type { Icon } from '~/modules/checkpoint/entities/types/Icon';
import type { DraggedItem } from '~/modules/checkpoint/entities/types/symbols/draggedItem';

export const useSymbolsStore = defineStore('symbolsStorage', () => {
    /**
     * Максимальное количество ячеек в ряду.
     */
    const CELLS_PER_ROW = 4;

    /**
     * Время, отведённое на ответ в (ms).
     */
    const TOTAL_ANSWER_TIME = 120000;

    /**
     * Время, отведённое на запоминание чисел (ms).
     */
    const TOTAL_CONTEMPLATION_TIME = 25000;

    /**
     * Интервал, с которым новые символы появляются на поле в начале уровня (ms).
     */
    const SYMBOL_SHOWING_TIME = 250;

    /**
     * Продолжительность анимации исчезновения ячеек (ms).
     */
    const SYMBOL_HIDING_TIME = 500;

    const device = useDevice();

    const service = useCheckpointService();

    const checkpoint = useCheckpointStore();

    /**
     * Массив иконок, которые будут использоваться на уровне.
     */
    let iconPool: Icon[] = [];

    /**
     * Массив идентификаторов иконок, которые будут использоваться на уровне.
     */
    const availableIconNames: string[] = [];

    /**
     * Массив загруженных иконок, где ключ - идентификатор иконки, а значение - svg-контент.
     */
    const rawIcons = new Map<string, string>();

    /**
     * Массив идентификаторов иконок, которые будут использоваться в тесте.
     * Ключ отвечает за индекс ячейки, значение - идентификатор иконки, находящейся в клетке.
     */
    const symbols: string[] = [];

    /**
     * Дублирует массив symbols, используется для анимации последовательного вывода ячеек с символами на странице.
     */
    const visibleSymbols = ref<string[]>([]);

    /**
     * Массив символов, которые выступают в качестве вариантов ответа.
     * Из этого набора пользователю предстоит выбирать варианты для ячеек.
     */
    const variants = ref<string[]>([]);

    /**
     * Массив идентификаторов символов, расставленных пользователем на поле.
     * Сравнение данного массива с массивом symbols даёт информацию о количестве правильных ответов.
     */
    const answeredSymbols = ref<string[] | undefined[]>([]);

    /**
     * Вариант, переносимый в ячейку.
     */
    const draggedVariant = ref<DraggedItem | undefined>();

    /**
     * Идентификатор символа из ячейки, переносимого обратно в варианты.
     */
    const draggedCell = ref<DraggedItem | undefined>();

    /**
     * Активная ячейка. В данную ячейку может быть записан ответ.
     * Переменная используется в режиме, альтернативном drag-n-drop.
     */
    const activeCell = ref<number>();

    /**
     * Массив, хранящий процент правильно выбранных символов за каждый уровень.
     * По окончанию игры рассчитывается среднее на основании всех элементов массива.
     */
    const subtotals: number[] = [];

    /**
     * Идентификатор таймера, ответственного за последовательный показ ячеек на поле с интервалом в SYMBOL_SHOWING_TIME.
     */
    let symbolShowingTimerId: ReturnType<typeof setTimeout> | null = null;

    /**
     * Задержка, связанная с продолжительностью анимации сокрытия ячеек после завершения уровня.
     * В данном тесте необходимо дождаться окончания сокрытия, прежде чем переходить на следующий уровень,
     * т.к. переход на следующий уровень может привести к перестроению макета поля.
     */
    let delayBeforeFinishingTimerId: ReturnType<typeof setTimeout> | null = null;

    /**
     * Массив уровней, которые будут использованы для разминки.
     */
    const levelsToWarmUp: ITestLevels<SymbolsLevel> = {
        1: {
            totalSymbols: 2,
            totalVariants: 3,
        },
        2: {
            totalSymbols: 4,
            totalVariants: 6,
        },
    };

    /**
     * Массив уровней, которые будут использованы для непосредственного тестирования.
     */
    const levels: ITestLevels<SymbolsLevel> = {
        1: {
            totalSymbols: 8,
            totalVariants: 12,
        },
        2: {
            totalSymbols: 12,
            totalVariants: 16,
        },
        3: {
            totalSymbols: 16,
            totalVariants: 20,
        },
    };

    /**
     * Возвращает текущий уровень.
     */
    const currentLevel = computed((): SymbolsLevel => {
        return checkpoint.isInWarmUpMode() ? levelsToWarmUp[checkpoint.currentLevelNumber] : levels[checkpoint.currentLevelNumber];
    });

    /**
     * Возвращает число иконок, которое необходимо запросить у сервера для организации текущего теста.
     * Берётся максимальное значение поля totalVariants из всех возможных уровней.
     */
    const iconsAmountToFetch = computed((): number => {
        const variantsArray = [...map(levelsToWarmUp, 'totalVariants'), ...map(levels, 'totalVariants')];

        return max(variantsArray) || 0;
    });

    /**
     * Возвращает количество чисел, который необходимо запомнить на текущем уровне.
     */
    const totalSymbolsAmount = computed((): number => {
        return currentLevel.value?.totalSymbols ?? 0;
    });

    /**
     * Возвращает количество вариантов, которые будут предложены пользователю на текущем уровне.
     */
    const totalVariantsAmount = computed((): number => {
        return currentLevel.value?.totalVariants ?? 0;
    });

    /**
     * Возвращает количество чисел в одном ряду игрового поля.
     */
    const fieldColumnsAmount = computed((): number => {
        return totalSymbolsAmount.value < CELLS_PER_ROW ? totalSymbolsAmount.value : CELLS_PER_ROW;
    });

    /**
     * Проверяет, переносится ли какой-либо номер из вариантов в данный момент.
     */
    const isVariantDragged = computed((): boolean => {
        return draggedVariant.value !== undefined;
    });

    /**
     * Проверяет, переносится ли какой-либо номер из ячеек в данный момент.
     */
    const isNumberDragged = computed((): boolean => {
        return draggedCell.value !== undefined;
    });

    /**
     * Проверяет наличие активной ячейки.
     */
    const isActiveCellExists = computed((): boolean => {
        return activeCell.value !== undefined;
    });

    /**
     * Режим игры по умолчанию.
     * Заполнение ячеек происходит переносом вариантов в ячейки.
     */
    const isDraggableMode = computed((): boolean => {
        return !device.isMobileOrTablet;
    });

    /**
     * Проверяет, может ли перенос быть обработан.
     */
    const canHandleDrag = computed((): boolean => {
        return isDraggableMode.value && checkpoint.isInInteractiveState();
    });

    /**
     * Режим игры для мобильных устройств и планшетов.
     * Заполнение ячеек происходит последовательным выбором ячейки и варианта, который заполнит ячейку.
     */
    const isClickableMode = computed((): boolean => {
        return device.isMobileOrTablet;
    });

    /**
     * Проверяет, может ли клик быть обработан.
     */
    const canHandleClick = computed((): boolean => {
        return isClickableMode.value && checkpoint.isInInteractiveState();
    });

    /**
     * Проверяет, было ли помещено пользователем какое-либо число в данную ячейку.
     * @param cellIndex
     */
    const isCellAnswered = (cellIndex: number): boolean => {
        return answeredSymbols.value.at(cellIndex) !== undefined;
    };

    /**
     * Сигнализирует о том, что ячейка активна для заполнения.
     * @param cellIndex
     */
    const isCellActive = (cellIndex: number): boolean => {
        return activeCell.value === cellIndex;
    };

    /**
     * Начинает новый уровень. Осуществляет генерацию новых чисел, их последовательный показ на странице,
     * запуск таймера и переход в режим запоминания чисел.
     */
    const startLevel = async () => {
        checkpoint.setLevelPreparingState();
        checkpoint.setTotalTime(TOTAL_CONTEMPLATION_TIME);

        shuffleAvailableIconNames();

        setSymbols();
        setAnsweredSymbols();

        await checkpoint.startCountdown();
        await showNumbersSequentially();

        if (checkpoint.isInWarmUpMode()) {
            checkpoint.setMessage('symbols:rememberSymbols');
        }

        checkpoint.setContemplationState();
        checkpoint.startTimer();
    };

    /**
     * Завершает текущий уровень. Осуществляет сохранение промежуточных результатов, очистку данных, переход на следующий уровень.
     */
    const finishLevel = () => {
        checkpoint.setFailedLevelFinishingState();
        checkpoint.clearMessage();
        checkpoint.resetTimer();

        saveSubtotal();
        flushAllLevelData();

        delayBeforeFinishingTimerId = setTimeout(async () => {
            checkpoint.promoteLevel();

            if (checkpoint.isTimeToFinishTest()) {
                await checkpoint.finishTest(subtotals);

                return;
            }

            if (checkpoint.isTimeToSwitchMode()) {
                await checkpoint.handleModeSwitching(Object.keys(levels).length);
            }

            checkpoint.resetTimer();

            await startLevel();
        }, SYMBOL_HIDING_TIME);
    };

    /**
     * Осуществляет переход из состояния запоминания в интерактивный режим.
     */
    const startInteractiveState = () => {
        if (checkpoint.isInContemplationState()) {
            checkpoint.clearMessage();
            checkpoint.setTotalTime(TOTAL_ANSWER_TIME);
            checkpoint.resetTimer();

            setVariants();

            if (isClickableMode.value) {
                findActiveCell(); // Выбираем первую ячейку, которую пользователь будет заполнять.
                checkpoint.setMessage('symbols:fillCell');
            } else {
                checkpoint.setMessage('symbols:fillAllCells');
            }

            checkpoint.startTimer();

            checkpoint.setInteractiveState();
        }
    };

    /**
     * Выбирает необходимое количество имен иконок из массива iconPool.
     */
    const setSymbols = (): void => {
        symbols.push(...availableIconNames.slice(0, totalSymbolsAmount.value));
    };

    /**
     * Осуществляет очистку массива с числами.
     */
    const flushSymbols = () => {
        symbols.length = 0;
    };

    /**
     * Генерирует необходимое количество вариантов и устанавливает их в переменную variants.
     * Должна вызываться после setSymbols(), т.к. в массив вариантов необходимо включить все символы из symbols.
     */
    const setVariants = (): void => {
        variants.value.push(...symbols);
        variants.value.push(...availableIconNames.slice(totalSymbolsAmount.value, totalVariantsAmount.value));

        variants.value.sort(() => Math.random() - 0.5);
    };

    /**
     * Осуществляет очистку массива с вариантами.
     */
    const flushVariants = () => {
        variants.value.length = 0;
    };

    /**
     * Инициализирует массив под ответы пользователя. Количество элементов равно количеству ячеек.
     * Массив предварительно заполняется значениями undefined.
     */
    const setAnsweredSymbols = (): void => {
        answeredSymbols.value = Array(totalSymbolsAmount.value).fill(undefined);
    };

    /**
     * Возвращает идентификатор символа, расположенного в ячейке под указанным индексом.
     *
     * @param cellIndex
     */
    const getAnsweredSymbol = (cellIndex: number) => {
        return answeredSymbols.value.at(cellIndex);
    };

    /**
     * Осуществляет очистку массива с ответами.
     */
    const flushAnsweredSymbols = () => {
        answeredSymbols.value.length = 0;
    };

    /**
     * Осуществляет последовательный перенос чисел в массив visibleNumbers.
     * Благодаря этому числа появляются на игровом поле с определённым интервалом.
     */
    const showNumbersSequentially = (): Promise<void> => {
        return new Promise((resolve) => {
            const symbolsToAdd = [...symbols];

            const show = async () => {
                if (checkpoint.isInPauseState()) {
                    await checkpoint.getPausePromise();
                }

                if (symbolsToAdd.length === 0) {
                    resolve();

                    return;
                }

                const symbolToAdd = symbolsToAdd.shift() as string;

                visibleSymbols.value.push(symbolToAdd);
                symbolShowingTimerId = setTimeout(show, SYMBOL_SHOWING_TIME);
            };

            symbolShowingTimerId = setTimeout(show, SYMBOL_SHOWING_TIME);
        });
    };

    /**
     * Осуществляет очистку массива с числами, отображаемыми на странице.
     */
    const flushVisibleSymbols = () => {
        visibleSymbols.value.length = 0;
    };

    /**
     * Сбрасывает все переменные, используемые на уровне.
     */
    const flushAllLevelData = () => {
        flushAnsweredSymbols();
        flushVisibleSymbols();
        flushVariants();
        flushSymbols();

        removeActiveCell();
    };

    /**
     * Обрабатывает начало переноса числа из набора вариантов.
     *
     * @param variantIndex
     * @param variantValue
     */
    const handleVariantDragStart = (variantIndex: number, variantValue: string) => {
        if (canHandleDrag.value) {
            draggedVariant.value = {
                index: variantIndex,
                iconName: variantValue,
            };
        }
    };

    /**
     * Обрабатывает окончание переноса варианта.
     */
    const handleVariantDragEnd = () => {
        if (canHandleDrag.value) {
            draggedVariant.value = undefined;
        }
    };

    /**
     * Обрабатывает сброс на ячейку.
     *
     * @param newCellIndex Индекс ячейки, в которую будет осуществлён перенос.
     */
    const handleDropToCell = (newCellIndex: number) => {
        if (!canHandleDrag.value) {
            return;
        }

        if (!isVariantDragged.value && !isNumberDragged.value) {
            return;
        }

        const answerInCell = getAnsweredSymbol(newCellIndex);

        if (draggedVariant.value !== undefined) {
            // Удаляем перенесённый элемент из массива вариантов
            variants.value.splice(draggedVariant.value.index, 1);
            answeredSymbols.value[newCellIndex] = draggedVariant.value.iconName;

            // Если ячейка уже содержала число, возвращаем его в массив вариантов
            if (answerInCell !== undefined) {
                variants.value.push(answerInCell);
            }
        }

        if (draggedCell.value !== undefined) {
            // Удаляем перенесённый элемент из предыдущей ячейки и перемещаем на новую
            answeredSymbols.value[draggedCell.value.index] = undefined;
            answeredSymbols.value[newCellIndex] = draggedCell.value.iconName;

            // Если ячейка уже содержала число, возвращаем его в массив вариантов
            if (answerInCell !== undefined && answerInCell !== draggedCell.value.iconName) {
                variants.value.push(answerInCell);
            }
        }
    };

    /**
     * Обрабатывает начало переноса числа из ячейки.
     *
     * @param cellIndex
     */
    const handleCellDragStart = (cellIndex: number) => {
        if (canHandleDrag.value) {
            const answerInCell = getAnsweredSymbol(cellIndex);

            if (answerInCell !== undefined) {
                draggedCell.value = {
                    index: cellIndex,
                    iconName: answerInCell,
                };
            }
        }
    };

    /**
     * Обрабатывает окончание переноса номера ячейки.
     */
    const handleCellDragEnd = () => {
        if (canHandleDrag.value) {
            draggedCell.value = undefined;
        }
    };

    /**
     * Обрабатываем сброс содержимого ячейки обратно в варианты.
     */
    const handleDropToVariants = () => {
        if (canHandleDrag.value && draggedCell.value !== undefined) {
            // Удаляем перенесённый элемент из массива ответов
            answeredSymbols.value[draggedCell.value.index] = undefined;

            // Возвращаем вариант в массив.
            variants.value.push(draggedCell.value.iconName);
        }
    };

    /**
     * Обрабатывает нажатие на ячейку.
     */
    const handleClickOnCell = (cellIndex: number) => {
        if (canHandleClick.value) {
            markCellAsActive(cellIndex);
        }
    };

    /**
     * Обрабатывает нажатие на вариант: значение варианта записывается в текущую активную ячейку,
     * после чего выбирается незаполненная ячейка и делается активной.
     *
     * Выбранный вариант удаляется из массива вариантов.
     *
     * Если в текущей активной ячейки было значение, оно возвращается в массив вариантов.
     */
    const handleClickOnVariant = (variantIndex: number) => {
        if (canHandleClick.value && isActiveCellExists.value) {
            // @ts-ignore: we already check that activeCell exists
            const activeCellIndex = activeCell.value as number;
            const variantValue = variants.value.at(variantIndex) as string;
            const answerInCell = answeredSymbols.value.at(activeCellIndex);

            // Записываем в ячейку новое значение
            answeredSymbols.value[activeCellIndex] = variantValue;

            // Удаляем записанный вариант из массива вариантов
            variants.value.splice(variantIndex, 1);

            // Вставляем в массив вариантов предыдущий ответ из ячейки
            if (answerInCell !== undefined) {
                variants.value.push(answerInCell);
            }

            // Находим новую ячейку, чтобы сделать её активной
            findActiveCell();
        }
    };

    /**
     * Выбирает ячейку, которую сделает активной для заполнения - это первая незаполненная ячейка.
     */
    const findActiveCell = () => {
        const n = answeredSymbols.value.length;

        for (let i = 0; i < n; i++) {
            if (answeredSymbols.value.at(i) === undefined) {
                markCellAsActive(i);
                break;
            }

            removeActiveCell();
        }
    };

    /**
     * Помечает ячейку как активную.
     */
    const markCellAsActive = (cellIndex: number) => {
        activeCell.value = cellIndex;
    };

    /**
     * Удаляет текущую активную ячейку. Вызывается, когда заполняется последняя свободная ячейка на поле.
     */
    const removeActiveCell = () => {
        activeCell.value = undefined;
    };

    /**
     * Перемешивает массив допустимых иконок. Вызывается в начале уровня.
     */
    const shuffleAvailableIconNames = () => {
        availableIconNames.sort(() => Math.random() - 0.5);
    };

    /**
     *  Возвращает контент иконки (символа) по идентификатору.
     *
     * @param name
     */
    const getRawSymbolContentByName = (name: string): string => {
        return rawIcons.get(name) ?? '';
    };

    /**
     * Очищает таймер, ответственный за последовательный показ ячеек с номерами на поле.
     */
    const clearNumberShowingTimer = () => {
        if (symbolShowingTimerId) {
            clearTimeout(symbolShowingTimerId);
            symbolShowingTimerId = null;
        }
    };

    /**
     * Очищает таймер, ответственный за задержку перед началом нового уровня.
     */
    const clearDelayBeforeFinishingTimer = () => {
        if (delayBeforeFinishingTimerId) {
            clearTimeout(delayBeforeFinishingTimerId);
            delayBeforeFinishingTimerId = null;
        }
    };

    /**
     * Очищает все таймеры.
     */
    const clearTimers = () => {
        clearNumberShowingTimer();
        clearDelayBeforeFinishingTimer();
    };

    /**
     * Получает иконки с сервера в виде Blob-объектов и загружает сырой xml-контент во внутреннее хранилище.
     */
    const preloadIcons = async (): Promise<void> => {
        const promises = iconPool.map(async (icon) => {
            if (!rawIcons.has(icon.name)) {
                const rawSvgContent = await service.fetchRawSvgContent(icon.src);
                rawIcons.set(icon.name, rawSvgContent);
            }
        });

        await Promise.all(promises);
    };

    /**
     * Устанавливает массив url возможных иконок, которые могут использоваться в тесте.
     */
    const setAvailableIcons = async (): Promise<void> => {
        if (iconsAmountToFetch.value > 0) {
            iconPool = await fetchIcons();

            availableIconNames.push(...iconPool.map((icon) => icon.name));
        }
    };

    /**
     * Получает необходимое количество url иконок с сервера.
     */
    const fetchIcons = async (): Promise<Icon[]> => {
        return await service.fetchIcons(iconsAmountToFetch.value);
    };

    /**
     * Сохраняет промежуточный результат.
     */
    const saveSubtotal = () => {
        const len = symbols.length;

        let correctAnsweredNumbers = 0;

        for (let i = 0; i < len; i++) {
            if (answeredSymbols.value.at(i) === symbols.at(i)) {
                correctAnsweredNumbers++;
            }
        }

        const totalPercent = (correctAnsweredNumbers * 100) / len;

        subtotals.push(totalPercent);
    };

    /**
     * Инициализация стора.
     */
    const $setup = async () => {
        checkpoint.setTestPreparingState();
        checkpoint.setWarmUpMode();

        checkpoint.setLevelsAmount(Object.keys(levelsToWarmUp).length);

        await setAvailableIcons();
        await preloadIcons();

        await checkpoint.showPrompt('warmUpPrompt');
        await startLevel();
    };

    /**
     * Очистка стора.
     */
    const $reset = () => {
        flushAllLevelData();
        clearTimers();

        checkpoint.$reset();
    };

    return {
        fieldColumnsAmount,
        visibleSymbols,
        variants,
        isCellAnswered,
        getAnsweredSymbol,
        getRawSymbolContentByName,

        // drag-n-drop
        isVariantDragged,
        isNumberDragged,
        isDraggableMode,
        handleDropToCell,
        handleVariantDragStart,
        handleVariantDragEnd,
        handleDropToVariants,
        handleCellDragStart,
        handleCellDragEnd,

        // clicks
        isCellActive,
        handleClickOnCell,
        handleClickOnVariant,

        // controls
        startInteractiveState,
        finishLevel,

        $setup,
        $reset,
    };
});
