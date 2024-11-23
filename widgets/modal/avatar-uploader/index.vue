<template>
    <UiModal>
        <div class="avatar-uploader">
            <div class="avatar-uploader__body">
                <Transition name="fade" mode="out-in">
                    <div
                        v-if="showArea"
                        class="avatar-uploader__area"
                        :class="{ 'avatar-uploader__area_hovered': isDragOver }"
                        @dragover.prevent
                        @dragenter.prevent="onDragEnter"
                        @dragleave.prevent="onDragLeave"
                        @drop.prevent="onDrop"
                    >
                        <IconArrowRounded :filled="isDragOver" class="avatar-uploader__arrow" />
                    </div>
                    <UiPreloader v-else-if="showPreloader" />
                    <UiCropper
                        v-else-if="uploader.image"
                        :image="uploader.image"
                        :aspect-ratio="aspectRatio"
                        :stencil-component="stencilComponent"
                    />
                </Transition>
            </div>
            <div class="avatar-uploader__status">
                <p class="avatar-uploader__error">{{ uploader.error }}</p>
            </div>

            <div class="avatar-uploader__footer">
                <p class="avatar-uploader__message">{{ $t(uploader.message) }}</p>
                <UiButton v-show="!uploader.isInUploadingState()" @click="triggerFileInput">
                    {{ uploader.isInEditingState() ? $t('save') : $t('select') }}
                </UiButton>
            </div>
            <input ref="fileInput" type="file" accept="image/*" style="display: none" @change="onFileChange" />
        </div>
    </UiModal>
</template>

<script setup lang="ts">
import { useImageUploaderStore } from '~/stores/imageUploaderStore';

const aspectRatio = ref<number>(16 / 9); // Пример значения
const stencilComponent = ref<string>('rectangle');

const fileInput = ref<HTMLInputElement | null>(null);
const isDragOver = ref<boolean>(false);

const uploader = useImageUploaderStore();

const showArea = computed((): boolean => {
    return uploader.isInWaitingState();
});

const showPreloader = computed((): boolean => {
    return uploader.isInUploadingState() || uploader.isInSavingState();
});

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
    justify-content: center;
    //gap: 60px;
    min-height: 550px;
    min-width: 500px;
    max-width: 500px;
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
        flex-direction: column;
        align-items: center;
        min-height: 160px;
        max-height: 160px;
        max-width: 200px;
        margin-bottom: 16px;
        //gap: 16px;
    }

    &__status {
        margin-bottom: 28px;
    }

    &__footer {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
    }

    &__area {
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
        max-width: 350px;

        @include mainFont(400, 20, var(--primary-subtitle));

        @include tablet {
            font-size: 18px;
        }

        @include mobile {
            max-width: 300px;
            font-size: 16px;
        }
    }

    &__error {
        max-width: 350px;
        min-height: 16px;

        @include mainFont(400, 14, var(--input-invalid));

        @include tablet {
            font-size: 12px;
        }

        @include mobile {
            //font-size: 12px;
            max-width: 300px;
        }
    }
}
</style>
