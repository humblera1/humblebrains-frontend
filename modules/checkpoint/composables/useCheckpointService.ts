import { RequestMethodEnum } from '~/entities/enums/RequestMethodEnum';
import type { CognitiveCategoryEnum } from '~/entities/enums/cognitiveCategoryEnum';
import type { Icon } from '~/modules/checkpoint/entities/types/Icon';
import type { BaseResponse } from '~/entities/interfaces/responses/BaseResponse';
import type { ICheckpointStage } from '~/modules/checkpoint/entities/interfaces/ICheckpointStage';
import type { IProgram } from '~/entities/interfaces/program/IProgram';

export const useCheckpointService = () => {
    const { $api } = useNuxtApp();

    const finishCheckpoint = async (category: CognitiveCategoryEnum): Promise<BaseResponse<IProgram>> => {
        return await $api<BaseResponse<IProgram>>('/v1/checkpoint/finish-checkpoint', {
            method: RequestMethodEnum.post,
            credentials: 'include',
            body: {
                category,
            },
        });
    };

    const sendStageResults = async (category: CognitiveCategoryEnum, score: number): Promise<BaseResponse<ICheckpointStage>> => {
        return await $api<BaseResponse<ICheckpointStage>>('/v1/checkpoint/finish-stage', {
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

    const fetchRawSvgContent = async (src: string): Promise<string> => {
        const blob = await $api<Blob>(src);

        return await blob.text();
    };

    return { finishCheckpoint, sendStageResults, fetchIcons, fetchWords, fetchRawSvgContent };
};
