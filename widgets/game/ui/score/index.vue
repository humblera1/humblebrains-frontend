<template>
    <div class="game-score">
        <div ref="chart" class="game-score__chart" />
        <div :class="badgeClasses">
            <div class="game-score__flipper">
                <div class="game-score__front">
                    <p class="game-score__title">
                        {{ animatedScore }}
                    </p>
                </div>
                <div class="game-score__back">
                    <Transition name="fade" mode="out-in">
                        <template v-if="isFlippedByTarget">
                            <IconStar />
                        </template>
                        <template v-else-if="game.isInLevelFinishingState()">
                            <IconGamePromotion :class="iconClasses" />
                        </template>
                    </Transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { CanvasRenderer } from 'echarts/renderers';
import { use } from 'echarts/core';
import type { EChartsType } from 'echarts';

use([CanvasRenderer]);

const SCORE_ANIMATION_DURATION = 500;

const game = useGameStore();

const colorMode = useColorMode();

const isFlippedByTarget = ref<boolean>(false);

const badgeClasses = computed(() => {
    return [
        'game-score__badge',
        {
            'game-score__badge_flipped': isFlippedByTarget.value || game.isInLevelFinishingState(),
        },
    ];
});

const iconClasses = computed(() => {
    return {
        'game-score__demotion': game.isInLevelDemotionState(),
    };
});

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
                { value: game.totalScore, itemStyle: { borderRadius: 10, color: '#A70068' } },
                { value: game.target, itemStyle: { color: '#E9DDE4' } },
            ],
        },
    ],
};

const animatedScore = ref(game.totalScore);

const chart = ref<HTMLElement | null>(null);
let scoreChart: EChartsType;

const initChart = () => {
    if (chart.value && chart.value.clientWidth) {
        // eslint-disable-next-line import/namespace
        scoreChart = echarts.init(chart.value);

        scoreChart.setOption(chartOptions);
    }
};

const animateScore = (score: number) => {
    const difference = score - animatedScore.value;
    const step = difference / (SCORE_ANIMATION_DURATION / 100);
    const interval = setInterval(() => {
        if (animatedScore.value < score) {
            animatedScore.value = Math.round(Math.min(animatedScore.value + step, score));
        } else {
            clearInterval(interval);
        }
    }, 100);
};

watch(
    () => game.totalScore,
    (newValue, oldValue) => {
        animateScore(newValue);

        // Не обновляем диаграмму, если счет уже превысил цель
        if (oldValue >= game.target) {
            return;
        }

        chartOptions.series[0].data = [
            { value: newValue, itemStyle: { borderRadius: 10, color: '#A70068' } },
            { value: game.target - newValue, itemStyle: { color: '#E9DDE4' } },
        ];

        scoreChart.setOption(chartOptions);
    },
);

watch(colorMode, () => {
    const scoreColor = colorMode.value === 'dark' ? '#B70A76' : '#A70068';
    const bgColor = colorMode.value === 'dark' ? '#52214D' : '#E9DDE4';

    chartOptions.series[0].data = [
        { value: game.totalScore, itemStyle: { borderRadius: 10, color: scoreColor } },
        { value: game.target - game.totalScore, itemStyle: { color: bgColor } },
    ];

    scoreChart.setOption(chartOptions);
});

watch(
    () => game.isTargetCompleted,
    () => {
        isFlippedByTarget.value = true;

        setTimeout(() => (isFlippedByTarget.value = false), 1000);
    },
);

const handleResize = () => {
    if (scoreChart && !scoreChart.isDisposed()) {
        scoreChart.resize();
    }
};

onMounted(() => {
    window.addEventListener('resize', handleResize);
    initChart();
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    scoreChart?.dispose();
});
</script>

<style scoped lang="scss" src="./game-ui-score.styles.scss"></style>
