<template>
    <div class="variant" :draggable="numbers.isDraggableMode" @dragstart="onDragStart" @dragend="onDragEnd" @click="onClick">
        {{ number }}
    </div>
</template>

<script setup lang="ts">
import type { NumbersVariantProps } from '~/modules/checkpoint/widgets/memory/numbers/variant/numbers-variant.types';
import { useNumbersStore } from '~/modules/checkpoint/stores/memory/numbersStore';

const { index, number } = defineProps<NumbersVariantProps>();

const numbers = useNumbersStore();

const onDragStart = () => {
    numbers.handleVariantDragStart(index, number);
};

const onDragEnd = () => {
    numbers.handleVariantDragEnd();
};

const onClick = () => {
    numbers.handleClickOnVariant(index);
};
</script>

<style scoped lang="scss" src="./numbers-variant.styles.scss" />
