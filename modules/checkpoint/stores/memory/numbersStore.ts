import { defineStore } from 'pinia';
import { useCheckpointStore } from '~/modules/checkpoint/stores/checkpointStore';
import type { ITestLevels } from '~/modules/checkpoint/entities/interfaces/ITestLevels';
import type { NumbersLevel } from '~/modules/checkpoint/entities/types/numbers/NumbersLevel';
import type { DraggedItem } from '~/modules/checkpoint/entities/types/numbers/draggedItem';
import { useCheckpointPageStore } from '~/modules/checkpoint/stores/checkpointPageStore';

/**
 * Содержит логику теста, связанного с проверкой кратковременной памяти на числа.
 */
export const useNumbersStore = defineStore('numbersStorage', () => {
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
     * Интервал, с которым новые номера появляются на поле в начале уровня (ms).
     */
    const NUMBER_SHOWING_TIME = 250;

    /**
     * Продолжительность анимации исчезновения ячеек (ms).
     */
    const NUMBER_HIDING_TIME = 500;

    const device = useDevice();

    const checkpoint = useCheckpointStore();

    const page = useCheckpointPageStore();

    /**
     * Массив номеров, которые будут использоваться в тесте.
     * Ключ отвечает за индекс ячейки, значение - то число, которое необходимо запомнить пользователю.
     */
    let numbers: number[] = [];

    /**
     * Дублирует массив numbers, но используется для анимации последовательного вывода чисел на странице.
     */
    const visibleNumbers = ref<number[]>([]);

    /**
     * Массив чисел, которые выступают в качестве вариантов ответа.
     * Из этого набора пользователю предстоит выбирать варианты для ячеек.
     */
    const variants = ref<number[]>([]);

    /**
     * Массив чисел, которые пользователь расставил в качестве ответа.
     * Сравнение данного массива с массивом numbers даёт информацию о количестве правильных ответов.
     */
    const answeredNumbers = ref<number[] | undefined[]>([]);

    /**
     * Вариант, переносимый в ячейку.
     */
    const draggedVariant = ref<DraggedItem | undefined>();

    /**
     * Номер из ячейки, переносимый обратно в варианты.
     */
    const draggedNumber = ref<DraggedItem | undefined>();

    /**
     * Активная ячейка. В данную ячейку может быть записан ответ.
     * Переменная используется в режиме, альтернативном drag-n-drop.
     */
    const activeCell = ref<number>();

    /**
     * Массив, хранящий процент правильно выбранных чисел за каждый уровень.
     * По окончанию игры рассчитывается среднее на основании всех элементов массива.
     */
    const subtotals: number[] = [];

    /**
     * Идентификатор таймера, ответственного за последовательный показ ячеек на поле с интервалом в NUMBER_SHOWING_TIME.
     */
    let numberShowingTimerId: ReturnType<typeof setTimeout> | null = null;

    /**
     * Задержка, связанная с продолжительностью анимации сокрытия ячеек после завершения уровня.
     * В данном тесте необходимо дождаться окончания сокрытия, прежде чем переходить на следующий уровень,
     * т.к. переход на следующий уровень может привести к перестроению макета поля.
     */
    let delayBeforeFinishingTimerId: ReturnType<typeof setTimeout> | null = null;

    /**
     * Массив уровней, которые будут использованы для разминки.
     */
    const levelsToWarmUp: ITestLevels<NumbersLevel> = {
        1: {
            totalNumbers: 2,
            totalVariants: 3,
        },
        2: {
            totalNumbers: 4,
            totalVariants: 6,
        },
    };

    /**
     * Массив уровней, которые будут использованы для непосредственного тестирования.
     */
    const levels: ITestLevels<NumbersLevel> = {
        1: {
            totalNumbers: 8,
            totalVariants: 12,
        },
        2: {
            totalNumbers: 12,
            totalVariants: 16,
        },
        3: {
            totalNumbers: 16,
            totalVariants: 20,
        },
    };

    /**
     * Возвращает текущий уровень.
     */
    const currentLevel = computed((): NumbersLevel => {
        return checkpoint.isInWarmUpMode() ? levelsToWarmUp[checkpoint.currentLevelNumber] : levels[checkpoint.currentLevelNumber];
    });

    /**
     * Возвращает количество чисел, который необходимо запомнить на текущем уровне.
     */
    const totalNumbersAmount = computed((): number => {
        return currentLevel.value?.totalNumbers ?? 0;
    });

    /**
     * Возвращает количество чисел в одном ряду игрового поля.
     */
    const fieldColumnsAmount = computed((): number => {
        return totalNumbersAmount.value < CELLS_PER_ROW ? totalNumbersAmount.value : CELLS_PER_ROW;
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
        return draggedNumber.value !== undefined;
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
        return answeredNumbers.value.at(cellIndex) !== undefined;
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

        setNumbers();
        setAnsweredNumbers();

        await checkpoint.startCountdown();
        await showNumbersSequentially();

        if (checkpoint.isInWarmUpMode()) {
            checkpoint.setMessage('numbers:rememberNumbers');
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
                finishTest();

                return;
            }

            if (checkpoint.isTimeToSwitchMode()) {
                await checkpoint.handleModeSwitching(Object.keys(levels).length);
            }

            checkpoint.resetTimer();

            await startLevel();
        }, NUMBER_HIDING_TIME);
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
                checkpoint.setMessage('numbers:fillCell');
            } else {
                checkpoint.setMessage('numbers:fillAllCells');
            }

            checkpoint.startTimer();

            checkpoint.setInteractiveState();
        }
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
     * Генерирует необходимое количество уникальных двухзначных чисел и устанавливает их в переменную numbers.
     */
    const setNumbers = (): void => {
        const randomNumbers: Set<number> = new Set();

        while (randomNumbers.size < totalNumbersAmount.value) {
            randomNumbers.add(useRandom(10, 99));
        }

        numbers = Array.from(randomNumbers);
    };

    /**
     * Осуществляет очистку массива с числами.
     */
    const flushNumbers = () => {
        numbers.length = 0;
    };

    /**
     * Генерирует необходимое количество вариантов и устанавливает их в переменную variants.
     * Должна вызываться после setNumbers(), т.к. в массив вариантов необходимо включить все числа из numbers.
     */
    const setVariants = (): void => {
        const totalVariants = currentLevel.value.totalVariants;
        const initialVariants: Set<number> = new Set(numbers);

        while (initialVariants.size < totalVariants) {
            initialVariants.add(useRandom(10, 99));
        }

        variants.value = useShuffle(Array.from(initialVariants));
    };

    /**
     * Осуществляет очистку массива с вариантами.
     */
    const flushVariants = () => {
        variants.value.length = 0;
    };

    /**
     * Инициализирует массив под ответы пользователя. Количество элементов равно количеству ячеек.
     * Массив предварительно заполняется нулевыми значениями.
     */
    const setAnsweredNumbers = (): void => {
        answeredNumbers.value = Array(totalNumbersAmount.value).fill(undefined);
    };

    /**
     * Возвращает ответ, записанный в ячейки под указанным индексом.
     *
     * @param cellIndex
     */
    const getAnsweredNumber = (cellIndex: number) => {
        return answeredNumbers.value.at(cellIndex);
    };

    /**
     * Осуществляет очистку массива с ответами.
     */
    const flushAnsweredNumbers = () => {
        answeredNumbers.value.length = 0;
    };

    /**
     * Осуществляет последовательный перенос чисел в массив visibleNumbers.
     * Благодаря этому числа появляются на игровом поле с определённым интервалом.
     */
    const showNumbersSequentially = (): Promise<void> => {
        return new Promise((resolve) => {
            const numbersToAdd = [...numbers];

            const show = async () => {
                if (checkpoint.isInPauseState()) {
                    await checkpoint.getPausePromise();
                }

                if (numbersToAdd.length === 0) {
                    resolve();

                    return;
                }

                const numberToAdd = numbersToAdd.shift() as number;

                visibleNumbers.value.push(numberToAdd);
                numberShowingTimerId = setTimeout(show, NUMBER_SHOWING_TIME);
            };

            numberShowingTimerId = setTimeout(show, NUMBER_SHOWING_TIME);
        });
    };

    /**
     * Осуществляет очистку массива с числами, отображаемыми на странице.
     */
    const flushVisibleNumbers = () => {
        visibleNumbers.value.length = 0;
    };

    /**
     * Сбрасывает все переменные, используемые на уровне.
     */
    const flushAllLevelData = () => {
        flushAnsweredNumbers();
        flushVisibleNumbers();
        flushVariants();
        flushNumbers();

        removeActiveCell();
    };

    /**
     * Обрабатывает начало переноса числа из набора вариантов.
     *
     * @param variantIndex
     * @param variantValue
     */
    const handleVariantDragStart = (variantIndex: number, variantValue: number) => {
        if (canHandleDrag.value) {
            draggedVariant.value = {
                index: variantIndex,
                value: variantValue,
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
    const handleVariantDrop = (newCellIndex: number) => {
        if (!canHandleDrag.value) {
            return;
        }

        if (!isVariantDragged.value && !isNumberDragged.value) {
            return;
        }

        const answerInCell = getAnsweredNumber(newCellIndex);

        if (draggedVariant.value !== undefined) {
            // Удаляем перенесённый элемент из массива вариантов
            variants.value.splice(draggedVariant.value.index, 1);
            answeredNumbers.value[newCellIndex] = draggedVariant.value.value;

            // Если ячейка уже содержала число, возвращаем его в массив вариантов
            if (answerInCell !== undefined) {
                variants.value.unshift(answerInCell);
            }
        }

        if (draggedNumber.value !== undefined) {
            // Удаляем перенесённый элемент из предыдущей ячейки и перемещаем на новую
            answeredNumbers.value[draggedNumber.value.index] = undefined;
            answeredNumbers.value[newCellIndex] = draggedNumber.value.value;

            // Если ячейка уже содержала число, возвращаем его в массив вариантов
            if (answerInCell !== undefined && answerInCell !== draggedNumber.value.value) {
                variants.value.unshift(answerInCell);
            }
        }
    };

    /**
     * Обрабатывает начало переноса числа из ячейки.
     *
     * @param cellIndex
     */
    const handleNumberDragStart = (cellIndex: number) => {
        if (canHandleDrag.value) {
            const answerInCell = getAnsweredNumber(cellIndex);

            if (answerInCell !== undefined) {
                draggedNumber.value = {
                    index: cellIndex,
                    value: answerInCell,
                };
            }
        }
    };

    /**
     * Обрабатывает окончание переноса номера ячейки.
     */
    const handleNumberDragEnd = () => {
        if (canHandleDrag.value) {
            draggedNumber.value = undefined;
        }
    };

    /**
     * Обрабатываем сброс содержимого ячейки обратно в варианты.
     */
    const handleNumberDrop = () => {
        if (canHandleDrag.value && draggedNumber.value !== undefined) {
            // Удаляем перенесённый элемент из массива ответов
            answeredNumbers.value[draggedNumber.value.index] = undefined;

            // Возвращаем вариант в массив.
            variants.value.push(draggedNumber.value.value);
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
            const variantValue = variants.value.at(variantIndex) as number;
            const answerInCell = answeredNumbers.value.at(activeCellIndex);

            // Записываем в ячейку новое значение
            answeredNumbers.value[activeCellIndex] = variantValue;

            // Удаляем записанный вариант из массива вариантов
            variants.value.splice(variantIndex, 1);

            // Вставляем в массив вариантов предыдущий ответ из ячейки
            if (answerInCell !== undefined) {
                variants.value.unshift(answerInCell);
            }

            // Находим новую ячейку, чтобы сделать её активной
            findActiveCell();
        }
    };

    /**
     * Выбирает ячейку, которую сделает активной для заполнения - это первая незаполненная ячейка.
     */
    const findActiveCell = () => {
        const n = answeredNumbers.value.length;

        for (let i = 0; i < n; i++) {
            if (answeredNumbers.value.at(i) === undefined) {
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
     * Очищает таймер, ответственный за последовательный показ ячеек с номерами на поле.
     */
    const clearNumberShowingTimer = () => {
        if (numberShowingTimerId) {
            clearTimeout(numberShowingTimerId);
            numberShowingTimerId = null;
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
     * Сохраняет промежуточный результат.
     */
    const saveSubtotal = () => {
        const len = numbers.length;

        let correctAnsweredNumbers = 0;

        for (let i = 0; i < len; i++) {
            if (answeredNumbers.value.at(i) === numbers.at(i)) {
                correctAnsweredNumbers++;
            }
        }

        const totalPercent = (correctAnsweredNumbers * 100) / len;

        subtotals.push(totalPercent);
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

        checkpoint.setLevelsAmount(Object.keys(levelsToWarmUp).length);

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

    /**
     * Обработка события окончания таймера.
     * Либо вышло время на запоминание, либо вышло время на ответ.
     */
    useListenEvent('test:timeIsOver', () => {
        if (checkpoint.isInContemplationState()) {
            startInteractiveState();
        } else if (checkpoint.isInInteractiveState()) {
            finishLevel();
        }
    });

    return {
        fieldColumnsAmount,
        visibleNumbers,
        variants,
        isCellAnswered,
        getAnsweredNumber,

        // drag-n-drop
        isVariantDragged,
        isNumberDragged,
        isDraggableMode,
        handleVariantDrop,
        handleVariantDragStart,
        handleVariantDragEnd,
        handleNumberDrop,
        handleNumberDragStart,
        handleNumberDragEnd,

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
