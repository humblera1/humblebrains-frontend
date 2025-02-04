<template>
    <div ref="container" class="complete-checkpoint__container">
        <div :class="['complete-checkpoint', `complete-checkpoint_${computedView}`]">
            <div class="complete-checkpoint__content">
                <div class="complete-checkpoint__text">
                    <p class="complete-checkpoint__title">{{ $t('action:completeCheckpoint') }}</p>
                    <p class="complete-checkpoint__subtitle">{{ $t('action:completeCheckpointDescription') }}</p>
                </div>
                <NuxtLink :to="localePath('/progress')" class="complete-checkpoint__button">
                    <IconArrowLeft />
                </NuxtLink>
            </div>
            <div class="complete-checkpoint__icon">
                <IconPieChart />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useElementSize } from '@vueuse/core';
import type { CompleteCheckpointProps } from '~/widgets/action/complete-checkpoint/complete-checkpoint.types';

const { view = 'large' } = defineProps<CompleteCheckpointProps>();

const localePath = useLocalePath();

const container = ref<HTMLDivElement | null>(null);

const windowWidth = ref<number | null>(null);
const { width } = useElementSize(container);

const updateWindowSize = () => {
    if (typeof window !== 'undefined') {
        windowWidth.value = window.innerWidth;
    }
};

const computedView = computed((): string => {
    if (width.value <= 450) {
        return 'small';
    } else if (width.value <= 650) {
        return 'medium';
    }

    return view;
});

onMounted(() => {
    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
});

onUnmounted(() => {
    window.removeEventListener('resize', updateWindowSize);
});
</script>

<style scoped lang="scss" src="./complete-checkpoint.styles.scss" />
