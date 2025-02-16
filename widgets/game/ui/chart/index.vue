<template>
    <div class="chart">
        <div class="chart__header">
            <div class="chart__info">
                <p class="chart__title">
                    {{ title }}
                </p>
                <p class="chart__subtitle">
                    <template v-if="withFilter">
                        <span>{{ $t('period') }}: </span>
                        <span class="chart__period">{{ $t(selectedPeriod) }}</span>
                    </template>
                    <template v-else>
                        <span>{{ $t('gamesAmount') + ': ' + data.xAsis.length }}</span>
                    </template>
                </p>
            </div>
            <WidgetGameUiCalendar v-if="withFilter" v-model="selectedPeriod" />
        </div>
        <div class="chart__body">
            <div v-if="isEnoughData" ref="chart" class="chart__chart" />
            <div v-else class="chart__placeholder">
                <IconSearch />
                <span>
                    {{ $t('notEnoughDataForSelectedPeriod') }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import type { EChartsType } from 'echarts';
import type { GameUiChartTypes } from '~/widgets/game/ui/chart/game-ui-chart.types';
import { PeriodEnum } from '~/entities/enums/PeriodEnum';
import type { ChartData } from '~/entities/types/ChartData';

const { data, withFilter = false, theme = 'blue' } = defineProps<GameUiChartTypes>();

const colorMode = useColorMode();

const selectedPeriod = defineModel<PeriodEnum>();

const chart = ref<HTMLElement | null>(null);
let statsChart: EChartsType;

const isEnoughData = computed((): boolean => {
    return data.xAsis.length > 1;
});

const color = computed((): string => {
    if (colorMode.value === 'dark') {
        switch (theme) {
            case 'purple':
                return '#DD86BD';
            default:
                return '#282f87';
        }
    }

    switch (theme) {
        case 'purple':
            return '#A70068';
        default:
            return '#4149a0';
    }
});

const chartOptions = {
    grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    xAxis: {
        type: 'category',
        data: data.xAsis,
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
            data: data.yAsis,
            boundaryGap: false,
            type: 'line',
            smooth: true,
            symbol: 'none',
            lineStyle: {
                color: color.value,
                width: 2,
            },
            areaStyle: {
                opacity: 0.8,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                        offset: 0,
                        color: color.value,
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

const updateChart = (data: ChartData) => {
    if (chart.value && chart.value.clientWidth && isEnoughData.value) {
        chartOptions.xAxis.data = data.xAsis;
        chartOptions.series[0].data = data.yAsis;

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
        chartOptions.series[0].lineStyle.color = color.value;
        chartOptions.series[0].areaStyle.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
                offset: 0,
                color: color.value,
            },
            {
                offset: 1,
                color: 'rgba(65, 73, 160, 0)',
            },
        ]);

        statsChart.setOption(chartOptions);
    }
});

watch(
    () => data,
    async () => {
        if (data) {
            await nextTick();
            updateChart(data);
        }
    },
);

onMounted(() => {
    initChart();
    window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    statsChart?.dispose();
});
</script>

<style scoped lang="scss" src="./game-ui-chart.styles.scss" />
