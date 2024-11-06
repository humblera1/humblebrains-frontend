<template>
    <div class="total">
        <div class="total__container">
            <p class="total__score">
                <span v-show="animatedScore > 0">
                    {{ animatedScore + ' / 100' }}
                </span>
            </p>
            <div ref="chart" class="total__chart" :class="isChartVisible ? 'total__chart_visible' : ''" />
        </div>
        <div class="total__content">
            <p class="total__title">
                <span>
                    {{ $t('result') + ': ' }}
                </span>
                <span v-show="animatedScore > 0">
                    {{ animatedScore + '%' }}
                </span>
            </p>
            <p class="total__message">
                {{ $t(message) }}
            </p>
        </div>
        <UiInfo class="total__info" />
    </div>
</template>

<script setup lang="ts">
import { type EChartsType } from 'echarts';
import * as echarts from 'echarts';
import type { CheckpointUiResultTotalProps } from '~/modules/checkpoint/widgets/ui/result/total/checkpoint-ui-result-total.types';

const CHART_ANIMATION_DURATION = 5000;
const SCORE_ANIMATION_DURATION = 3000;

const { score, isCheckpointCompleted } = defineProps<CheckpointUiResultTotalProps>();

const animatedScore = ref(0);

const message = computed((): string => {
    return isCheckpointCompleted ? 'restAndContinue' : 'restAndCompleteCheckpoint';
});

const isChartVisible = ref<boolean>(false);

const chartOptions = {
    silent: true,
    series: [
        {
            animationDuration: 0,
            type: 'pie',
            radius: ['90%', '100%'],
            avoidLabelOverlap: true,
            label: {
                position: 'center',
            },
            emphasis: {
                disabled: true,
            },
            data: [{ value: 100, itemStyle: { color: '#5961AE' } }],
        },
        {
            animationDuration: CHART_ANIMATION_DURATION,
            type: 'pie',
            radius: ['90%', '100%'],
            avoidLabelOverlap: true,
            label: {
                position: 'center',
            },
            emphasis: {
                disabled: true,
            },
            data: [
                { value: score, itemStyle: { borderRadius: 10, color: '#FFFFFF' } },
                { value: 100 - score, itemStyle: { color: '#5961AE' } },
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

const showResults = () => {
    initChart();

    // скрываем 'мигание' при инициализации
    setTimeout(() => {
        isChartVisible.value = true;
        animateScore();
    }, 250);
};

const animateScore = () => {
    const step = score / (SCORE_ANIMATION_DURATION / 100);
    const interval = setInterval(() => {
        if (animatedScore.value < score) {
            animatedScore.value = Math.round(Math.min(animatedScore.value + step, score));
        } else {
            clearInterval(interval);
        }
    }, 100);
};

const handleResize = () => {
    if (scoreChart && !scoreChart.isDisposed()) {
        scoreChart.resize();
    }
};

onMounted(() => {
    window.addEventListener('resize', handleResize);
    showResults();
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    scoreChart?.dispose();
});
</script>

<style scoped lang="scss" src="./checkpoint-ui-result-total.styles.scss" />
