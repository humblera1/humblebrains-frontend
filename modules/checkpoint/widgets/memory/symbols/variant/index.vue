<template>
    <div class="variant" :draggable="symbols.isDraggableMode" @dragstart="onDragStart" @dragend="onDragEnd" @click="onClick">
        <div class="variant__icon" v-html="symbols.getRawSymbolContentByName(symbol)" />
    </div>
</template>

<script setup lang="ts">
import { useSymbolsStore } from '~/modules/checkpoint/stores/memory/symbolsStore';
import type { SymbolsVariantProps } from '~/modules/checkpoint/widgets/memory/symbols/variant/symbols-cell.types';

const { index, symbol } = defineProps<SymbolsVariantProps>();

const symbols = useSymbolsStore();

const onDragStart = () => {
    symbols.handleVariantDragStart(index, symbol);
};

const onDragEnd = () => {
    symbols.handleVariantDragEnd();
};

const onClick = () => {
    symbols.handleClickOnVariant(index);
};
</script>

<style scoped lang="scss" src="./symbols-variant.styles.scss" />
