<template>
    <div class="reaction">
        <div class="reaction__icon">
            <IconSpeed />
        </div>
        <p class="reaction__title">
            {{ reaction + ' ' + $t('ms') }}
        </p>
        <p class="reaction__subtitle">{{ $t('meanReactionTime') }}</p>
    </div>
</template>

<script setup lang="ts">
import type { GameResultReactionProps } from '~/widgets/game/tab/result/reaction/game-result-reaction.types';

defineProps<GameResultReactionProps>();
</script>

<style scoped lang="scss" src="./game-result-reaction.styles.scss" />
