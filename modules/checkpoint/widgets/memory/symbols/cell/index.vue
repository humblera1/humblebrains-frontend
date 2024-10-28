<template>
    <div :class="cellClasses" @dragover.prevent @drop="onDrop" @dragenter="onDragEnter" @dragleave="onDragLeave" @click="onClick">
        <div :class="numberClasses">
            <div class="cell__icon" v-html="symbols.getRawSymbolContentByName(symbol)" />
        </div>
        <div ref="child" :class="answerClasses" :draggable="symbols.isDraggableMode" @dragstart="onDragStart" @dragend="onDragEnd">
            <div
                v-if="symbols.getAnsweredSymbol(index)"
                class="cell__icon"
                v-html="symbols.getRawSymbolContentByName(symbols.getAnsweredSymbol(index) as string)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { SymbolsCellProps } from '~/modules/checkpoint/widgets/memory/symbols/cell/symbols-cell.types';
import { useCheckpointStore } from '~/modules/checkpoint/stores/checkpointStore';
import { useSymbolsStore } from '~/modules/checkpoint/stores/memory/symbolsStore';

const { symbol, index } = defineProps<SymbolsCellProps>();

const symbols = useSymbolsStore();
const checkpoint = useCheckpointStore();

const isDragEntered = ref<boolean>(false);

const child = ref(null);

const onClick = () => {
    symbols.handleClickOnCell(index);
};

const cellClasses = computed(() => {
    return [
        'cell',
        {
            cell_entered: isDragEntered.value,
            cell_active: symbols.isCellActive(index),
        },
    ];
});

const numberClasses = computed(() => {
    return [
        'cell__symbol',
        {
            cell__symbol_visible: checkpoint.isLevelPreparingState() || checkpoint.isInContemplationState(),
        },
    ];
});

const answerClasses = computed(() => {
    return [
        'cell__answer',
        {
            cell__answer_visible: symbols.isCellAnswered(index),
        },
    ];
});

const onDragStart = () => {
    symbols.handleCellDragStart(index);
};

const onDragEnd = () => {
    symbols.handleCellDragEnd();
};

const onDrop = () => {
    isDragEntered.value = false;
    symbols.handleDropToCell(index);
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

<style scoped lang="scss" src="./symbols-cell.styles.scss" />
