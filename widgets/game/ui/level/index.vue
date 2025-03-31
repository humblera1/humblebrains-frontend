<template>
    <div class="game-level">
        <div class="game-level__info">
            <p class="game-level__title">{{ $t(formattedTitle) }}:</p>
            <p class="game-level__level">{{ formattedProgress }}</p>
        </div>
        <div class="game-level__container">
            <div class="game-level__progress">
                <div
                    :class="['game-level__line', 'game-level__line_success', { 'game-level__line_fade': isFaded }]"
                    :style="successLineStyles"
                />
                <div
                    :class="['game-level__line', 'game-level__line_fail', { 'game-level__line_fade': isFaded }]"
                    :style="failedLineStyles"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { debounce } from 'lodash-es';
import type { IBaseGameLevel } from '~/entities/interfaces/games/IBaseGameLevel';

const game = useGameStore();

const level = ref<IBaseGameLevel>();
const isFirstLevel = ref<boolean>(false);
const isFinalLevel = ref<boolean>(false);

const isFaded = ref(false);

const isFailedStreakRunning = computed(() => {
    return game.failedRoundsStreak > 0;
});

const roundsToPromoteLevel = computed((): number => {
    return level.value ? level.value.successfulRoundsBeforePromotion : 1;
});

const roundsToDemoteLevel = computed((): number => {
    return level.value ? level.value.failedRoundsBeforeDemotion : 1;
});

const computedIsFaded = computed((): boolean => {
    if (game.isInWarmUpMode()) {
        return game.playedWarmUpLevelsAmount === game.warmUpLevelsAmount;
    }

    if (isFailedStreakRunning.value) {
        if (isFirstLevel.value) {
            return false;
        }

        return game.failedRoundsStreak === roundsToDemoteLevel.value;
    } else {
        if (isFinalLevel.value) {
            return false;
        }

        return game.successfulRoundsStreak === roundsToPromoteLevel.value;
    }
});

const successLineStyles = computed(() => {
    if (game.isInWarmUpMode()) {
        return `width: ${(game.playedWarmUpLevelsAmount / game.warmUpLevelsAmount) * 100}%`;
    }

    return `width: ${(game.successfulRoundsStreak / roundsToPromoteLevel.value) * 100}%`;
});

const failedLineStyles = computed(() => {
    return `width: ${(game.failedRoundsStreak / roundsToDemoteLevel.value) * 100}%`;
});

const formattedTitle = computed((): string => {
    return game.isInWarmUpMode() ? 'warmUp' : 'level';
});

const formattedProgress = computed((): string => {
    if (game.isInWarmUpMode()) {
        return `${game.playedWarmUpLevelsAmount}/${game.warmUpLevelsAmount}`;
    }

    return `${game.currentUserLevel}/${game.maxLevelNumber}`;
});

watch(
    computedIsFaded,
    debounce((newValue) => {
        isFaded.value = newValue;
    }, 500),
);

watch(
    () => game.state,
    () => {
        if (game.isInLevelPreparingState()) {
            level.value = game.currentLevel;
            isFirstLevel.value = game.isFirstLevel;
            isFinalLevel.value = game.isFinalLevel;
        }
    },
);
</script>

<style scoped lang="scss" src="./game-ui-level.styles.scss"></style>
