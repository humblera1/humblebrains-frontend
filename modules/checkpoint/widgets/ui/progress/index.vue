<template>
    <WidgetCheckpointUiBadge>
        <p class="checkpoint-progress__title">{{ $t('progress') }}:</p>
        <div class="checkpoint-progress__container">
            <div class="checkpoint-progress__line" :style="lineStyle" />
        </div>
    </WidgetCheckpointUiBadge>
</template>

<script setup lang="ts">
const totalLevels = ref<number>(5);
const currentLevel = ref<number>(3);

const lineStyle = computed(() => {
    return `width: ${(currentLevel.value / totalLevels.value) * 100}%`;
});
</script>

<style scoped lang="scss" src="./checkpoint-ui-progress.styles.scss" />
