import { RequestMethodEnum } from '~/entities/enums/RequestMethodEnum';
import type { CognitiveCategoryEnum } from '~/entities/enums/cognitiveCategoryEnum';
import type { User } from '~/modules/user/entities/interfaces/User';
import type { Icon } from '~/modules/checkpoint/entities/types/Icon';

export const useCheckpointService = () => {
    const { $api } = useNuxtApp();

    const sendStageResults = async (category: CognitiveCategoryEnum, score: number) => {
        return await $api<void>('/v1/checkpoint/finish-stage', {
            method: RequestMethodEnum.post,
            credentials: 'include',
            body: {
                category,
                score,
            },
        });
    };

    const fetchIcons = async (amount: number): Promise<Icon[]> => {
        return await $api<Icon[]>('/v1/icons/get-icons', {
            method: RequestMethodEnum.get,
            params: {
                amount,
            },
        });
    };

    const fetchWords = async (amount: number): Promise<string[]> => {
        return await $api<string[]>('/v1/words/get-words', {
            method: RequestMethodEnum.get,
            params: {
                amount,
            },
        });
    };

    return { sendStageResults, fetchIcons, fetchWords };
};
