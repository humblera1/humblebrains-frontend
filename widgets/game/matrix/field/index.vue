<template>
    <div class="field">
        <div class="field__grid" :style="fieldStyles">
            <WidgetGameMatrixCell v-for="key in cellsAmount" :key="key" :number="key" @select="handleSelection(key)" />
        </div>
        <br>
        <div class="field__controls">
            <UiButton @click="setMatrixStore">ready to remember</UiButton>
            <br>
            <UiButton @click="gameStore.setInteractiveState()">ready to play</UiButton>
        </div>
    </div>
</template>

<script setup lang="ts">
// Будет передаваться из стора, количество ячеек на поле

const gameStore = useGameStore();

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


const { setMatrixStore } = useMatrixStore();
// const { setMatrixStore } = useMatrixStore();
//

</script>

<style scoped lang="scss">
.field {
    // todo: убрать после переноса кнопок в controls
    width: 100%;
    height: 100%;

    &__grid {
        width: 100%;
        height: 100%;
        display: grid;
        gap: 1%;
    }
}
</style>
