<template>
    <div class="points">
        <div class="points__field" :style="fieldStyles">
            <WidgetCheckpointAttentionPointsCell v-for="key in store.getCellsAmount()" :key="key" :number="key" />
        </div>
        <div class="points__control" :class="controlsClass">
            <UiButton @click="store.finishRound"> Продолжить </UiButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { usePointsStore } from '~/modules/checkpoint/stores/attention/piontsStore';
import { useCheckpointStore } from '~/modules/checkpoint/stores/checkpointStore';

const store = usePointsStore();
const checkpoint = useCheckpointStore();

const squareSide = computed((): number => {
    return Math.floor(Math.sqrt(store.getCellsAmount()));
});

const fieldStyles = computed(() => {
    return {
        gridTemplateColumns: `repeat(${squareSide.value}, 1fr)`,
    };
});

const controlsClass = computed((): string => {
    return checkpoint.isInInteractiveState() && !store.isCellsHidden ? 'points__control_visible' : '';
});

onMounted(() => {
    store.setupStore();
});

onUnmounted(() => {
    store.$reset();
});
</script>

<style scoped lang="scss" src="./points.styles.scss" />
