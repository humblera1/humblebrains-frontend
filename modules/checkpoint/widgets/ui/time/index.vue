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
const totalTime = ref<number>(5);
const currentTime = ref<number>(3);

const formattedTime = computed((): string => {
    const minutes = Math.floor(totalTime.value / 60);
    const seconds = totalTime.value % 60;

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
});

const lineStyle = computed(() => {
    return `width: ${(currentTime.value / totalTime.value) * 100}%`;
});
</script>

<style scoped lang="scss" src="./checkpoint-ui-time.styles.scss" />
