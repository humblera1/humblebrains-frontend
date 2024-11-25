<template>
    <Transition name="fade">
        <div v-show="uploader.message" class="message">
            <p>{{ uploader.error }}</p>
        </div>
    </Transition>
</template>

<script setup lang="ts">
const uploader = useImageUploaderStore();
</script>

<style scoped lang="scss" src="./avatar-uploader-modal-message.styles.scss" />
