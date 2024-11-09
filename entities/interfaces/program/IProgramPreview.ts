import type { ISession } from '~/entities/interfaces/session/ISession';

export interface IProgramPreview {
    id: number;
    isCompleted: boolean;
    lastSession: ISession;
}
