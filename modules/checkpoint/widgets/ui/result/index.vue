<template>
    <div class="result">
        <h1 class="result__title">
            {{ $t('stageCompleted') }}
        </h1>
        <WidgetCheckpointUiResultTotal :score="70" :is-checkpoint-completed="true" />
        <div class="result__cards">
            <WidgetCheckpointUiCard :stage="completedStage" />
            <WidgetCheckpointUiCard :stage="stage" type="checkpoint" />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ICheckpointStage } from '~/modules/checkpoint/entities/interfaces/ICheckpointStage';

// todo: stages logic
const stage: ICheckpointStage = {
    id: 1,
    score: 70,
    isCompleted: false,
    category: {
        id: 1,
        name: 'memory',
        label: 'Память',
        description: 'Ваша способность сохранять приобретенные знания, навыки и умения',
    },
};

const completedStage: ICheckpointStage = {
    id: 1,
    score: 70,
    isCompleted: true,
    category: {
        id: 1,
        name: 'attention',
        label: 'Внимание',
        description: 'Ваша способность сохранять приобретенные знания',
    },
};
</script>

<style scoped lang="scss" src="./checkpoint-ui-result.styles.scss" />
