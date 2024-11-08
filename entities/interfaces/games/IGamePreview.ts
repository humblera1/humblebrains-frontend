import type { IGameTag } from '~/entities/interfaces/games/IGameTag';

export interface IGamePreview {
    id: number;
    name: string;
    label: string;
    description: string;
    image: string | null;
    maxLevel: number;
    userLevel: number;
    tags: IGameTag[];
}
