<template>
    <div class="cell" :class="cellClasses" @dragover.prevent @drop="onDrop" @dragenter="onDragEnter" @dragleave="onDragLeave">
        <div :class="numberClasses">
            {{ number }}
        </div>
        <div :class="answerClasses">
            {{ numbers.getAnsweredNumber(index) }}
        </div>
    </div>
</template>

<script setup lang="ts">
import type { NumbersCellProps } from '~/modules/checkpoint/widgets/memory/numbers/cell/numbers-cell.types';
import { useNumbersStore } from '~/modules/checkpoint/stores/memory/numbersStore';
import { useCheckpointStore } from '~/modules/checkpoint/stores/checkpointStore';

const { number, index } = defineProps<NumbersCellProps>();

const numbers = useNumbersStore();
const checkpoint = useCheckpointStore();

const isDragEntered = ref<boolean>(false);

const cellClasses = computed(() => {
    return {
        'cell_drag-entered': isDragEntered.value,
    };
});

const numberClasses = computed(() => {
    return [
        'cell__number',
        {
            cell__number_visible: checkpoint.isInContemplationState(),
        },
    ];
});

const answerClasses = computed(() => {
    return [
        'cell__answer',
        {
            cell__answer_visible: numbers.isCellAnswered(index),
        },
    ];
});

const onDrop = () => {
    isDragEntered.value = false;
    numbers.handleDrop(index);
};

const onDragEnter = () => {
    isDragEntered.value = true;
};

const onDragLeave = () => {
    isDragEntered.value = false;
};
</script>

<style scoped lang="scss">
.cell {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 60px;
    width: 60px;
    aspect-ratio: 1;
    border-radius: 16px;
    background-color: var(--matrix-cell);
    border: 2px solid transparent;

    transition: all 250ms ease;

    @include mainFont(500, 20, var(--primary-subtitle));

    &_drag-entered {
        border: 2px solid var(--primary-subtitle);
    }

    &__number {
        position: absolute;
        z-index: 1;
        opacity: 0;
        visibility: hidden;
        transition: all 250ms ease;

        &_visible {
            opacity: 1;
            visibility: visible;
        }
    }

    &__answer {
        position: absolute;
        z-index: 2;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 0;
        height: 0;
        background-color: var(--badge-bg);
        border-radius: 14px;
        visibility: hidden;
        opacity: 0;
        transition: all 250ms ease;
        //border: 2px solid transparent;

        &_visible {
            width: 100%;
            height: 100%;
            visibility: visible;
            opacity: 1;
        }
    }
}
</style>
