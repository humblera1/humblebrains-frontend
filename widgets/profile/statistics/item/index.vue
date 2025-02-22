<template>
    <div :class="['item', { item_active: isActive, item_visible: isVisible }]">
        <template v-if="type === 'logic'">
            <UiInDevelopment :with-button="false" />
        </template>
        <template v-else>
            <div class="item__header">
                <p class="item__title">{{ $t(type) }}</p>
                <p class="item__subtitle">{{ $t('checkpointsAmount') + ': ' + stagesAmount }}</p>
            </div>
            <div class="item__body">
                <div ref="chart" class="item__chart" :class="{ item__chart_visible: showChart }" />
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { type EChartsType } from 'echarts';
import * as echarts from 'echarts';
import type { ProfileStatisticsItemProps } from '~/widgets/profile/statistics/item/profile-statistics-item.types';
import type { ChartData } from '~/entities/types/ChartData';

const { type, isActive, data } = defineProps<ProfileStatisticsItemProps>();

const colorMode = useColorMode();

const showChart = ref<boolean>(true);

const chart = ref<HTMLElement | null>(null);
let statsChart: EChartsType;

const stagesAmount = computed((): number => {
    return data.xAsis.length;
});

const isEnoughData = computed((): boolean => {
    return stagesAmount.value > 1;
});

const isDarkMode = computed((): boolean => {
    return colorMode.value === 'dark';
});

const color = computed((): string => {
    if (colorMode.value === 'dark') {
        switch (type) {
            case 'attention':
                return '#DD86BD';
            default:
                return '#282f87';
        }
    }

    switch (type) {
        case 'attention':
            return '#A70068';
        default:
            return '#4149a0';
    }
});

const tooltipBg = computed((): string => {
    return isDarkMode.value ? '#23232f' : '#fafafa';
});

const tooltipTextColor = computed((): string => {
    return isDarkMode.value ? '#bbbfd3' : '#082567';
});

const chartOptions = {
    tooltip: {
        trigger: false,
        formatter: (params) => {
            const value = params[0].data;
            return `${value}%`;
        },
        borderWidth: 0,
        backgroundColor: tooltipBg.value,
        textStyle: {
            color: tooltipTextColor.value,
            fontWeight: 600,
            fontSize: 12,
        },
    },
    grid: {
        left: '8px',
        right: '8px',
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
            markPoint: {
                data: [
                    {
                        coord: [0, data.yAsis[0]],
                        symbol: 'circle',
                        symbolSize: 10,
                        itemStyle: {
                            color: color.value,
                        },
                    },
                    {
                        coord: [data.xAsis.length - 1, data.yAsis[data.yAsis.length - 1]],
                        symbol: 'circle',
                        symbolSize: 10,
                        itemStyle: {
                            color: color.value,
                        },
                    },
                ],
                label: {
                    show: false,
                },
            },
        },
    ],
};

const initChart = () => {
    // todo: logic category
    if (type === 'logic') {
        return;
    }

    if (chart.value && chart.value.clientWidth) {
        // eslint-disable-next-line import/namespace
        statsChart = echarts.init(chart.value);

        chartOptions.tooltip.trigger = isActive ? 'axis' : false;

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
        // tooltip options
        // chartOptions.tooltip.backgroundColor = tooltipBg.value;
        // chartOptions.tooltip.textStyle.color = tooltipTextColor.value;

        // mark
        chartOptions.series[0].markPoint.data[0].itemStyle.color = color.value;
        chartOptions.series[0].markPoint.data[1].itemStyle.color = color.value;

        // graphic
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

const updateChart = (data: ChartData) => {
    if (chart.value && chart.value.clientWidth && isEnoughData.value) {
        chartOptions.xAxis.data = data.xAsis;
        chartOptions.series[0].data = data.yAsis;

        chartOptions.series[0].markPoint.data[0].coord = [0, data.yAsis[0]];
        chartOptions.series[0].markPoint.data[1].coord = [data.xAsis.length - 1, data.yAsis[data.yAsis.length - 1]];

        statsChart.setOption(chartOptions);
    }
};

watch(
    () => data,
    async () => {
        if (data) {
            await nextTick();
            updateChart(data);
        }
    },
);

watch(
    () => isActive,
    async (newVal) => {
        showChart.value = false;

        await nextTick();

        // todo: clearing timerId
        setTimeout(() => {
            statsChart?.dispose();
            initChart();

            showChart.value = true;
        }, 250);
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

<style scoped lang="scss" src="./profile-statistics-item.styles.scss" />
