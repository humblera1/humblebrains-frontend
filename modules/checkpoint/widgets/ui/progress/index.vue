<template>
    <WidgetCheckpointUiBadge>
        <template v-if="mode.isWarmUp()">
            <span>
                <span class="checkpoint-progress__title">{{ $t('warmUp') }}: </span>
                <span class="checkpoint-progress__value">{{ formattedProgress }}</span>
            </span>
        </template>
        <template v-else>
            <p class="checkpoint-progress__title">{{ $t('progress') }}</p>
        </template>
        <div class="checkpoint-progress__container">
            <div class="checkpoint-progress__line" :style="lineStyle" />
        </div>
    </WidgetCheckpointUiBadge>
</template>

<script setup lang="ts">
import { useCheckpointStore } from '~/modules/checkpoint/stores/checkpointStore';
import { useModeStore } from '~/modules/checkpoint/stores/modeStore';

const checkpoint = useCheckpointStore();
const mode = useModeStore();

const lineStyle = computed(() => {
    return `width: ${(checkpoint.finishedLevelsAmount / checkpoint.levelsAmount) * 100}%`;
});

const formattedProgress = computed((): string => {
    return `${checkpoint.finishedLevelsAmount}/${checkpoint.levelsAmount}`;
});
</script>

<style scoped lang="scss" src="./checkpoint-ui-progress.styles.scss" />
