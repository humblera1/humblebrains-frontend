<template>
    <NuxtLink :to="localePath(url)" class="card">
        <header class="card__header">
            <div class="card__image">
                <NuxtImg :src="imageSrc" :alt="game.label" />
            </div>
            <div class="card__info">
                <p class="card__title">
                    {{ game.label }}
                </p>
                <WidgetGameUiProgress :current="game.userLevel" :max="game.maxLevel" size="small" class="card__progress" />
            </div>
        </header>
        <div class="card__description">
            {{ game.description }}
        </div>
        <div class="card__tags">
            <WidgetGameUiTag v-for="tag in game.tags" :key="tag.id" :tag="tag" />
        </div>
        <div class="card__badge">
            <IconChevron />
        </div>
    </NuxtLink>
</template>

<script setup lang="ts">
import type { GameCardProps } from '~/widgets/game/card/game-card.types';

const { game } = defineProps<GameCardProps>();

const localePath = useLocalePath();

const imageSrc = computed((): string => {
    return game.image ?? '/images/games/default-game-image.png';
});

const url = computed((): string => {
    return `/games/${game.name}`;
});
</script>

<style scoped lang="scss" src="./game-card.styles.scss" />
