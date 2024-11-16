<template>
    <div class="color" :class="colorClass" :style="colorStyles">
        <div class="color__front" />
        <div class="color__back" :style="backStyles" />
    </div>
</template>

<script setup lang="ts">
const game = useGameStore();
const matrix = useMatrixStore();

const colorClass = computed(() => {
    return {
        color_visible: matrix.hasManyColors,
        color_flipped: game.isInInteractiveState(),
    };
});

const colorStyles = computed((): string => {
    return game.isInInteractiveState() ? `color: ${matrix.activeRoundColor}` : 'transparent';
});

const backStyles = computed((): string => {
    return game.isInInteractiveState() ? `background-color: ${matrix.activeRoundColor}` : 'transparent';
});
</script>

<style scoped lang="scss" src="./matrix-color.scss" />
