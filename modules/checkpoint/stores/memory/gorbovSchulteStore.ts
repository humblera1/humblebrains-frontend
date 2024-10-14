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

    const checkpoint = useCheckpointStore();

    const page = useCheckpointPageStore();

    const primaryNumbers = ref<number[]>([]);

    const secondaryNumbers = ref<number[]>([]);

    const alreadyFound: number[] = [];

    const activeRule = ref<RuleEnum>();

    let activeNumber: number;

    const levelsToWarmUp: ITestLevels<GorbovSchulteLevel> = {
        1: {
            dimension: 5,
        },
    };

    const levels: ITestLevels<GorbovSchulteLevel> = {
        1: {
            dimension: 5,
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

    const setNumbers = () => {
        const range = dimension.value ** 2;
        const availableNumbers = useRange(1, range + 1);
        const shuffledNumbers = useShuffle(availableNumbers);

        const halfLength = Math.ceil(range / 2);

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
        let progress = Math.ceil(alreadyFound.length / 2);

        // Если "главное" правило, ищем с конца массива primaryNumbers
        if (isPrimaryRuleActive()) {
            progress++;
            const activeNumberIndex = primaryNumbers.value.length - progress;

            if (activeNumberIndex > 0) {
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

    const handleCellOpening = (cellNumber: number) => {
        if (!checkpoint.isInInteractiveState()) {
            return;
        }

        if (isCorrectNumber(cellNumber)) {
            alreadyFound.push(cellNumber);

            setActiveRule();
            setActiveNumber();

            console.log('now find: ' + getCellIndex(activeNumber) + ' ' + activeRule.value);
        }
    };

    const $setup = () => {
        checkpoint.setTestPreparingState();
        setActiveRule();
        setNumbers();

        setActiveNumber();

        // todo: start level
        checkpoint.setInteractiveState();
    };

    const $reset = () => {
        // ...
    };

    return {
        dimension,
        getCellType,
        getCellIndex,
        handleCellOpening,

        $setup,
        $reset,
    };
});
