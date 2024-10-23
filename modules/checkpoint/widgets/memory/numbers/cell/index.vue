<template>
    <div :class="cellClasses" @dragover.prevent @drop="onDrop" @dragenter="onDragEnter" @dragleave="onDragLeave" @click="onClick">
        <div :class="numberClasses">
            {{ number }}
        </div>
        <div ref="child" :class="answerClasses" :draggable="numbers.isDraggableMode" @dragstart="onDragStart" @dragend="onDragEnd">
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

const child = ref(null);

const onDragStart = () => {
    numbers.handleNumberDragStart(index);
};

const onDragEnd = () => {
    numbers.handleNumberDragEnd();
};

const onClick = () => {
    numbers.handleClickOnCell(index);
};

const cellClasses = computed(() => {
    return [
        'cell',
        {
            cell_entered: isDragEntered.value,
            cell_active: numbers.isCellActive(index),
        },
    ];
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

const onDragLeave = (event: DragEvent) => {
    if (child.value !== event.relatedTarget) {
        isDragEntered.value = false;
    }
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

    @include mobile {
        min-width: 46px;
        width: 46px;
        border-radius: 12px;

        font-size: 18px;
    }

    &_entered {
        border: 2px solid var(--primary-subtitle);
    }

    &_active {
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
        cursor: grab;
        position: absolute;
        z-index: 2;
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

        @include mobile {
            border-radius: 10px;
        }

        &_visible {
            width: 100%;
            height: 100%;
            visibility: visible;
            opacity: 1;
        }
    }
}
</style>
