<template>
    <div class="field" :style="fieldStyles">
        <WidgetGameMatrixCell v-for="key in cellsAmount" :key="key" :number="key" @select="handleSelection(key)" />
    </div>
</template>

<script setup lang="ts">
// Будет передаваться из стора, количество ячеек на поле

const maxCellSize = 120;

const cellsAmount = ref<number>(9);

const squareSide = computed((): number => {
    return Math.sqrt(cellsAmount.value);
});

const fieldMaxWidth = computed((): number => {
    return squareSide.value * maxCellSize;
});

const fieldStyles = computed(() => {
    return {
        gridTemplateColumns: `repeat(${squareSide.value}, 1fr)`,
        maxWidth: `${fieldMaxWidth.value}px`,
    };
});

const handleSelection = (cell: number) => {
    console.log('Выбрана ячейка под номером ' + cell);
};
</script>

<style scoped lang="scss">
.field {
    width: 100%;
    height: 100%;
    display: grid;
    gap: 1%;
}
</style>
