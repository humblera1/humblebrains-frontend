export interface ICheckpointStatistics {
    /**
     * Серийные номера этапов.
     */
    stages: number[];

    /**
     * Значения счёта для категории "Память".
     */
    memory: number[];

    /**
     * Значения счёта для категории "Внимание".
     */
    attention: number[];
}
