<template>
    <UiModal>
        <div class="avatar-uploader">
            <Transition name="fade" mode="out-in">
                <UiPreloader v-if="showPreloader" />
                <div v-else class="avatar-uploader__content">
                    <Transition mode="out-in">
                        <div v-if="showArea" class="avatar-uploader__area">
                            <WidgetModalAvatarUploaderArea />
                            <WidgetModalAvatarUploaderError v-show="uploader.isInErrorState()" />
                        </div>
                        <div v-else-if="uploader.isInEditingState()" class="avatar-uploader__cropper">
                            <div class="avatar-uploader__cropper-component">
                                <UiCropper v-if="uploader.image" ref="cropper" :image="uploader.image" return-as="File" lazy-evaluation />
                            </div>
                            <WidgetModalAvatarUploaderMessage />
                        </div>
                    </Transition>
                    <div class="avatar-uploader__footer">
                        <p class="avatar-uploader__message">{{ $t(uploader.message) }}</p>
                        <UiButton v-show="!showPreloader" @click="handleClick">
                            {{ uploader.isInEditingState() ? $t('save') : $t('select') }}
                        </UiButton>
                    </div>
                    <input ref="fileInput" type="file" accept="image/*" style="display: none" @change="onFileChange" />
                </div>
            </Transition>
        </div>
    </UiModal>
</template>

<script setup lang="ts">
import { useImageUploaderStore } from '~/stores/imageUploaderStore';
import type { CropperExposedMethods } from '~/shared/ui/cropper/cropper.types';
import type { BaseResponse } from '~/entities/interfaces/responses/BaseResponse';
import type { User } from '~/modules/user/entities/interfaces/User';
import { useUserStore } from '~/modules/user/stores/userStore';

const cropper = ref<null | CropperExposedMethods>(null);

const fileInput = ref<HTMLInputElement | null>(null);

const uploader = useImageUploaderStore();

const userStore = useUserStore();

const { closeModal } = useHumbleModal();

const showArea = computed((): boolean => {
    return uploader.isInWaitingState() || uploader.isInErrorState();
});

const showPreloader = computed((): boolean => {
    return uploader.isInUploadingState() || uploader.isInSavingState();
});

function onFileChange(event: Event) {
    uploader.uploadImage((event.target as HTMLInputElement).files?.[0]);
}

const handleClick = async () => {
    if (uploader.isInEditingState()) {
        await handleSaving();
    } else {
        fileInput.value?.click();
    }
};

const handleSaving = async () => {
    if (!cropper.value) {
        return;
    }

    const file = await cropper.value.getFile();

    if (!file) {
        return;
    }

    const user: BaseResponse<User> | undefined = await uploader.uploadCroppedImage(file);

    if (user?.data?.personalData) {
        userStore.setPersonalData(user.data.personalData);
    }

    closeModal();
};

onMounted(() => {
    uploader.$setup();
});

onUnmounted(() => {
    uploader.$reset();
});
</script>

<style scoped lang="scss" src="./avatar-uploader-modal.styles.scss" />
