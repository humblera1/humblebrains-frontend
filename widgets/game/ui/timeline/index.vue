<template>
    <div class="game-timeline" :class="{ 'game-timeline_hidden': game.isInInfiniteRegime() }">
        <div class="game-timeline__container">
            <div class="game-timeline__line" :style="timelineStyle" />
            <div
                v-for="reaction of game.incorrectAnswerReactions"
                :key="reaction.id"
                class="game-timeline__line game-timeline__line_invalid game-widget_invalid"
                :style="timelineStyle"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
const game = useGameStore();

const totalTime: number = game.totalTime;

const timelineStyle = computed(() => {
    return `width: ${(game.totalTime / totalTime) * 100}%`;
});
</script>

<style scoped lang="scss" src="./game-ui-timeline.styles.scss"></style>
