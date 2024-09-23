<template>
    <div class="game-score">
        <div ref="chart" class="game-score__chart" />
        <p class="game-score__title">{{ currentScore }}</p>
    </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { CanvasRenderer } from 'echarts/renderers';
import { use } from 'echarts/core';
import type { EChartsType } from 'echarts';

use([CanvasRenderer]);

const colorMode = useColorMode();

const currentScore = ref<number>(0);
const maxScore = ref<number>(100);

const chartOptions = {
    silent: true,
    series: [
        {
            value: 100,
            name: 'Access From',
            type: 'pie',
            radius: ['80%', '90%'],
            avoidLabelOverlap: true,
            label: {
                position: 'center',
            },
            emphasis: {
                disabled: true,
            },
            data: [
                { value: currentScore.value, itemStyle: { borderRadius: 10, color: '#A70068' } },
                { value: maxScore.value, itemStyle: { color: '#E9DDE4' } },
            ],
        },
    ],
};

const chart = ref<HTMLElement | null>(null);
let scoreChart: EChartsType;

const initChart = () => {
    if (chart.value && chart.value.clientWidth) {
        // eslint-disable-next-line import/namespace
        scoreChart = echarts.init(chart.value);

        scoreChart.setOption(chartOptions);
    }
};

watch(currentScore, () => {
    chartOptions.series[0].data = [
        { value: currentScore.value, itemStyle: { borderRadius: 10, color: '#A70068' } },
        { value: maxScore.value - currentScore.value, itemStyle: { color: '#E9DDE4' } },
    ];

    scoreChart.setOption(chartOptions);
});

watch(colorMode, () => {
    const scoreColor = colorMode.value === 'dark' ? '#B70A76' : '#A70068';
    const bgColor = colorMode.value === 'dark' ? '#52214D' : '#E9DDE4';

    chartOptions.series[0].data = [
        { value: currentScore.value, itemStyle: { borderRadius: 10, color: scoreColor } },
        { value: maxScore.value - currentScore.value, itemStyle: { color: bgColor } },
    ];

    scoreChart.setOption(chartOptions);
});

onMounted(() => {
    initChart();
    window.addEventListener('resize', () => {
        scoreChart.resize();
    });
});

onUnmounted(() => {
    scoreChart?.dispose();
});
</script>

<style scoped lang="scss" src="./game-ui-score.styles.scss"></style>
