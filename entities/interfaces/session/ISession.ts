import type { ISessionGame } from '~/entities/interfaces/session/ISessionGame';

export interface ISession {
    id: number;
    isCompleted: boolean;
    games: ISessionGame[];
}
