import type { IProgramPreview } from '~/entities/interfaces/program/IProgramPreview';
import type { ICheckpoint } from '~/modules/checkpoint/entities/interfaces/ICheckpoint';

export interface IGameFinishingResponseContent {
    /**
     * Идентификатор пользователя.
     */
    userId: number;

    /**
     * Ключ будет присутствовать только в случае, если сыгранная игра завершила программу.
     * После завершения программы автоматически создается новая контрольная точка для прохождения.
     *
     * В противном случае не требуется обновления состояния пользователя, связанного с контрольной точки.
     */
    checkpoint?: ICheckpoint;

    /**
     * Ключ будет присутствовать только в случае, если сохранялась игра, сыгранная в рамках сессии.
     * В противном случае не требуется обновления состояния пользователя, связанного с программой.
     */
    program?: IProgramPreview;
}
