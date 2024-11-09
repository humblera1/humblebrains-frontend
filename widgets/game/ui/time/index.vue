<template>
    <div class="game-time">
        <div class="game-time__info">
            <template v-if="!game.isGameTimeOver">
                <p class="game-time__title">Время:</p>
                <p class="game-time__time">{{ formattedTime }}</p>
            </template>
            <template v-else>
                <p class="game-time__title">{{ $t('lastRound') }}</p>
            </template>
        </div>
        <div class="game-time__container" :class="containerClass">
            <div class="game-time__line" :class="lineClass" :style="lineStyle" />
            <div
                v-for="reaction of game.incorrectAnswerReactions"
                :key="reaction.id"
                class="game-time__line game-time__line_invalid game-widget_invalid"
                :style="lineStyle"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
const game = useGameStore();

const containerClass = computed(() => {
    return game.showRoundTimeLine ? '' : 'game-time__container_hidden';
});

const formattedTime = computed((): string => {
    const minutes = Math.floor(game.totalTime / 60);
    const seconds = game.totalTime % 60;

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
});

const lineClass = computed((): string => {
    if (game.roundTime < game.totalRoundTime / 3) {
        return 'game-time__line_red';
    }

    if (game.roundTime < (game.totalRoundTime * 2) / 3) {
        return 'game-time__line_yellow';
    }

    return '';
});

const lineStyle = computed((): string => {
    // Используем разную скорость анимации в зависимости от того, идёт увеличение или уменьшение таймера
    const transitionDuration = game.roundTime < game.totalRoundTime ? 1000 : 100;

    // рассчитываем ширину полоски таймера
    const percentWidth = game.totalRoundTime !== 0 ? (game.roundTime / game.totalRoundTime) * 100 : 100;

    const transition = `transition: background-color 500ms linear, width ${transitionDuration}ms linear`;
    const width = `width: ${percentWidth}%`;

    return transition + ';' + width;
});
</script>

<style scoped lang="scss" src="./game-ui-time-styles.scss"></style>
