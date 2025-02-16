import type { IGameLevel } from '~/entities/interfaces/games/IGameLevel';

export interface IGameLevels<T> {
    game: string;
    image: string;
    time: number;
    maxUserLevel: number;
    lastUserLevel: number;
    target: number;
    levels: IGameLevel<T>;
}
