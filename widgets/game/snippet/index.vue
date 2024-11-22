<template>
    <NuxtLink :to="link" class="snippet" :class="{ snippet_completed: game.isCompleted }">
        <div class="snippet__image">
            <NuxtImg :src="game.game.image" :alt="game.game.label" />
        </div>
        <IconCheckCircle v-if="game.isCompleted" class="snippet__check" />
    </NuxtLink>
</template>

<script setup lang="ts">
import type { GameSnippetProps } from '~/widgets/game/snippet/game-snippet.types';

const { game } = defineProps<GameSnippetProps>();

const localePath = useLocalePath();

const link = computed((): string => {
    return localePath(`/games/${game.game.name}`);
});
</script>

<style scoped lang="scss" src="./game-snippet.styles.scss" />
