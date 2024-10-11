<template>
    <WidgetCheckpointUiBadge>
    <div class="checkpoint-progress__inner">
            <transition name="fade" mode="out-in">
                <span v-if="checkpoint.isInWarmUpMode()" class="checkpoint-progress__info checkpoint-progress__info_warmup">
                    <span class="checkpoint-progress__title">{{ $t('warmUp') }}: </span>
                    <span class="checkpoint-progress__value">{{ formattedProgress }}</span>
                </span>
                <span v-else class="checkpoint-progress__info">
                    <span class="checkpoint-progress__title">{{ $t('progress') }}</span>
                </span>
            </transition>
    </div>
        <div class="checkpoint-progress__container">
            <div class="checkpoint-progress__line" :style="lineStyle" />
        </div>
        <!--        </div>-->
    </WidgetCheckpointUiBadge>
</template>

<script setup lang="ts">
import { useCheckpointStore } from '~/modules/checkpoint/stores/checkpointStore';

const checkpoint = useCheckpointStore();

const lineStyle = computed(() => {
    return `width: ${(checkpoint.finishedLevelsAmount / checkpoint.levelsAmount) * 100}%`;
});

const formattedProgress = computed((): string => {
    return `${checkpoint.finishedLevelsAmount}/${checkpoint.levelsAmount}`;
});
</script>

<style scoped lang="scss" src="./checkpoint-ui-progress.styles.scss" />
