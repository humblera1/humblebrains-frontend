<template>
    <div class="block" :class="`block_${type}`">
        <div class="block__icon">
            <component :is="icon" :key="type" />
        </div>
        <p class="block__title">
            {{ title + (type === 'reaction' ? $t('ms') : '') }}
        </p>
        <p class="block__subtitle">{{ $t(subtitle) }}</p>
    </div>
</template>

<script setup lang="ts">
import type { GameResultBlockProps } from '~/widgets/game/tab/result/block/game-result-block.types';
import { IconGameTarget, IconSpeed, IconGameStarOutline } from '#components';

const { type } = defineProps<GameResultBlockProps>();

const game = useGameStore();

const icon = computed((): Component => {
    switch (type) {
        case 'accuracy':
            return IconGameTarget;
        case 'reaction':
            return IconSpeed;
        case 'score':
            return IconGameStarOutline;
    }
});

const title = computed((): string => {
    if (!game.gameData.results) {
        return '';
    }

    switch (type) {
        case 'accuracy':
            return `${game.gameData.results.accuracy}%`;
        case 'reaction':
            return game.gameData.results.meanReactionTime;
        case 'score':
            return game.gameData.results.score.toString();
    }
});

const subtitle = computed((): string => {
    switch (type) {
        case 'accuracy':
            return 'yourAccuracy';
        case 'reaction':
            return 'yourReaction';
        case 'score':
            return 'yourScore';
    }
});
</script>

<style scoped lang="scss" src="./game-result-block.styles.scss" />
