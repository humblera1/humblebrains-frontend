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

    const validateFile = async (file: File): Promise<BaseResponse<IFileValidationResponseContent>> => {
        const formData = getFormDataFromFile(file);

        return await $api<BaseResponse<IFileValidationResponseContent>>('v1/files/validate-file', {
            method: RequestMethodEnum.post,
            credentials: 'include',
            body: formData,
        });
    };

    return { validateFile };
};
