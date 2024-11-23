<template>
    <UiModal>
        <div class="avatar-uploader">
            <div
                class="avatar-uploader__body"
                :class="{ 'avatar-uploader__body_hovered': isDragOver }"
                @dragover.prevent
                @dragenter.prevent="onDragEnter"
                @dragleave.prevent="onDragLeave"
                @drop.prevent="onDrop"
            >
                <IconArrowRounded :filled="isDragOver" class="avatar-uploader__arrow" />
            </div>
            <div class="avatar-uploader__footer">
                <p class="avatar-uploader__message">{{ $t(uploader.message) }}</p>
                <UiButton @click="triggerFileInput">{{ uploader.isEditingState() ? $t('save') : $t('select') }}</UiButton>
            </div>
            <input ref="fileInput" type="file" accept="image/*" style="display: none" @change="onFileChange" />
        </div>
    </UiModal>
</template>

<script setup lang="ts">
import { useImageUploaderStore } from '~/stores/imageUploaderStore';

const fileInput = ref<HTMLInputElement | null>(null);
const isDragOver = ref<boolean>(false);

const uploader = useImageUploaderStore();

function onFileChange(event: Event) {
    uploader.uploadImage((event.target as HTMLInputElement).files?.[0]);
}

function onDrop(event: DragEvent) {
    event.preventDefault();
    isDragOver.value = false;

    uploader.uploadImage(event.dataTransfer?.files[0]);
}

function onDragEnter(event: DragEvent) {
    event.preventDefault();
    isDragOver.value = true;
}

function onDragLeave(event: DragEvent) {
    event.preventDefault();
    isDragOver.value = false;
}

function triggerFileInput() {
    fileInput.value?.click();
}

onMounted(() => {
    uploader.$setup();
});

onUnmounted(() => {
    uploader.$reset();
});
</script>

<style scoped lang="scss">
.avatar-uploader {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 60px;
    padding: 84px 96px 96px 96px;
    border-radius: 48px;
    background-color: var(--primary-bg);

    @include tablet {
        gap: 54px;
        border-radius: 36px;
        padding: 72px 60px 60px 60px;
    }

    @include mobile {
        justify-content: center;
        gap: 48px;
        height: 100vh;
        border-radius: unset;
    }

    &__body {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 160px;
        height: 160px;
        border: 3px dashed var(--blue-light);
        border-radius: 100px;
        padding: 20px;
        text-align: center;
        cursor: pointer;
        transition: all 250ms ease;

        &_hovered {
            background-color: var(--blue);
            border: 3px solid var(--blue-light);

            .avatar-uploader__arrow {
                color: var(--accent-white);
            }
        }
    }

    &__footer {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
    }

    &__arrow {
        width: 36px;
        height: 42px;

        pointer-events: none;
        color: var(--blue-light);
        transition: all 250ms ease;

        @include tablet {
            width: 32px;
            height: 37px;
        }
    }

    &__message {
        text-align: center;
        max-width: 340px;

        @include mainFont(400, 20, var(--primary-subtitle));

        @include tablet {
            font-size: 18px;
        }

        @include mobile {
            max-width: 300px;
            font-size: 16px;
        }
    }
}
</style>
