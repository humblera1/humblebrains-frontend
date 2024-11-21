<template>
    <div class="steps">
        <p v-if="!isAllStagesCompleted" class="steps__title">{{ $t('progress') }}</p>
        <div class="steps__container">
            <div ref="chart" class="steps__chart" />
            <div class="steps__progress">
                {{ completedStepsAmount + '/' + stepsAmount }}
            </div>
        </div>
        <div class="steps__footer">
            <UiButton v-if="isAllStagesCompleted" @click="openModal(WidgetModalCompletionCheckpoint)"> {{ $t('finish') }} </UiButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import type { EChartsType } from 'echarts';
import { useUserStore } from '~/modules/user/stores/userStore';
import { WidgetModalCompletionCheckpoint } from '#components';

const user = useUserStore();

const colorMode = useColorMode();

const { openModal } = useHumbleModal();

const chart = ref<HTMLElement | null>(null);
let stepsChart: EChartsType;

const isAllStagesCompleted = computed((): boolean => {
    return user.stages.every((stage) => stage.isCompleted);
});

const completedStepsAmount = computed((): number => {
    return user.stages.filter((stage) => stage.isCompleted).length;
});

const stepsAmount = computed((): number => {
    return user.stages.length;
});

const stageColor = computed((): string => {
    return colorMode.value === 'dark' ? '#3A3A52' : '#e2e5f4';
});

const completedStageColor = computed((): string => {
    return colorMode.value === 'dark' ? '#bbbfd3' : '#082567';
});

const option = {
    series: [
        {
            type: 'pie',
            radius: ['90%', '100%'],
            avoidLabelOverlap: false,
            padAngle: 5,
            label: {
                show: false,
            },
            data: Array.from(
                user.stages.sort((a, b) => {
                    if (a.isCompleted && !b.isCompleted) return -1;
                    if (!a.isCompleted && b.isCompleted) return 1;
                    return 0;
                }),
                (stage) => ({
                    value: 1,
                    itemStyle: {
                        color: stage.isCompleted ? completedStageColor.value : stageColor.value,
                    },
                }),
            ),
        },
    ],
};

const initChart = () => {
    if (chart.value && chart.value.clientWidth) {
        // eslint-disable-next-line import/namespace
        stepsChart = echarts.init(chart.value);
        stepsChart.setOption(option);
    }
};

const updateChart = () => {
    if (stepsChart && !stepsChart.isDisposed()) {
        option.series[0].data = Array.from(
            user.stages.sort((a, b) => {
                if (a.isCompleted && !b.isCompleted) return -1;
                if (!a.isCompleted && b.isCompleted) return 1;
                return 0;
            }),
            (stage) => ({
                value: 1,
                itemStyle: {
                    color: stage.isCompleted ? completedStageColor.value : stageColor.value,
                },
            }),
        );

        stepsChart.setOption(option);
    }
};

const handleResize = () => {
    if (stepsChart && !stepsChart.isDisposed()) {
        stepsChart.resize();
    }
};

watch(colorMode, () => updateChart());

watch(
    () => user.stages,
    () => updateChart(),
);

onMounted(() => {
    initChart();
    window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    stepsChart?.dispose();
});
</script>

<style scoped lang="scss" src="./checkpoint-ui-steps.styles.scss" />
