<template>
    <div class="statistics">
        <div class="statistics__content">
            <template v-if="status === 'success'">
                <WidgetGameTabResultReaction :reaction="123.45" />
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

const { $api } = useNuxtApp();

const page = useGamePageStore();

const { status, data: statistics } = await useLazyAsyncData('total-achievements', async () => {
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

<style scoped lang="scss">
.statistics {
    &__content {
        display: flex;
        justify-content: center;
        flex-direction: row-reverse;
        flex-wrap: wrap;
        gap: 16px;
    }
}
</style>
