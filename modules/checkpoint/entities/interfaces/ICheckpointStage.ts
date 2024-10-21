import type { CognitiveCategoryEnum } from '~/entities/enums/cognitiveCategoryEnum';

export interface ICheckpointStage {
    id: number;
    category: CognitiveCategoryEnum;
    score: number;
    isCompleted: boolean;
}
