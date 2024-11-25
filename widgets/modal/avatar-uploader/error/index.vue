<template>
    <div class="error">
        <IconExclamationTriangle class="error__icon" />
        <p class="error__message">
            {{ uploader.error }}
        </p>
    </div>
</template>

<script setup lang="ts">
const uploader = useImageUploaderStore();
</script>

<style scoped lang="scss" src="./avatar-uploader-modal-error.styles.scss" />
