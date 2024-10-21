import type { ICheckpointStage } from '~/modules/checkpoint/entities/interfaces/ICheckpointStage';

export interface ICheckpoint {
    id: number;
    isCompleted: boolean;
    stages: ICheckpointStage[];
}
