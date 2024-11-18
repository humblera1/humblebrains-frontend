import type { IGameLevels } from '~/entities/interfaces/games/IGameLevels';
import type { BaseResponse } from '~/entities/interfaces/responses/BaseResponse';
import type { IGameResult } from '~/entities/interfaces/games/IGameResult';
import type { IGameFinishingResponseContent } from '~/entities/interfaces/responses/games/IGameFinishingResponseContent';
import type { IBaseGameLevel } from '~/entities/interfaces/games/IBaseGameLevel';
import { useUserStore } from '~/modules/user/stores/userStore';
import { RequestMethodEnum } from '~/entities/enums/RequestMethodEnum';

export const useGameService = () => {
    const { $api } = useNuxtApp();

    const user = useUserStore();

    const gamePage = useGamePageStore();

    // todo: обработка ошибок
    const fetchLevels = async (): Promise<IGameLevels<IBaseGameLevel>> => {
        const response = await $api<BaseResponse<IGameLevels<IBaseGameLevel>>>(`/v1/games/${gamePage.game}/levels`, {
            credentials: 'include',
        });

        return response.data;
    };

    const saveResults = async (result: IGameResult): Promise<{ hasGameCompletedSession: boolean; hasGameCompletedProgram: boolean }> => {
        const response = await $api<BaseResponse<IGameFinishingResponseContent>>('/v1/games/finish-game', {
            method: RequestMethodEnum.post,
            body: result,
            credentials: 'include',
        });

        let hasGameCompletedSession = false;
        let hasGameCompletedProgram = false;

        if (response.data?.checkpoint) {
            user.setCheckpointData(response.data.checkpoint);
        }

        if (response.data?.program) {
            hasGameCompletedProgram = response.data.program.lastSession.isCompleted;
            hasGameCompletedSession = response.data.program.lastSession.games.every((game) => !game.isCompleted);

            user.setProgramData(response.data?.program);
        }

        return { hasGameCompletedSession, hasGameCompletedProgram };
    };

    return { fetchLevels, saveResults };
};
