import type { IGameTag } from '~/entities/interfaces/games/IGameTag';

export type GameUiTagProps = {
    tag: IGameTag;
    size?: 'small' | 'medium';
};
