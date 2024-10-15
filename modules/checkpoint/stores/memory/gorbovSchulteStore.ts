import { defineStore } from 'pinia';
import { useCheckpointStore } from '~/modules/checkpoint/stores/checkpointStore';
import { useCheckpointPageStore } from '~/modules/checkpoint/stores/checkpointPageStore';
import type { GorbovSchulteLevel } from '~/modules/checkpoint/entities/types/gorbov-schulte/GorbovSchulteLevel';
import type { ITestLevels } from '~/modules/checkpoint/entities/interfaces/ITestLevels';
import { RuleEnum } from '~/modules/checkpoint/entities/enums/gorbov-schulte/RuleEnum';

export const useGorbovSchulteStore = defineStore('gorbovSchulteStorage', () => {
    /**
     *
     */
    const TOTAL_TIME = 350;

    const CELL_SHOWING_TIME = 150;

    const checkpoint = useCheckpointStore();

    const page = useCheckpointPageStore();

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

    const levelsToWarmUp: ITestLevels<GorbovSchulteLevel> = {
        1: {
            dimension: 2,
        },
    };

    const levels: ITestLevels<GorbovSchulteLevel> = {
        1: {
            dimension: 7,
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

    const isPrimaryRuleActive = () => {
        return activeRule.value === RuleEnum.primary;
    };

    const isSecondaryRuleActive = () => {
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
        }
    };

    const flushFoundNumbers = () => {
        alreadyFound.value.length = 0;
    };

    const finishLevel = async () => {
        checkpoint.setFailedLevelFinishingState();
        checkpoint.stopTimer();

        checkpoint.finishLevel();

        if (checkpoint.isTimeToFinishTest()) {
            if (checkpoint.isInWarmUpMode()) {
                await handleModeSwitching();
            } else {
                finishTest();

                return;
            }
        }

        checkpoint.resetTimer();

        hideCellsInstantly();
        flushFoundNumbers();

        await startLevel();
    };

    const finishTest = () => {
        saveTotal();
        checkpoint.setTestFinishingState();
        checkpoint.setMessage('Отлично! Готовим следующий этап...');

        page.moveChain();
    };

    const saveSubtotal = () => {
        // ...
    };

    const saveTotal = () => {
        // ...
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
        // ...
    };

    return {
        availableNumbers,
        dimension,
        getCellType,
        getCellIndex,
        handleCellOpening,
        isCellHidden,

        $setup,
        $reset,
    };
});
