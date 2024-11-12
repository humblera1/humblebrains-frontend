<template>
    <div class="game-time">
        <div class="game-time__info">
            <template v-if="!game.isGameTimeOver">
                <p class="game-time__title">Время:</p>
                <div class="game-time__box">
                    <Transition name="slide-fade" mode="out-in">
                        <IconInfinity v-if="game.isInInfiniteRegime()" class="game-time__infinity" />
                        <p v-else class="game-time__time">{{ formattedTime }}</p>
                    </Transition>
                </div>
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
    const minutes = Math.floor(game.totalTimeLeft / 60);
    const seconds = game.totalTimeLeft % 60;

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
});

const lineClass = computed((): string => {
    if (game.roundTimeLeft < game.roundTime / 3) {
        return 'game-time__line_red';
    }

    if (game.roundTimeLeft < (game.roundTime * 2) / 3) {
        return 'game-time__line_yellow';
    }

    return '';
});

const lineStyle = computed((): string => {
    // Используем разную скорость анимации в зависимости от того, идёт увеличение или уменьшение таймера
    const transitionDuration = game.roundTimeLeft < game.roundTime ? 1000 : 100;

    // рассчитываем ширину полоски таймера
    const percentWidth = game.roundTime !== 0 ? (game.roundTimeLeft / game.roundTime) * 100 : 100;

    const transition = `transition: background-color 500ms linear, width ${transitionDuration}ms linear`;
    const width = `width: ${percentWidth}%`;

    return transition + ';' + width;
});
</script>

<style scoped lang="scss" src="./game-ui-time-styles.scss"></style>
