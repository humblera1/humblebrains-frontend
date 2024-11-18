import type { ISession } from '~/entities/interfaces/session/ISession';

export interface IProgram {
    id: number;
    isCompleted: boolean;
    lastSession: ISession;
}
