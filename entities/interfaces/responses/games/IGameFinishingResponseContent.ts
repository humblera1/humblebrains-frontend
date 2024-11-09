import type { IProgramPreview } from '~/entities/interfaces/program/IProgramPreview';

export interface IGameFinishingResponseContent {
    /**
     * Ключ будет присутствовать только в случае, если сохранялась игра, сыгранная в рамках сессии.
     * В противном случае не требуется обновления состояния пользователя, связанного с программой.
     */
    program?: IProgramPreview;
}
