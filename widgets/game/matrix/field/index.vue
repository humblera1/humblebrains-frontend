<template>
    <div class="field">
        <div class="field__grid" :style="fieldStyles">
            <WidgetGameMatrixCell v-for="key in cellsAmount" :key="key" :number="key" @select="handleSelection(key)" />
        </div>
        <br />
        <div class="field__controls">
            <UiButton @click="store.setMatrixStore">ready to remember</UiButton>
            <br />
            <UiButton @click="store.setInteractiveState()">ready to play</UiButton>
            <br />
            <div :style="'width:100px;height:100px;background-color:' + store.activeRoundColor" />
            <br />
            {{ gameStore.gameState }}
            <br />
            {{ store.openedCells }}
        </div>
    </div>
</template>

<script setup lang="ts">
// Будет передаваться из стора, количество ячеек на поле

const cellsAmount = computed(() => {
    if (store.currentLevel) {
        return store.currentLevel.squareSide ** 2;
    }

    return 0;
});

const gameStore = useGameStore();

const maxCellSize = 120;

// const cellsAmount = ref<number>(9);

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
        transform: `rotate(${store.rotationDegree}deg)`,
    };
});

const handleSelection = (cell: number) => {
    console.log('Выбрана ячейка под номером ' + cell);
};

const store = useMatrixStore();
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

        transition: transform 500ms ease;
    }
}
</style>
