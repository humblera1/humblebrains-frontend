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
    numbers.handleDragStart(index, number);
};

const onDragEnd = () => {
    numbers.handleDragEnd();
};

const onClick = () => {
    numbers.handleClickOnVariant(index);
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
    //mix-blend-mode: multiply;
    isolation: revert;

    opacity: 1;
    transform: scale(1);

    @include mainFont(500, 16, var(--primary-subtitle));

    transition: all 200ms ease;

    &:hover {
        color: var(--primary-subtitle-hovered);
    }

    @include tablet {
        @include boxShadow(-10, 10, 30, 0, var(--main-shadow));
    }

    @include mobile {
        min-width: 36px;
        width: 36px;
        border-radius: 8px;
        font-size: 14px;

        @include mainShadowMobile();
    }
}
</style>
