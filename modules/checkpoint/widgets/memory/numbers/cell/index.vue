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
            cell__number_visible: checkpoint.isLevelPreparingState() || checkpoint.isInContemplationState(),
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

const onDragStart = () => {
    numbers.handleNumberDragStart(index);
};

const onDragEnd = () => {
    numbers.handleNumberDragEnd();
};

const onDrop = () => {
    isDragEntered.value = false;
    numbers.handleVariantDrop(index);
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

<style scoped lang="scss" src="./numbers-cell.styles.scss" />
