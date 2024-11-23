import { defineStore } from 'pinia';
import { FetchError } from 'ofetch';
import { UploaderStateEnum } from '~/entities/enums/UploaderStateEnum';
import { useFileUploadingService } from '~/composables/useFileUploadingService';
import { ResponseStatusCodeEnum } from '~/entities/enums/ResponseStatusCodeEnum';
import type { IValidationErrorResponse } from '~/entities/interfaces/responses/auth/IValidationErrorResponse';
import type { IFileValidationErrors } from '~/entities/interfaces/forms/file/IFileValidationErrors';

export const useImageUploaderStore = defineStore('imageUploaderStore', () => {
    const service = useFileUploadingService();

    const image = ref<string | undefined>(undefined);

    const state = ref<UploaderStateEnum>(UploaderStateEnum.Waiting);

    const error = ref<string | undefined>(undefined);

    const message = computed((): string => {
        switch (state.value) {
            case UploaderStateEnum.Waiting:
            case UploaderStateEnum.Error:
                return 'dragOrUploadFile';
            case UploaderStateEnum.Uploading:
                return 'uploading';
            case UploaderStateEnum.Editing:
                return 'saveAfterEditing';
            case UploaderStateEnum.Saving:
                return 'saving';
        }
    });

    const setState = (stateToSet: UploaderStateEnum) => {
        state.value = stateToSet;
    };

    const isInState = (stateToCheck: UploaderStateEnum) => {
        return state.value === stateToCheck;
    };

    /**
     * Устанавливает состояние ожидания загрузки файла.
     */
    const setWaitingState = () => {
        setState(UploaderStateEnum.Waiting);
    };

    /**
     * Проверяет, находится ли стор в состоянии ожидания загрузки.
     */
    const isInWaitingState = () => {
        return isInState(UploaderStateEnum.Waiting);
    };

    /**
     * Устанавливает состояние загрузки файла.
     */
    const setUploadingState = () => {
        setState(UploaderStateEnum.Uploading);
    };

    /**
     * Проверяет, находится ли файл в состоянии загрузки.
     */
    const isInUploadingState = () => {
        return isInState(UploaderStateEnum.Uploading);
    };

    /**
     * Устанавливает состояние редактирования файла.
     */
    const setEditingState = () => {
        setState(UploaderStateEnum.Editing);
    };

    /**
     * Проверяет, находится ли файл в состоянии редактирования.
     */
    const isInEditingState = () => {
        return isInState(UploaderStateEnum.Editing);
    };

    /**
     * Устанавливает состояние ошибки валидации.
     */
    const setErrorState = () => {
        setState(UploaderStateEnum.Error);
    };

    /**
     * Проверяет, находится ли файл в состоянии ошибок валидации.
     */
    const isInErrorState = () => {
        return isInState(UploaderStateEnum.Error);
    };

    /**
     * Устанавливает состояние сохранения файла.
     */
    const setSavingState = () => {
        setState(UploaderStateEnum.Saving);
    };

    /**
     * Проверяет, находится ли файл в состоянии сохранения.
     */
    const isInSavingState = () => {
        return isInState(UploaderStateEnum.Saving);
    };

    const setError = (content: string) => {
        error.value = content;

        setErrorState();
    };

    const uploadImage = async (imageToUpload: File | undefined) => {
        if (imageToUpload) {
            setUploadingState();

            try {
                const response = await service.validateFile(imageToUpload);

                if (response.data.success) {
                    const reader = new FileReader();

                    reader.onload = (e) => {
                        image.value = e.target?.result as string;

                        setEditingState();
                    };

                    reader.readAsDataURL(imageToUpload);
                }
            } catch (errorResponse) {
                const unknownResponse = errorResponse as FetchError;

                if (unknownResponse.statusCode === ResponseStatusCodeEnum.UnprocessableEntity) {
                    const validationErrorResponse = unknownResponse as IValidationErrorResponse<IFileValidationErrors>;

                    setError(validationErrorResponse.data.message);

                    return;
                }

                setError('An unexpected error occurred.');
            }
        }
    };

    const $setup = () => {
        console.log('setup uploader...');
    };

    const $reset = () => {
        console.log('reset uploader...');

        image.value = undefined;
        error.value = undefined;
        state.value = UploaderStateEnum.Waiting;
    };

    return {
        isInWaitingState,
        isInUploadingState,
        isInErrorState,
        isInEditingState,
        isInSavingState,

        message,
        error,
        image,
        uploadImage,
        $setup,
        $reset,

        state,
    };
});
