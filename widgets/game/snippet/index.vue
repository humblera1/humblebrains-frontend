<template>
    <NuxtLink :to="link" class="snippet" :class="{ snippet_completed: game.isCompleted }">
        {{ game.game.label }}
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

<style scoped lang="scss">
.snippet {
    cursor: pointer;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 115px;
    aspect-ratio: 1;
    border-radius: 36px;
    background-color: var(--badge-bg);
    overflow: hidden;

    @include mainShadow();

    &_completed {
        opacity: 0.75;
    }
}
</style>
