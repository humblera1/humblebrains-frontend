<template>
    <div class="statistics">
        <div class="statistics__content">
            <template v-if="status === 'success'">
                <WidgetGameTabResultBlock type="reaction" />
                <template v-if="isEnoughData">
                    <WidgetGameUiChart :data="accuracyData" :title="$t('accuracy')" theme="purple" class="statistics__chart" />
                    <WidgetGameUiChart :data="scoreData" :title="$t('scores')" class="statistics__chart" />
                </template>
                <template v-else>
                    <WidgetGameTabResultBlock type="accuracy" />
                    <WidgetGameTabResultBlock type="score" />
                </template>
            </template>
            <UiPreloader v-else />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { BaseResponse } from '~/entities/interfaces/responses/BaseResponse';
import type { IGameStatistics } from '~/entities/interfaces/games/IGameStatistics';

const { $api } = useNuxtApp();

const page = useGamePageStore();

const { status, data: statistics } = await useLazyAsyncData('statistics', async () => {
    const response = await $api<BaseResponse<IGameStatistics>>(`/v1/games/${page.game}/statistics`, {
        credentials: 'include',
    });

    return response.data;
});

const isEnoughData = computed((): boolean => {
    if (statistics.value && statistics.value.games) {
        return statistics.value.games.length > 1;
    }

    return false;
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
