<template>
    <WidgetCheckpointUiBadge>
        <p class="checkpoint-progress__title">{{ $t('progress') }}:</p>
        <div class="checkpoint-progress__container">
            <div class="checkpoint-progress__line" :style="lineStyle" />
        </div>
    </WidgetCheckpointUiBadge>
</template>

<script setup lang="ts">
import { useCheckpointStore } from '~/modules/checkpoint/stores/checkpointStore';

const checkpoint = useCheckpointStore();

const lineStyle = computed(() => {
    return `width: ${(checkpoint.finishedLevelsAmount / checkpoint.levelsAmount) * 100}%`;
});
</script>

<style scoped lang="scss" src="./checkpoint-ui-progress.styles.scss" />
