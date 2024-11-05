<template>
    <div class="text">
        <div class="text__content">
            <p class="text__title">
                {{ title }}
            </p>
            <p class="text__text">
                {{ text }}
            </p>
        </div>
        <div class="text__scroll"></div>
    </div>
</template>

<script setup lang="ts">
import type { TextProps } from '~/shared/ui/text/text.types';

defineProps<TextProps>();
</script>

<style scoped lang="scss" src="./text.styles.scss" />
