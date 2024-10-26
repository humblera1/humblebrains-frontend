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
    const totalSeconds = checkpoint.time / 1000;

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
});

const lineStyle = computed((): string => {
    // Используем разную скорость анимации в зависимости от того, идёт увеличение или уменьшение таймера
    const transitionDuration = checkpoint.time < checkpoint.totalTime ? 1000 : 100;

    // рассчитываем ширину полоски таймера
    const percentWidth = checkpoint.time !== 0 ? (checkpoint.time / checkpoint.totalTime) * 100 : 100;

    const transition = `transition: background-color 500ms linear, width ${transitionDuration}ms linear`;
    const width = `width: ${percentWidth}%`;

    return transition + ';' + width;
});
</script>

<style scoped lang="scss" src="./checkpoint-ui-time.styles.scss" />
