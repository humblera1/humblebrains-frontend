<template>
    <div class="statistics">
        <Transition name="load">
            <div v-if="isSuccess && data && data.xAsis" class="statistics__data">
                <div class="statistics__header">
                    <div class="statistics__info">
                        <p class="statistics__title">
                            {{ $t('progress') }}
                        </p>
                        <p class="statistics__subtitle">
                            <span>Период: </span>
                            <span class="statistics__period">{{ $t(selectedPeriod) }}</span>
                        </p>
                    </div>
                    <WidgetGameUiCalendar v-model="selectedPeriod" />
                </div>
                <div class="statistics__body">
                    <div ref="chart" class="statistics__chart" />
                </div>
            </div>
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
import { type EChartsType } from 'echarts';
import * as echarts from 'echarts';
import type { BaseResponse } from '~/entities/interfaces/responses/BaseResponse';
import type { IGameStatistics } from '~/entities/interfaces/games/IGameStatistics';
import { PeriodEnum } from '~/entities/enums/PeriodEnum';

const selectedPeriod = ref<PeriodEnum>(PeriodEnum.All);

const page = useGamePageStore();

const colorMode = useColorMode();

const { $api } = useNuxtApp();

const chart = ref<HTMLElement | null>(null);
let statsChart: EChartsType;

const { status, data } = await useLazyAsyncData(
    'game-statistics',
    async () => {
        const response = await $api<BaseResponse<IGameStatistics>>(`/v1/games/${page.game}/statistics`, {
            credentials: 'include',
            params: {
                period: selectedPeriod.value,
            },
        });

        return response.data;
    },
    {
        watch: [selectedPeriod],
    },
);

const isPending = computed((): boolean => status.value === 'pending');
const isSuccess = computed((): boolean => status.value === 'success');

const chartOptions = {
    grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    xAxis: {
        type: 'category',
        data: data?.value?.xAsis ?? [],
        boundaryGap: false,
        show: false,
        axisLabel: {
            show: false,
        },
        splitLine: {
            show: false,
        },
    },
    yAxis: {
        type: 'value',
        show: false,
        axisLabel: {
            show: false,
        },
        splitLine: {
            show: false,
        },
    },
    series: [
        {
            data: data?.value?.yAsis ?? [],
            boundaryGap: false,
            type: 'line',
            smooth: true,
            symbol: 'none',
            areaStyle: {
                opacity: 0.8,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                        offset: 0,
                        color: colorMode.value === 'dark' ? '#282f87' : '#4149a0',
                    },
                    {
                        offset: 1,
                        color: 'rgba(65, 73, 160, 0)',
                    },
                ]),
            },
        },
    ],
};

const initChart = () => {
    if (chart.value && chart.value.clientWidth) {
        // eslint-disable-next-line import/namespace
        statsChart = echarts.init(chart.value);
        statsChart.setOption(chartOptions);
    }
};

const handleResize = () => {
    if (statsChart && !statsChart.isDisposed()) {
        statsChart.resize();
    }
};

watch(colorMode, () => {
    if (statsChart && !statsChart.isDisposed()) {
        const color = colorMode.value === 'dark' ? '#282f87' : '#4149a0';

        chartOptions.series[0].areaStyle.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
                offset: 0,
                color,
            },
            {
                offset: 1,
                color: 'rgba(65, 73, 160, 0)',
            },
        ]);

        statsChart.setOption(chartOptions);
    }
});

watch(data, async () => {
    if (data) {
        await nextTick();
        initChart();
    }
});

onMounted(() => {
    window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    statsChart?.dispose();
});
</script>

<style scoped lang="scss" src="./game-preview-statistics.styles.scss" />
