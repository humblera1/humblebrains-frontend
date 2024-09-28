<template>
    <div class="field">
        <div class="field__grid" :style="fieldStyles">
            <GameMatrixCell v-for="key in store.cellsAmount" :key="key" :number="key" />
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

<style scoped lang="scss" src="./matrix-field.styles.scss"></style>
