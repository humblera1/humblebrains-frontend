<template>
    <div class="field">
        <div class="field__field">
            <GameMatrixColor />
            <div class="field__grid" :style="fieldStyles">
                <GameMatrixCell v-for="key in matrix.cellsAmount" :key="key" :number="key" />
            </div>
        </div>
        <div class="field__controls">
            <UiButton :class="readyButtonClass" @click="matrix.switchToInteractive">{{ $t('remember') + '!' }}</UiButton>
        </div>
    </div>
</template>

<script setup lang="ts">
const game = useGameStore();
const matrix = useMatrixStore();

const maxCellSize = 120;

const fieldMaxWidth = computed((): number => {
    return matrix.squareSide * maxCellSize;
});

const fieldStyles = computed(() => {
    return {
        gridTemplateColumns: `repeat(${matrix.squareSide}, 1fr)`,
        maxWidth: `${fieldMaxWidth.value}px`,
        transform: `rotate(${matrix.rotationDegree}deg)`,
    };
});

const readyButtonClass = computed(() => {
    return ['field__button', game.isInContemplationState() ? 'field__button_visible' : ''];
});
</script>

<style scoped lang="scss" src="./matrix-field.styles.scss"></style>
