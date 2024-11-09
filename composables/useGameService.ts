import type { IGameLevels } from '~/entities/interfaces/games/IGameLevels';
import type { BaseResponse } from '~/entities/interfaces/responses/BaseResponse';

export const useGameService = () => {
    const { $api } = useNuxtApp();

    const gamePage = useGamePageStore();

    // todo: обработка ошибок
    const fetchLevels = async (): Promise<BaseResponse<IGameLevels<any>>> => {
        return await $api<BaseResponse<IGameLevels<any>>>(`/v1/games/${gamePage.game}/levels`);
    };

    return { fetchLevels };
};
