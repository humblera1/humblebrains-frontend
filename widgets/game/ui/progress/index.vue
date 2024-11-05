<template>
    <div :class="['progress', `progress_${size}`]">
        <div class="progress__container">
            <div class="progress__line" />
            <div class="progress__progress" :style="progressStyle" />
        </div>
        <p class="progress__value">
            <span class="progress__current">{{ current }}</span>
            / {{ max }}
        </p>
    </div>
</template>

<script setup lang="ts">
import type { GameUiProgressProps } from '~/widgets/game/ui/progress/game-ui-progress.types';

const { current, max, size = 'medium' } = defineProps<GameUiProgressProps>();

const progressStyle = computed((): string => {
    return `width:${(15 / max) * 100}%`;
});
</script>

<style scoped lang="scss" src="./game-ui-progress.styles.scss" />
