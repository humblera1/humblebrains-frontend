import type { GameEnum } from '~/entities/enums/games/GameEnum';

export const useGameService = () => {
    const { $api } = useNuxtApp();

    const getLevels = async (game: GameEnum) => {
        return await $api('/v1/game/levels', {
            params: {
                game,
            },
        });
    };

    return { getLevels };
};
