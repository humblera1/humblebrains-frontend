<template>
    <div class="row">
        <WidgetGameSnippet v-for="(game, idx) in games" :key="idx" :game="game" :style="{ zIndex: games.length - idx }" />
    </div>
</template>

<script setup lang="ts">
import type { GameRowProps } from '~/widgets/game/row/game-row.types';

defineProps<GameRowProps>();
</script>

<style scoped lang="scss">
.row {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
}
</style>