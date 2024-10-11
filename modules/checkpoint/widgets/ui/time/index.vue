<template>
    <WidgetCheckpointUiBadge>
        <span class="checkpoint-time__info">
            <span> {{ $t('time') }}: </span>
            <span class="checkpoint-time__time"> {{ formattedTime }} </span>
        </span>
        <div class="checkpoint-time__container">
            <div class="checkpoint-time__line" :style="lineStyle" />
        </div>
    </WidgetCheckpointUiBadge>
</template>

<script setup lang="ts">
import { useCheckpointStore } from '~/modules/checkpoint/stores/checkpointStore';

const checkpoint = useCheckpointStore();

const formattedTime = computed((): string => {
    const minutes = Math.floor(checkpoint.time / 60);
    const seconds = checkpoint.time % 60;

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
});

const lineStyle = computed(() => {
    return `width: ${(checkpoint.time / checkpoint.totalTime) * 100}%`;
});
</script>

<style scoped lang="scss" src="./checkpoint-ui-time.styles.scss" />
