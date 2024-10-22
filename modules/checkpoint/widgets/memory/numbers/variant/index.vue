<template>
    <div class="variant" draggable="true" @dragstart="onDragStart" @dragend="onDragEnd">
        {{ number }}
    </div>
</template>

<script setup lang="ts">
import type { NumbersVariantProps } from '~/modules/checkpoint/widgets/memory/numbers/variant/numbers-variant.types';
import { useNumbersStore } from '~/modules/checkpoint/stores/memory/numbersStore';

const { index, number } = defineProps<NumbersVariantProps>();

const numbers = useNumbersStore();

const onDragStart = () => {
    numbers.handleDragStart(index, number);
};

const onDragEnd = () => {
    numbers.handleDragEnd();
};
</script>

<style scoped lang="scss">
.variant {
    cursor: grab;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 40px;
    width: 40px;
    aspect-ratio: 1;
    border-radius: 12px;
    background-color: var(--badge-bg);
    user-select: none;

    opacity: 1;
    transform: scale(1);

    @include mainFont(500, 16, var(--primary-subtitle));

    transition: all 200ms ease;

    &:hover {
        color: var(--primary-subtitle-hovered);
    }
}
</style>
