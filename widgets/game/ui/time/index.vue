<template>
    <div class="game-time">
        <div class="game-time__info">
            <p class="game-time__title">Время:</p>
            <p class="game-time__time">{{ formattedTime }}</p>
        </div>
        <div class="game-time__container" :class="containerClass">
            <div class="game-time__line" :class="lineClass" :style="lineStyle" />
        </div>
    </div>
</template>

<script setup lang="ts">
const gameStore = useGameStore();

const containerClass = computed(() => {
    return gameStore.showRoundTimeLine ? '' : 'game-time__container_hidden';
});

const formattedTime = computed((): string => {
    const minutes = Math.floor(gameStore.totalTime / 60);
    const seconds = gameStore.totalTime % 60;

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
});

const lineClass = computed((): string => {
    if (gameStore.roundTime < gameStore.totalRoundTime / 3) {
        return 'game-time__line_red';
    }

    if (gameStore.roundTime < (gameStore.totalRoundTime * 2) / 3) {
        return 'game-time__line_yellow';
    }

    return 'game-time__line_green';
});

const lineStyle = computed((): string => {
    // Используем разную скорость анимации в зависимости от того, идёт увеличение или уменьшение таймера
    const transitionDuration = gameStore.roundTime < gameStore.totalRoundTime ? 1000 : 100;

    // рассчитываем ширину полоски таймера
    const percentWidth = gameStore.totalRoundTime !== 0 ? (gameStore.roundTime / gameStore.totalRoundTime) * 100 : 100;

    const transition = `transition: background-color 500ms linear, width ${transitionDuration}ms linear`;
    const width = `width: ${percentWidth}%`;

    return transition + ';' + width;
});
</script>

<style scoped lang="scss" src="./game-ui-time-styles.scss"></style>
