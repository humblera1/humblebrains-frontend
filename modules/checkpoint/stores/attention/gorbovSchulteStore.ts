import { defineStore } from 'pinia';
import { useCheckpointStore } from '~/modules/checkpoint/stores/checkpointStore';
import type { GorbovSchulteLevel } from '~/modules/checkpoint/entities/types/gorbov-schulte/GorbovSchulteLevel';
import type { ITestLevels } from '~/modules/checkpoint/entities/interfaces/ITestLevels';
import { RuleEnum } from '~/modules/checkpoint/entities/enums/gorbov-schulte/RuleEnum';
import { gorbovSchulteAssessmentTable } from '~/modules/checkpoint/data/gorbovSchulteAssessmentTable';

export const useGorbovSchulteStore = defineStore('gorbovSchulteStorage', () => {
    /**
     * Время в (ms).
     */
    const TOTAL_TIME = 250000;

    const CELL_SHOWING_TIME = 150;

    const checkpoint = useCheckpointStore();

    const primaryNumbers = ref<number[]>([]);

    const secondaryNumbers = ref<number[]>([]);

    const alreadyFound = ref<number[]>([]);

    /**
     * Массив используется для анимации появления/исчезновения ячеек на поле.
     */
    const hiddenNumbers = ref<number[]>([]);

    const activeRule = ref<RuleEnum>();

    let cellAnimationTimerId: ReturnType<typeof setTimeout> | null = null;

    let activeNumber: number;

    let mistakesAmount: number = 0;

    /**
     * Массив, хранящий процент правильно выбранных чисел за каждый уровень.
     * По окончанию игры рассчитывается среднее на основании всех элементов массива.
     */
    const subtotals: number[] = [];

    const levelsToWarmUp: ITestLevels<GorbovSchulteLevel> = {
        1: {
            dimension: 2,
        },
    };

    const levels: ITestLevels<GorbovSchulteLevel> = {
        1: {
            dimension: 2,
        },
    };

    /**
     *
     */
    const currentLevel = computed((): GorbovSchulteLevel => {
        return checkpoint.isInWarmUpMode() ? levelsToWarmUp[checkpoint.currentLevelNumber] : levels[checkpoint.currentLevelNumber];
    });

    const dimension = computed((): number => {
        return currentLevel.value.dimension ?? 0;
    });

    const availableNumbers = computed((): number[] => {
        const range = dimension.value ** 2;

        return useRange(1, range + 1);
    });

    const setNumbers = () => {
        const shuffledNumbers = useShuffle(availableNumbers.value);

        const halfLength = Math.ceil(dimension.value ** 2 / 2);

        const chunks = useChunk(shuffledNumbers, halfLength);

        primaryNumbers.value = chunks[0];
        secondaryNumbers.value = chunks[1] || [];
    };

    const isPrimaryRuleActive = (): boolean => {
        return activeRule.value === RuleEnum.primary;
    };

    const isSecondaryRuleActive = (): boolean => {
        return activeRule.value === RuleEnum.secondary;
    };

    const setPrimaryAsActiveRule = () => {
        activeRule.value = RuleEnum.primary;
    };

    const setSecondaryAsActiveRule = () => {
        activeRule.value = RuleEnum.secondary;
    };

    const setActiveRule = () => {
        if (!activeRule.value || isSecondaryRuleActive()) {
            setPrimaryAsActiveRule();

            return;
        }

        if (isPrimaryRuleActive()) {
            setSecondaryAsActiveRule();
        }
    };

    const setActiveNumber = () => {
        let progress = Math.ceil(alreadyFound.value.length / 2);

        // Если "главное" правило, ищем с конца массива primaryNumbers
        if (isPrimaryRuleActive()) {
            progress++;
            const activeNumberIndex = primaryNumbers.value.length - progress;

            if (activeNumberIndex >= 0) {
                activeNumber = primaryNumbers.value.at(activeNumberIndex) as number;
            }

            return;
        }

        // Если нет, ищем с начала массива secondaryNumbers
        if (isSecondaryRuleActive()) {
            progress--;

            if (progress <= secondaryNumbers.value.length) {
                activeNumber = secondaryNumbers.value.at(progress) as number;
            }
        }
    };

    const isPrimaryNumber = (cellNumber: number) => {
        return primaryNumbers.value.includes(cellNumber);
    };

    const isCorrectNumber = (cellNumber: number): boolean => {
        return cellNumber === activeNumber;
    };

    const getCellType = (cellNumber: number): RuleEnum => {
        return isPrimaryNumber(cellNumber) ? RuleEnum.primary : RuleEnum.secondary;
    };

    const getCellIndex = (cellNumber: number): number => {
        let index = isPrimaryNumber(cellNumber) ? primaryNumbers.value.indexOf(cellNumber) : secondaryNumbers.value.indexOf(cellNumber);
        return ++index;
    };

    const isCellFounded = (cellNumber: number): boolean => {
        return alreadyFound.value.includes(cellNumber);
    };

    const isCellHidden = (cellNumber: number) => {
        return checkpoint.isInTestPreparingState() || hiddenNumbers.value.includes(cellNumber) || isCellFounded(cellNumber);
    };

    const isTimeToFinishLevel = (): boolean => {
        return alreadyFound.value.length === currentLevel.value.dimension ** 2;
    };

    const handleCellOpening = async (cellNumber: number) => {
        if (!checkpoint.isInInteractiveState()) {
            return;
        }

        if (isCorrectNumber(cellNumber)) {
            alreadyFound.value.push(cellNumber);

            if (isTimeToFinishLevel()) {
                await finishLevel();

                return;
            }

            setActiveRule();
            setActiveNumber();
        } else {
            mistakesAmount++;
        }
    };

    const flushFoundNumbers = () => {
        alreadyFound.value.length = 0;
    };

    const flushMistakesAmount = () => {
        mistakesAmount = 0;
    };

    const finishLevel = async () => {
        checkpoint.setFailedLevelFinishingState();
        saveSubtotal();
        flushMistakesAmount();

        checkpoint.promoteLevel();

        if (checkpoint.isTimeToFinishTest()) {
            await checkpoint.finishTest(subtotals);

            return;
        }

        if (checkpoint.isTimeToSwitchMode()) {
            await checkpoint.handleModeSwitching(Object.keys(levels).length);
        }

        checkpoint.resetTimer();

        hideCellsInstantly();
        flushFoundNumbers();

        await startLevel();
    };

    const saveSubtotal = () => {
        if (checkpoint.isInWarmUpMode()) {
            return;
        }

        const timeMs = checkpoint.totalTime - checkpoint.time;

        if (timeMs > TOTAL_TIME) {
            subtotals.push(0);
            return;
        }

        const time = timeMs / 1000;

        const maxAssessment = gorbovSchulteAssessmentTable.at(0);
        const maxPoints = maxAssessment?.point ?? 19;

        const currentAssessment = gorbovSchulteAssessmentTable.find((assessment) => {
            return assessment.time.min <= time && assessment.time.max >= time;
        });

        const point = currentAssessment?.point ?? 0;

        const totalPoints = point - mistakesAmount * 2;

        if (totalPoints <= 0) {
            subtotals.push(0);
            return;
        }

        const totalPercent = (totalPoints * 100) / maxPoints;

        subtotals.push(totalPercent);
    };

    const hideCellsInstantly = () => {
        hiddenNumbers.value = useShuffle(availableNumbers.value);
    };

    const showCellsSequentially = (): Promise<void> => {
        return new Promise((resolve) => {
            const show = async () => {
                if (checkpoint.isInPauseState()) {
                    await checkpoint.getPausePromise();
                }

                if (hiddenNumbers.value.length === 0) {
                    resolve();

                    return;
                }

                hiddenNumbers.value.splice(0, 2);

                cellAnimationTimerId = setTimeout(show, CELL_SHOWING_TIME);
            };

            cellAnimationTimerId = setTimeout(show, CELL_SHOWING_TIME);
        });
    };

    const startLevel = async () => {
        checkpoint.setLevelPreparingState();

        setActiveRule();
        setNumbers();

        setActiveNumber();

        await showCellsSequentially();
        await checkpoint.startCountdown();

        checkpoint.startTimer();

        checkpoint.setInteractiveState();
    };

    const clearCellAnimationTimer = () => {
        if (cellAnimationTimerId) {
            clearTimeout(cellAnimationTimerId);
        }
    };

    const $setup = async () => {
        checkpoint.setTestPreparingState();
        checkpoint.setWarmUpMode();

        checkpoint.setTotalTime(TOTAL_TIME);
        checkpoint.setLevelsAmount(Object.keys(levelsToWarmUp).length);

        hideCellsInstantly();

        await checkpoint.showPrompt('warmUpPrompt');
        await startLevel();
    };

    const $reset = () => {
        clearCellAnimationTimer();
        flushFoundNumbers();
        checkpoint.setTestPreparingState();
        checkpoint.$reset();
    };

    return {
        availableNumbers,
        dimension,
        getCellType,
        getCellIndex,
        handleCellOpening,
        isCellHidden,
        isSecondaryRuleActive,

        $setup,
        $reset,
    };
});
