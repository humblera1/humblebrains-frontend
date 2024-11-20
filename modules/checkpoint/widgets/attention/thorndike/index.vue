<template>
    <div class="thorndike">
        <div class="thorndike__header">
            <WidgetCheckpointAttentionThorndikeItem v-for="number in thorndike.numbersToFind" :key="number" :number="number" with-badge />
        </div>
        <div class="thorndike__field">
            <WidgetCheckpointAttentionThorndikeItem v-for="number in thorndike.numbers" :key="number" :number="number" />
        </div>
        <div class="thorndike__control" :class="controlsClass">
            <UiButton @click="thorndike.finishLevel"> Продолжить </UiButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useThorndikeStore } from '~/modules/checkpoint/stores/attention/thorndikeStore';
import { useCheckpointStore } from '~/modules/checkpoint/stores/checkpointStore';

const thorndike = useThorndikeStore();
const checkpoint = useCheckpointStore();

const controlsClass = computed((): string => {
    return checkpoint.isInInteractiveState() ? 'thorndike__control_visible' : '';
});

onMounted(() => {
    thorndike.$setup();
});

onUnmounted(() => {
    thorndike.$reset();
});
</script>

<style scoped lang="scss" src="./thorndike.styles.scss" />
