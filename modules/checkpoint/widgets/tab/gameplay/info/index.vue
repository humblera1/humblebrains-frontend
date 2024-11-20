<template>
    <div class="info">
        <div class="info__inner">
            <div class="info__content">
                <h1 class="info__title">
                    {{ $t('step') + ' ' + progress }}
                </h1>
                <UiText :title="$t('instruction')" :text="$t(instruction)" class="info__instruction" />
            </div>
            <UiButton @click="page.selectGameplayTab()">{{ $t('ready') + '!' }}</UiButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useCheckpointPageStore } from '~/modules/checkpoint/stores/checkpointPageStore';

const page = useCheckpointPageStore();

const progress = computed((): string => {
    return `${page.getStep()}/${page.getNumberOfSteps()}`;
});

const instruction = computed((): string => {
    const component = page.getComponentName();

    if (component) {
        return component + ':' + 'instruction';
    }

    return 'instruction';
});
</script>

<style scoped lang="scss" src="./gameplay-info.styles.scss" />
