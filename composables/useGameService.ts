import type { IGameLevels } from '~/entities/interfaces/games/IGameLevels';
import type { BaseResponse } from '~/entities/interfaces/responses/BaseResponse';
import type { IGameResult } from '~/entities/interfaces/games/IGameResult';
import type { IGameFinishingResponseContent } from '~/entities/interfaces/responses/games/IGameFinishingResponseContent';

export const useGameService = () => {
    const { $api } = useNuxtApp();

    const gamePage = useGamePageStore();

    // todo: обработка ошибок
    const fetchLevels = async (): Promise<BaseResponse<IGameLevels<any>>> => {
        return await $api<BaseResponse<IGameLevels<any>>>(`/v1/games/${gamePage.game}/levels`);
    };

    const saveResults = async (result: IGameResult) => {
        const response = await $api<BaseResponse<IGameFinishingResponseContent>>('/v1/games/finish-game?XDEBUG_SESSION=XDEBUG_ECLIPSE', {
            method: 'POST',
            body: result,
        });

        // todo: update user program & session
        if (response.data?.program) {
            console.log(response.data?.program);
        }

        return response;
    };

    return { fetchLevels, saveResults };
};
