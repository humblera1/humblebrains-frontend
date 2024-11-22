import type { ISession } from '~/entities/interfaces/session/ISession';
import type { IGameCategory } from '~/entities/interfaces/games/IGameCategory';

export interface IProgram {
    id: number;
    sessionsAmount: number;
    completedSessionsAmount: number;
    isCompleted: boolean;
    category: IGameCategory;
    currentSession: ISession;
    createdAt: string;
}
