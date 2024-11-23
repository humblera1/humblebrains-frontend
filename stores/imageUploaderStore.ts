import { defineStore } from 'pinia';
import { UploaderStateEnum } from '~/entities/enums/UploaderStateEnum';

export const useImageUploaderStore = defineStore('imageUploaderStore', () => {
    const image = ref<string | undefined>(undefined);

    const state = ref<UploaderStateEnum>(UploaderStateEnum.Waiting);

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

    const isState = (stateToCheck: UploaderStateEnum) => {
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
    const isWaitingState = () => {
        return isState(UploaderStateEnum.Waiting);
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
    const isUploadingState = () => {
        return isState(UploaderStateEnum.Uploading);
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
    const isEditingState = () => {
        return isState(UploaderStateEnum.Editing);
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
    const isErrorState = () => {
        return isState(UploaderStateEnum.Error);
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
    const isSavingState = () => {
        return isState(UploaderStateEnum.Saving);
    };

    const uploadImage = (imageToUpload: File | undefined) => {
        if (imageToUpload) {
            const reader = new FileReader();

            reader.onload = (e) => {
                image.value = e.target?.result as string;
            };

            reader.readAsDataURL(imageToUpload);
        }
    };

    const $setup = () => {
        console.log('setup uploader...');
    };

    const $reset = () => {
        console.log('reset uploader...');

        image.value = undefined;
        state.value = UploaderStateEnum.Waiting;
    };

    return {
        isWaitingState,
        isUploadingState,
        isErrorState,
        isEditingState,
        isSavingState,

        message,
        image,
        uploadImage,
        $setup,
        $reset,
    };
});
