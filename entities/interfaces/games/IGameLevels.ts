import type { IGameLevel } from '~/entities/interfaces/games/IGameLevel';

export interface IGameLevels<T> {
    maxLevel: number;
    userLevel: number;
    levels: IGameLevel<T>;
}
