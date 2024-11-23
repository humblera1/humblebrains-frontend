import { defineStore } from 'pinia';
import { UploaderStateEnum } from '~/entities/enums/UploaderStateEnum';

export const useImageUploaderStore = defineStore('imageUploaderStore', () => {
    const image = ref<string | undefined>(undefined);

    const state = ref<UploaderStateEnum>(UploaderStateEnum.Waiting);

    const message = computed((): string => {
        switch (state.value) {
            case UploaderStateEnum.Waiting:
                return '';
        }
    });

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
        image,
        uploadImage,
        $setup,
        $reset,
    };
});
