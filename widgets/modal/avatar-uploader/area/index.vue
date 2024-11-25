<template>
    <div class="area">
        <div :class="inputClass" @dragover.prevent @dragenter.prevent="onDragEnter" @dragleave.prevent="onDragLeave" @drop.prevent="onDrop">
            <IconArrowRounded class="area__icon" :filled="isDragOver" />
        </div>
        <WidgetModalAvatarUploaderMessage />
    </div>
</template>

<script setup lang="ts">
const uploader = useImageUploaderStore();

const isDragOver = ref<boolean>(false);

const inputClass = computed(() => {
    return [
        'area__input',
        {
            area__input_dragover: isDragOver.value,
        },
    ];
});

function onDragEnter() {
    isDragOver.value = true;
}

function onDragLeave() {
    isDragOver.value = false;
}

function onDrop(event: DragEvent) {
    isDragOver.value = false;

    uploader.uploadImage(event.dataTransfer?.files[0]);
}
</script>

<style scoped lang="scss" src="./avatar-uploader-modal-area.styles.scss" />
