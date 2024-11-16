import type { IGameLevels } from '~/entities/interfaces/games/IGameLevels';
import type { BaseResponse } from '~/entities/interfaces/responses/BaseResponse';
import type { IGameResult } from '~/entities/interfaces/games/IGameResult';
import type { IGameFinishingResponseContent } from '~/entities/interfaces/responses/games/IGameFinishingResponseContent';
import type { IBaseGameLevel } from '~/entities/interfaces/games/IBaseGameLevel';

export const useGameService = () => {
    const { $api } = useNuxtApp();

    const gamePage = useGamePageStore();

    // todo: обработка ошибок
    const fetchLevels = async (): Promise<IGameLevels<IBaseGameLevel>> => {
        const response = await $api<BaseResponse<IGameLevels<IBaseGameLevel>>>(
            `/v1/games/${gamePage.game}/levels?XDEBUG_SESSION=XDEBUG_ECLIPSE`,
            {
                credentials: 'include',
            },
        );

        return response.data;
    };

    const saveResults = async (result: IGameResult) => {
        const response = await $api<BaseResponse<IGameFinishingResponseContent>>('/v1/games/finish-game?XDEBUG_SESSION=XDEBUG_ECLIPSE', {
            method: 'POST',
            body: result,
            credentials: 'include',
        });

        console.log(response.data);

        // todo: update user program & session
        // if (response.data?.program) {
        //     console.log(response.data?.program);
        // }

        return response;
    };

    return { fetchLevels, saveResults };
};
