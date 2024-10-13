import { defineStore } from 'pinia';
import { useCheckpointStore } from '~/modules/checkpoint/stores/checkpointStore';
import type { ITestLevels } from '~/modules/checkpoint/entities/interfaces/ITestLevels';
import type { ThorndikeLevel } from '~/modules/checkpoint/entities/types/thorndike/ThorndikeLevel';
import { useCheckpointPageStore } from '~/modules/checkpoint/stores/checkpointPageStore';
import { thorndikeAssessmentTable } from '~/modules/checkpoint/data/thorndikeAssessmentTable';

/**
 * Тест Торндайка.
 * Задача испытуемого в тесте Торндайка – отыскать 10 заданных трехзначных чисел в наборе из 100 чисел.
 */
export const useThorndikeStore = defineStore('thorndikeStorage', () => {
    /**
     *
     */
    const TOTAL_TIME = 350;

    /**
     * Интервал, с которым появляются новые числа при формировании игрового поля.
     */
    const TIME_TO_ADD_NEW_NUMBER = 50;

    /**
     * Время, после которого появляются числа для поиска.
     */
    const TIME_TO_ADD_NEW_NUMBER_TO_FIND = 250;

    const checkpoint = useCheckpointStore();

    const page = useCheckpointPageStore();

    /**
     * Массив, содержащий числа фонового материала.
     */
    const numbers = ref<number[]>([]);

    /**
     * Те числа, которые пользователю предстоит найти среди фонового материала.
     */
    const numbersToFind = ref<number[]>([]);

    const visibleNumbers = ref<number[]>([]);

    /**
     *
     */
    const selectedNumbers = ref<number[]>([]);

    /**
     *
     */
    let numberAddingTimerId: ReturnType<typeof setTimeout> | null = null;

    /**
     *
     */
    let numberToFindTimerId: ReturnType<typeof setTimeout> | null = null;

    /**
     * Массив, хранящий процент правильно выбранных чисел за каждый уровень.
     * По окончанию игры рассчитывается среднее на основании всех элементов массива.
     */
    const subtotals: number[] = [];

    /**
     * Разминочные уровни.
     */
    const levelsToWarmUp: ITestLevels<ThorndikeLevel> = {
        1: {
            numbersAmount: 40,
            numbersToFindAmount: 5,
        },
    };

    /**
     * Набор уровней упражнения.
     */
    const levels: ITestLevels<ThorndikeLevel> = {
        1: {
            numbersAmount: 100,
            numbersToFindAmount: 10,
        },
    };

    /**
     *
     */
    const currentLevel = computed((): ThorndikeLevel => {
        return checkpoint.isInWarmUpMode() ? levelsToWarmUp[checkpoint.currentLevelNumber] : levels[checkpoint.currentLevelNumber];
    });

    const handleNumberSelection = (number: number) => {
        if (!checkpoint.isInInteractiveState()) {
            return;
        }

        if (isNumbersSelected(number)) {
            deselectNumber(number);
        } else {
            selectNumber(number);
        }
    };

    const isNumbersSelected = (number: number) => {
        return selectedNumbers.value.includes(number);
    };

    const selectNumber = (number: number) => {
        selectedNumbers.value.push(number);
    };

    const deselectNumber = (number: number) => {
        const indexToRemove = selectedNumbers.value.indexOf(number);

        if (indexToRemove !== -1) {
            selectedNumbers.value.splice(indexToRemove, 1);
        }
    };

    const isNumberVisible = (number: number) => {
        return visibleNumbers.value.includes(number);
    };

    /**
     * Занимается генерацией нужного количества случайных уникальных трёхзначных чисел.
     * Записывает полученный набор чисел в переменную numbers с интервалом TIME_TO_ADD_NEW_NUMBER.
     */
    const setLevelNumbers = (): Promise<void> => {
        const randomNumbers: Set<number> = new Set();
        const numbersAmount = currentLevel.value.numbersAmount;

        // формируем коллекцию из 100 уникальных трёхзначных чисел
        while (randomNumbers.size < numbersAmount) {
            randomNumbers.add(useRandom(100, 999));
        }

        // преобразуем коллекцию в массив
        const randomNumbersArray = Array.from(randomNumbers);
        numbers.value = [...randomNumbersArray];

        // с определённым интервалом перебрасываем числа во внутреннюю переменную numbers
        return new Promise((resolve) => {
            randomNumbersArray.reverse();
            const add = async () => {
                if (checkpoint.isInPauseState()) {
                    await checkpoint.getPausePromise();
                }

                if (randomNumbersArray.length === 0) {
                    resolve();
                } else {
                    const numberToAdd = randomNumbersArray.pop() as number;
                    visibleNumbers.value.push(numberToAdd);

                    numberAddingTimerId = setTimeout(add, TIME_TO_ADD_NEW_NUMBER);
                }
            };

            numberAddingTimerId = setTimeout(add, TIME_TO_ADD_NEW_NUMBER);
        });
    };

    const selLevelNumbersToFind = (): Promise<void> => {
        const numbersAmount = currentLevel.value.numbersToFindAmount;
        const availableNumbers = useShuffle(numbers.value);

        return new Promise((resolve) => {
            numberToFindTimerId = setTimeout(async () => {
                if (checkpoint.isInPauseState()) {
                    await checkpoint.getPausePromise();
                }

                numbersToFind.value = availableNumbers.slice(0, numbersAmount);

                resolve();
            }, TIME_TO_ADD_NEW_NUMBER_TO_FIND);
        });
    };

    const startLevel = async () => {
        checkpoint.setLevelPreparingState();

        await setLevelNumbers();
        await checkpoint.startCountdown();
        await selLevelNumbersToFind();

        if (checkpoint.isInWarmUpMode()) {
            checkpoint.setMessage('thorndike:findNumbers');
        }

        checkpoint.startTimer();
        checkpoint.setInteractiveState();
    };

    const finishLevel = async () => {
        saveSubtotal();

        checkpoint.finishLevel();

        flushNumbers();

        if (checkpoint.isTimeToFinishTest()) {
            if (checkpoint.isInWarmUpMode()) {
                await handleModeSwitching();
            } else {
                finishTest();

                return;
            }
        }

        await startLevel();
    };

    const flushNumbers = () => {
        // numbers.value.length = 0;
        visibleNumbers.value.length = 0;
        numbersToFind.value.length = 0;
        selectedNumbers.value.length = 0;
    };

    const clearNumberAddingTimer = () => {
        if (numberAddingTimerId) {
            clearTimeout(numberAddingTimerId);
        }
    };

    const numberToFindTimer = () => {
        if (numberToFindTimerId) {
            clearTimeout(numberToFindTimerId);
        }
    };

    const clearTimers = () => {
        clearNumberAddingTimer();
        numberToFindTimer();
    };

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
        if (checkpoint.isInWarmUpMode()) {
            return;
        }

        if (selectedNumbers.value.length === 0) {
            subtotals.push(0);
            return;
        }

        const time = checkpoint.totalTime - checkpoint.time;
        const maxAssessment = thorndikeAssessmentTable.at(0);
        const maxPoints = maxAssessment?.point ?? 19;

        const currentAssessment = thorndikeAssessmentTable.find((assessment) => {
            return assessment.time.min <= time && assessment.time.max >= time;
        });

        const point = currentAssessment?.point ?? 0;

        const wrongNumbers = useDifference(numbersToFind.value, selectedNumbers.value);

        const totalPoints = point - wrongNumbers.length * 2;

        if (totalPoints <= 0) {
            subtotals.push(0);
            return;
        }

        const totalPercent = (totalPoints * 100) / maxPoints;

        subtotals.push(totalPercent);
    };

    const saveTotal = () => {
        const mean = useMean(subtotals);
        const total = parseFloat(mean.toFixed(2));

        checkpoint.saveTestContribution(total);
    };

    const $setup = async () => {
        checkpoint.setTestPreparingState();
        checkpoint.setWarmUpMode();

        checkpoint.setTotalTime(TOTAL_TIME);
        checkpoint.setLevelsAmount(Object.keys(levelsToWarmUp).length);

        await checkpoint.showPrompt('warmUpPrompt');
        await startLevel();
    };

    const $reset = () => {
        clearTimers();
        flushNumbers();
        checkpoint.setTestPreparingState();
        checkpoint.$reset();
    };

    return {
        numbers,
        numbersToFind,
        handleNumberSelection,
        isNumbersSelected,
        isNumberVisible,

        finishLevel,

        $reset,
        $setup,
    };
});
