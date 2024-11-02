import type { ICheckpointStage } from '~/modules/checkpoint/entities/interfaces/ICheckpointStage';

export type CheckpointUiCardProps = {
    stage: ICheckpointStage;
    type?: 'stage' | 'checkpoint';
};
