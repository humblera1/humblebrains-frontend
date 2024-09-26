<template>
    <div class="game-timeline">
        <div class="game-timeline__container">
            <div class="game-timeline__line" :style="timelineStyle" />
        </div>
    </div>
</template>

<script setup lang="ts">
const gameStore = useGameStore();

const totalTime: number = gameStore.totalTime;

const timelineStyle = computed(() => {
    return `width: ${(gameStore.totalTime / totalTime) * 100}%`;
});
</script>

<style scoped lang="scss" src="./game-ui-timeline.styles.scss"></style>
