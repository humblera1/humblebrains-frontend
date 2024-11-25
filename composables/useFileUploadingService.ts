import { RequestMethodEnum } from '~/entities/enums/RequestMethodEnum';
import type { BaseResponse } from '~/entities/interfaces/responses/BaseResponse';
import type { IFileValidationResponseContent } from '~/entities/interfaces/responses/files/IFileValidationResponseContent';

export const useFileUploadingService = () => {
    const { $api } = useNuxtApp();

    const getFormDataFromFile = (file: File): FormData => {
        const formData = new FormData();

        formData.append('file', file);

        return formData;
    };

    const uploadImage = async (file: File) => {
        return await $api<BaseResponse<IFileValidationResponseContent>>('v1/users/set-avatar', {
            method: RequestMethodEnum.post,
            credentials: 'include',
            body: getFormDataFromFile(file),
        });
    };

    const validateFile = async (file: File): Promise<BaseResponse<IFileValidationResponseContent>> => {
        return await $api<BaseResponse<IFileValidationResponseContent>>('v1/files/validate-file', {
            method: RequestMethodEnum.post,
            credentials: 'include',
            body: getFormDataFromFile(file),
        });
    };

    return { validateFile, uploadImage };
};
