import type { IGameLevel } from '~/entities/interfaces/games/IGameLevel';

export interface IGameLevels<T> {
    maxUserLevel: number;
    lastUserLevel: number;
    target: number;
    levels: IGameLevel<T>;
}
