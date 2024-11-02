// import type { CognitiveCategoryEnum } from '~/entities/enums/cognitiveCategoryEnum';
import type { ICheckpointStageCategory } from '~/modules/checkpoint/entities/interfaces/ICheckpointStageCategory';

export interface ICheckpointStage {
    id: number;
    // category: CognitiveCategoryEnum;
    score: number;
    isCompleted: boolean;
    category: ICheckpointStageCategory;
}
