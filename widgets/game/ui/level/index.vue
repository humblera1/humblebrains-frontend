<template>
    <div class="game-level">
        <div class="game-level__info">
            <p class="game-level__title">Уровень:</p>
            <p class="game-level__level">{{ level }}</p>
        </div>
        <div class="game-level__container">
            <template v-if="isProgressBarSeparated">
                <div class="game-level__progress game-level__progress_separated">
                    <div v-for="idx in correctAnswersBeforePromotion" :key="idx" class="game-level__bar" :class="getBarClass(idx)" />
                </div>
                <div
                    v-for="reaction of game.incorrectAnswerReactions"
                    :key="reaction.id"
                    class="game-level__progress game-level__progress_separated"
                >
                    <div
                        v-for="idx in correctAnswersBeforePromotion"
                        :key="idx"
                        class="game-level__bar game-level__bar_invalid"
                        :class="getInvalidBarClass(idx)"
                    />
                </div>
            </template>
            <template v-else>
                <div class="game-level__progress game-level__progress_solid">
                    <div class="game-level__bars" :style="barsStyle" />
                    <div
                        v-for="reaction of game.incorrectAnswerReactions"
                        :key="reaction.id"
                        class="game-level__bars game-level__bars_invalid game-widget_invalid"
                        :style="barsStyle"
                    />
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
const MAX_SEPARATE_BARS_AMOUNT = 5;

const game = useGameStore();

const correctAnswersBeforePromotion = ref<number>(6);
const successfulRoundsStreak = ref<number>(3);

const level = computed((): string => {
    return `${game.currentUserLevel}/${game.maxLevelNumber}`;
});

const isBarActive = (barIndex: number): boolean => {
    return barIndex <= successfulRoundsStreak.value;
};

const getBarClass = (barIndex: number) => {
    return isBarActive(barIndex) ? 'game-level__bar_active' : '';
};

const getInvalidBarClass = (barIndex: number) => {
    return isBarActive(barIndex) ? 'game-widget_invalid' : '';
};

const barsStyle = computed(() => {
    return `width: ${(successfulRoundsStreak.value / correctAnswersBeforePromotion.value) * 100}%`;
});

const isProgressBarSeparated = computed((): boolean => {
    return correctAnswersBeforePromotion.value <= MAX_SEPARATE_BARS_AMOUNT;
});
</script>

<style scoped lang="scss" src="./game-ui-level.styles.scss"></style>
