<template>
    <div class="cropper">
        <img v-if="image" :src="image" alt="Uploaded Image" />
    </div>
</template>

<script setup lang="ts">
import type { CropperProps } from '~/shared/ui/cropper/cropper.types';

defineProps<CropperProps>();
</script>

<style scoped lang="scss">
.cropper {
    display: flex;
    justify-content: center;
    align-items: center;

    img {
        object-fit: cover;
        width: 100%;
        height: 100%;
    }
}
</style>
