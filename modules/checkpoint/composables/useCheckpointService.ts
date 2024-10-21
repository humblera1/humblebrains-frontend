import { RequestMethodEnum } from '~/entities/enums/RequestMethodEnum';
import type { CognitiveCategoryEnum } from '~/entities/enums/cognitiveCategoryEnum';

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

    return { sendStageResults };
};
