<template>
    <div class="game-level">
        <div class="game-level__info">
            <p class="game-level__title">Уровень:</p>
            <p class="game-level__level">{{ level }}</p>
        </div>
        <div v-if="isProgressBarSeparated" class="game-level__progress game-level__progress_separated">
            <div v-for="idx in correctAnswersBeforePromotion" :key="idx" class="game-level__bar" :class="getBarClass(idx)" />
        </div>
        <div v-else class="game-level__progress game-level__progress_solid">
            <div class="game-level__bars" :style="barsStyle" />
        </div>
    </div>
</template>

<script setup lang="ts">
const MAX_SEPARATE_BARS_AMOUNT = 5;

const maxLevel = ref<number>(45);
const currentLevel = ref<number>(2);

const correctAnswersBeforePromotion = ref<number>(25);
const successfulRoundsStreak = ref<number>(2);

const level = computed((): string => {
    return `${currentLevel.value}/${maxLevel.value}`;
});

const getBarClass = (barIndex: number) => {
    return barIndex <= successfulRoundsStreak.value ? 'game-level__bar_active' : '';
};

const barsStyle = computed(() => {
    return `width: ${(successfulRoundsStreak.value / correctAnswersBeforePromotion.value) * 100}%`;
});

const isProgressBarSeparated = computed((): boolean => {
    return correctAnswersBeforePromotion.value <= MAX_SEPARATE_BARS_AMOUNT;
});
</script>

<style scoped lang="scss" src="./game-ui-level.styles.scss"></style>
