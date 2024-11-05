<template>
    <div class="statistics">
        <div v-if="isSuccess && data && data.xAsis" class="statistics__data">
            <div class="statistics__header">
                <div class="statistics__info">
                    <p class="statistics__title">{{ $t('progress') }}</p>
                    <p class="statistics__subtitle">
                        <span>Период: </span>
                        <span class="statistics__period">Все время</span>
                    </p>
                </div>
                <div class="statistics__filter">
                    <IconCalendar />
                </div>
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
    </div>
</template>

<script setup lang="ts">
import { type EChartsType } from 'echarts';
import * as echarts from 'echarts';
import type { BaseResponse } from '~/entities/interfaces/responses/BaseResponse';
import type { IGameStatistics } from '~/entities/interfaces/games/IGameStatistics';

const page = useGamePageStore();

const { $api } = useNuxtApp();

const chart = ref<HTMLElement | null>(null);
let statsChart: EChartsType;

const { status, data } = await useLazyAsyncData('game-statistics', async () => {
    const response = await $api<BaseResponse<IGameStatistics>>(`/v1/games/${page.game}/statistics?XDEBUG_SESSION=XDEBUG_ECLIPSE`);

    return response.data;
});

const isPending = computed((): boolean => status.value === 'pending');
const isSuccess = computed((): boolean => status.value === 'success');

const chartOptions = {
    grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        // containLabel: true,
    },
    xAxis: {
        type: 'value',
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
                        color: '#4149a0',
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

watch(data, async () => {
    if (data) {
        await nextTick();
        initChart();
    }
});

onMounted(() => {
    window.addEventListener('resize', () => {
        if (statsChart) {
            statsChart.resize();
        }
    });
});

onUnmounted(() => {
    statsChart?.dispose();
});
</script>

<style scoped lang="scss">
.statistics {
    width: 100%;
    height: 300px;
    //border-radius: 36px;

    &__data,
    &__absence {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 32px;
        height: 100%;
        border-radius: 36px;

        @include mobile {
            border-radius: 24px;
        }
    }

    &__data {
        display: flex;
        flex-direction: column;
        gap: 36px;
        overflow: hidden;
        padding-top: 48px;
        padding-bottom: 32px;
        background-color: var(--badge-bg);

        @include mainShadow();
    }

    &__absence {
        border: 1px solid var(--border-primary);

        @include mobile {
            gap: 24px;
        }
    }

    &__header {
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding: 0 64px 0 36px;
    }

    &__info {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    &__period {
        text-decoration: underline;
    }

    &__filter {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 35px;
        height: 35px;
        border-radius: 8px;

        background-color: var(--blue-badge);

        svg {
            color: var(--blue);
            width: 14px;
            height: 16px;
        }
    }

    &__body {
        position: relative;
        width: 100%;
        height: 100%;
    }

    &__chart {
        width: 100%;
        height: 100%;
        padding: 0 24px;
    }

    &__icon {
        width: 70px;
        height: 70px;
        color: var(--gray-absence);

        @include mobile {
            width: 60px;
            height: 60px;
        }

        svg {
            object-fit: contain;
            width: 100%;
            height: 100%;
        }
    }

    &__message {
        text-align: center;
        margin-bottom: 36px;

        @include mainFont(400, 16, var(--primary-subtitle));

        @include mobile {
            font-size: 14px;
        }
    }
}
</style>
