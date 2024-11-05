import type { IGameCategory } from '~/entities/interfaces/games/IGameCategory';
import type { IGameTutorial } from '~/entities/interfaces/games/IGameTutorial';
import type { IGameTag } from '~/entities/interfaces/games/IGameTag';

export interface IGameDetails {
    id: number;
    label: string;
    description: string;
    image: string | null;
    maxLevel: number;
    userLevel: number;
    category: IGameCategory;
    tutorial: IGameTutorial;
    tags: IGameTag[];
}
