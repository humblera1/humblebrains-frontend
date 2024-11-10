<template>
    <div ref="slider" class="slider" @mousedown="startDrag" @mouseup="stopDrag" @mouseleave="stopDrag">
        <div class="slider__track" />
        <div class="slider__line" :style="{ width: thumbPosition + '%' }" />
        <div class="slider__thumb" :style="{ left: thumbPosition + '%' }" @mousedown.stop.prevent="startDrag" />
        <div v-if="showLockIcon" class="slider__icon" :style="{ left: lockPosition + '%' }">
            <IconLockClosed />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { GameUiSliderTypes } from '~/widgets/game/ui/slider/game-ui-slider.types';

const { min, max, maxAvailable } = defineProps<GameUiSliderTypes>();

const slider = ref<HTMLDivElement | null>(null);

const current = defineModel<number>();

const minValue = ref(min);
const maxValue = ref(max);
const maxAvailableValue = ref(maxAvailable);

const isDragging = ref(false);

const thumbPosition = computed(() => {
    if (current.value) {
        return ((current.value - minValue.value) / (maxValue.value - minValue.value)) * 100;
    }

    return 0;
});

const lockPosition = computed(() => {
    return ((maxAvailableValue.value - minValue.value) / (maxValue.value - minValue.value)) * 100;
});

const showLockIcon = computed(() => {
    return maxAvailableValue.value < maxValue.value;
});

const updateValueFromPosition = (position: number) => {
    const range = maxValue.value - minValue.value;
    const newValue = Math.round(minValue.value + (position / 100) * range);
    current.value = Math.min(newValue, maxAvailableValue.value);
};

const startDrag = (event: MouseEvent) => {
    isDragging.value = true;
    updateValueFromPosition(getPositionFromEvent(event));

    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', stopDrag);
};

const stopDrag = () => {
    isDragging.value = false;

    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('mouseup', stopDrag);
};

const onDrag = (event: MouseEvent) => {
    if (isDragging.value) {
        updateValueFromPosition(getPositionFromEvent(event));
    }
};

const getPositionFromEvent = (event: MouseEvent): number => {
    if (slider.value) {
        const rect = slider.value.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const position = (offsetX / rect.width) * 100;

        return Math.max(0, Math.min(position, 100));
    }

    return 0;
};

onMounted(() => {
    window.addEventListener('mouseup', stopDrag);
});

onUnmounted(() => {
    window.removeEventListener('mouseup', stopDrag);
});
</script>

<style scoped lang="scss" src="./game-ui-slider.styles.scss" />
