<template>
    <div class="statistics">
        <div class="statistics__content">
            <template v-if="status === 'success'">
                <WidgetGameTabResultReaction :reaction="game.gameData.results.meanReactionTime" />
                <WidgetGameUiChart :data="accuracyData" :title="$t('accuracy')" theme="purple" />
                <WidgetGameUiChart :data="scoreData" :title="$t('scores')" />
            </template>
            <template v-else>
                loading...
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { BaseResponse } from '~/entities/interfaces/responses/BaseResponse';
import type { IGameStatistics } from '~/entities/interfaces/games/IGameStatistics';

// todo: reaction time from checkpoint

const { $api } = useNuxtApp();

const page = useGamePageStore();
const game = useGameStore();

const { status, data: statistics } = await useLazyAsyncData('statistics', async () => {
    const response = await $api<BaseResponse<IGameStatistics>>(`/v1/games/${page.game}/statistics`, {
        credentials: 'include',
    });

    return response.data;
});

const scoreData = computed(() => {
    return {
        xAsis: statistics.value?.games ?? [],
        yAsis: statistics.value?.scores ?? [],
    };
});

const accuracyData = computed(() => {
    return {
        xAsis: statistics.value?.games ?? [],
        yAsis: statistics.value?.accuracy ?? [],
    };
});
</script>

<style scoped lang="scss" src="./game-result-statistics.styles.scss" />
