<template>
    <div class="field">
        <div class="field__grid" :style="fieldStyles">
            <WidgetGameMatrixCell v-for="key in store.cellsAmount" :key="key" :number="key" />
        </div>
        <br />
        <div class="field__controls">
            <UiButton :class="readyButtonClass" @click="store.ready()">{{ $t('remember') + '!' }}</UiButton>
        </div>
    </div>
</template>

<script setup lang="ts">
// Будет передаваться из стора, количество ячеек на поле

const gameStore = useGameStore();
const store = useMatrixStore();

const maxCellSize = 120;

// const cellsAmount = ref<number>(9);

const fieldMaxWidth = computed((): number => {
    return store.squareSide * maxCellSize;
});

const fieldStyles = computed(() => {
    return {
        gridTemplateColumns: `repeat(${store.squareSide}, 1fr)`,
        maxWidth: `${fieldMaxWidth.value}px`,
        transform: `rotate(${store.rotationDegree}deg)`,
    };
});

const readyButtonClass = computed(() => {
    return ['field__button', gameStore.isInContemplationState() ? 'field__button_visible' : ''];
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
