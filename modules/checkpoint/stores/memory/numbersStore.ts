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
    const CELLS_PER_ROW = 4;

    const TOTAL_ANSWER_TIME = 120;

    const TOTAL_CONTEMPLATION_TIME = 5;

    /**
     * Интервал, с которым новые номера появляются на поле в начале уровня.
     */
    const NUMBER_SHOWING_TIME = 250;

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

    let numberShowingTimerId: ReturnType<typeof setTimeout> | null = null;

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
     *
     */
    const currentLevel = computed((): NumbersLevel => {
        return checkpoint.isInWarmUpMode() ? levelsToWarmUp[checkpoint.currentLevelNumber] : levels[checkpoint.currentLevelNumber];
    });

    /**
     *
     */
    const totalNumbersAmount = computed((): number => {
        return currentLevel.value?.totalNumbers ?? 0;
    });

    /**
     *
     */
    const fieldColumnsAmount = computed((): number => {
        return totalNumbersAmount.value < CELLS_PER_ROW ? totalNumbersAmount.value : CELLS_PER_ROW;
    });

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
     * Инициализирует массив под ответы пользователя. Количество элементов равно количеству ячеек.
     * Массив предварительно заполняется нулевыми значениями.
     */
    const setAnsweredNumbers = (): void => {
        answeredNumbers.value = Array(totalNumbersAmount.value).fill(undefined);
    };

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

    const clearNumberShowingTimer = () => {
        if (numberShowingTimerId) {
            clearTimeout(numberShowingTimerId);
            numberShowingTimerId = null;
        }
    };

    const clearTimers = () => {
        clearNumberShowingTimer();
    };

    /**
     * Обрабатывает начало переноса элемента.
     *
     * @param variantIndex
     * @param variantValue
     */
    const handleDragStart = (variantIndex: number, variantValue: number) => {
        if (!isDraggableMode.value) {
            return;
        }

        draggedVariant.value = {
            index: variantIndex,
            value: variantValue,
        };
    };

    const handleNumberDragStart = (cellIndex: number) => {
        if (!isDraggableMode.value) {
            return;
        }

        const answerInCell = getAnsweredNumber(cellIndex);

        if (answerInCell !== undefined) {
            draggedNumber.value = {
                index: cellIndex,
                value: answerInCell,
            };
        }
    };

    /**
     * Обрабатывает окончание переноса элемента.
     */
    const handleDragEnd = () => {
        draggedVariant.value = undefined;
    };

    /**
     * Обрабатывает окончание переноса номера ячейки.
     */
    const handleNumberDragEnd = () => {
        draggedNumber.value = undefined;
    };

    const isVariantDragged = computed((): boolean => {
        return draggedVariant.value !== undefined;
    });

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
     * Режим игры для мобильных устройств и планшетов.
     * Заполнение ячеек происходит последовательным выбором ячейки и варианта, который заполнит ячейку.
     */
    const isClickableMode = computed((): boolean => {
        return device.isMobileOrTablet;
    });

    /**
     * Обрабатывает сброс на ячейку.
     *
     * @param newCellIndex Индекс ячейки, в которую будет осуществлён перенос.
     */
    const handleDrop = (newCellIndex: number) => {
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
     * Обрабатываем сброс содержимого ячейки обратно в варианты.
     */
    const handleNumberDrop = () => {
        if (draggedNumber.value !== undefined) {
            // Удаляем перенесённый элемент из массива ответов
            answeredNumbers.value[draggedNumber.value.index] = undefined;

            // Возвращаем вариант в массив.
            variants.value.push(draggedNumber.value.value);
        }
    };

    const startLevel = async () => {
        checkpoint.setLevelPreparingState();
        checkpoint.setTotalTime(TOTAL_CONTEMPLATION_TIME);

        setNumbers();
        setAnsweredNumbers();

        await checkpoint.startCountdown();
        await showNumbersSequentially();

        if (isClickableMode.value) {
            findActiveCell(); // Выбираем первую ячейку, которую пользователь будет заполнять.
        }

        checkpoint.setContemplationState();
        checkpoint.startTimer();
    };

    /**
     *
     */
    const startInteractiveState = () => {
        if (checkpoint.isInContemplationState()) {
            checkpoint.setTotalTime(TOTAL_ANSWER_TIME);
            checkpoint.resetTimer();

            setVariants();

            checkpoint.startTimer();

            checkpoint.setInteractiveState();
        }
    };

    const finishLevel = () => {
        saveSubtotal();
        flushAllLevelData();

        // checkpoint.stopTimer();
        // todo: ждем завершения анимации скрытия ячеек
        setTimeout(async () => {
            checkpoint.finishLevel();

            if (checkpoint.isTimeToFinishTest()) {
                finishTest();

                return;
            }

            if (checkpoint.isTimeToSwitchMode()) {
                await handleModeSwitching();
            }

            checkpoint.resetTimer();

            await startLevel();
        }, 500);
    };

    // todo: duplicates
    const handleModeSwitching = async () => {
        checkpoint.setMessage('Разминка завершена!');
        await checkpoint.showPrompt('gameStartPrompt');

        checkpoint.setLevelPreparingState();
        checkpoint.clearMessage();

        checkpoint.setGameMode();
        checkpoint.setLevelsAmount(Object.keys(levels).length);
        checkpoint.resetProgress();
    };

    const finishTest = () => {
        saveTotal();
        checkpoint.setTestFinishingState();
        checkpoint.setMessage('Отлично! Готовим следующий этап...');

        page.moveChain();
    };

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

    const saveTotal = () => {
        checkpoint.saveTestContribution(subtotals);
    };

    const flushNumbers = () => {
        numbers.length = 0;
    };

    const flushVisibleNumbers = () => {
        visibleNumbers.value.length = 0;
    };

    const flushAnsweredNumbers = () => {
        answeredNumbers.value.length = 0;
    };

    const flushVariants = () => {
        variants.value.length = 0;
    };

    const flushAllLevelData = () => {
        flushAnsweredNumbers();
        flushVisibleNumbers();
        flushVariants();
        flushNumbers();

        removeActiveCell();
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

    const removeActiveCell = () => {
        activeCell.value = undefined;
    };

    /**
     * Сигнализирует о том, что ячейка активна для заполнения.
     * @param cellIndex
     */
    const isCellActive = (cellIndex: number): boolean => {
        return activeCell.value === cellIndex;
    };

    /**
     * Обрабатывает нажатие на ячейку.
     */
    const handleClickOnCell = (cellIndex: number) => {
        if (isClickableMode.value) {
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
        if (isClickableMode.value && isActiveCellExists.value) {
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

    const isCellAnswered = (cellIndex: number): boolean => {
        return answeredNumbers.value.at(cellIndex) !== undefined;
    };

    const getAnsweredNumber = (cellIndex: number) => {
        return answeredNumbers.value.at(cellIndex);
    };

    const $setup = async () => {
        checkpoint.setTestPreparingState();
        checkpoint.setWarmUpMode();

        checkpoint.setLevelsAmount(Object.keys(levelsToWarmUp).length);

        await checkpoint.showPrompt('warmUpPrompt');
        await startLevel();
    };

    const $reset = () => {
        clearTimers();
    };

    useListenEvent('test:timeIsOver', async () => {
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
        handleDrop,
        handleDragStart,
        handleDragEnd,

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

        // debug
        draggedNumber,
    };
});
