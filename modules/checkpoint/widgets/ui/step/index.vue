<template>
    <div class="checkpoint-step">
        <p class="checkpoint-step__title">{{ $t(page.getCategory()) }}</p>
        <p class="checkpoint-step__subtitle">{{ $t('step') + ' ' + progress }}</p>
    </div>
</template>

<script setup lang="ts">
import { useCheckpointPageStore } from '~/modules/checkpoint/stores/checkpointPageStore';

const page = useCheckpointPageStore();

const progress = computed((): string => {
    return `${page.getStep()}/${page.getNumberOfSteps()}`;
});
</script>

<style scoped lang="scss" src="./checkpoint-ui-step.styles.scss" />
