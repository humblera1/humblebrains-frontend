<template>
    <div class="field">
        <div class="field__grid" :style="fieldStyles">
            <WidgetGameMatrixCell v-for="key in cellsAmount" :key="key" :number="key" />
        </div>
        <br />
        <div class="field__controls">
            <UiButton :class="readyButtonClass" @click="store.setInteractiveState()">{{ $t('remember') + '!' }}</UiButton>
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
const store = useMatrixStore();

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

const readyButtonClass = computed(() => {
    return ['field__button', gameStore.isContemplationState() ? 'field__button_visible' : ''];
});
</script>

<style scoped lang="scss">
.field {
    display: flex;
    flex-direction: column;
    gap: 30px;
    align-items: center;
    width: 100%;
    height: 100%;

    &__grid {
        width: 100%;
        display: grid;
        gap: 1%;

        transition: transform 500ms ease;
    }

    &__button {
        opacity: 0;
        visibility: hidden;
        transition: opacity 250ms linear;

        &_visible {
            opacity: 1;
            visibility: visible;
        }
    }
}
</style>
