<template>
    <div class="main-benefits">
        <p class="main-benefits__title">{{ $t('whyBrainNeedTraining') }}</p>
        <ul class="main-benefits__list">
            <WidgetMainpageBenefit v-for="(benefit, idx) in benefits" :key="idx" :benefit />
        </ul>
    </div>
</template>

<script setup lang="ts">
import type { Benefit } from '~/entities/types/MainBenefit';
import { IconBrainCpu, IconHeartFocus, IconStructure } from '#components';

const benefits: Benefit[] = [
    {
        icon: IconHeartFocus,
        theme: 'pink',
        content: 'benefit:health',
    },
    {
        icon: IconStructure,
        theme: 'blue',
        content: 'benefit:reduceDementiaRisk',
    },
    {
        icon: IconBrainCpu,
        theme: 'violet',
        content: 'benefit:memory',
    },
];
</script>

<style scoped lang="scss" src="./main-benefits.styles.scss" />
