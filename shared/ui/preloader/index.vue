<template>
    <div :class="['preloader', `preloader_${size}`]">
        <div class="preloader__spinner"></div>
    </div>
</template>

<script setup lang="ts">
import type { PreloaderProps } from '~/shared/ui/preloader/preloader.types';

const { size = 'medium' } = defineProps<PreloaderProps>();
</script>

<style scoped lang="scss" src="./preloader.styles.scss" />
