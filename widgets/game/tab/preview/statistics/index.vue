<template>
    <div class="statistics">
        <Transition name="load">
            <WidgetGameUiChart v-if="showComponent" v-model="selectedPeriod" :title="$t('progress')" :data="chartData" with-filter />
            <div v-else class="statistics__absence">
                <template v-if="isPending">
                    <UiPreloader />
                </template>
                <template v-else>
                    <div class="statistics__icon">
                        <IconGameChart />
                    </div>
                    <p class="statistics__message">
                        {{ $t('thereWillBeStatistics') }}
                    </p>
                </template>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import type { BaseResponse } from '~/entities/interfaces/responses/BaseResponse';
import type { IGameStatistics } from '~/entities/interfaces/games/IGameStatistics';
import { PeriodEnum } from '~/entities/enums/PeriodEnum';

const selectedPeriod = ref<PeriodEnum>(PeriodEnum.All);

const page = useGamePageStore();

const { $api } = useNuxtApp();

const isFiltered = ref<boolean>(false);

const isEnoughData = computed((): boolean => {
    if (statistics.value) {
        return statistics.value.games.length > 1;
    }

    return false;
});

const showComponent = computed((): boolean => {
    return isSuccess.value && (isEnoughData.value || isFiltered.value);
});

const {
    status,
    data: statistics,
    refresh,
} = await useLazyAsyncData(
    'game-statistics',
    async () => {
        const response = await $api<BaseResponse<IGameStatistics>>(`/v1/games/${page.game}/statistics`, {
            credentials: 'include',
            params: {
                type: 'score',
                period: selectedPeriod.value,
            },
        });

        return response.data;
    },
    {
        watch: [selectedPeriod],
    },
);

const chartData = computed(() => {
    return {
        xAsis: statistics.value?.games ?? [],
        yAsis: statistics.value?.scores ?? [],
    };
});

const isSuccess = computed((): boolean => status.value === 'success');
const isPending = computed((): boolean => status.value === 'pending');

watch(selectedPeriod, () => {
    isFiltered.value = true;
    refresh();
});
</script>

<style scoped lang="scss" src="./game-preview-statistics.styles.scss" />
