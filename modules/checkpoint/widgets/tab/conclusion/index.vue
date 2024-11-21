<template>
    <div class="conclusion">
        <template v-if="completedStage && completedStage.isCompleted">
            <h1 class="conclusion__title">
                {{ $t('stageCompleted') }}
            </h1>
            <WidgetCheckpointUiResultTotal :score="score" :is-checkpoint-completed="true" />
            <div class="conclusion__cards">
                <WidgetCheckpointUiCard v-if="completedStage" :stage="completedStage" />
                <WidgetCheckpointUiCard v-if="nextStage" :stage="nextStage" type="checkpoint" />
            </div>
        </template>
        <template v-else-if="isPending">
            <UiPreloader />
        </template>
        <template v-else>
            <UiNetworkError @resend="resendResults" />
        </template>
    </div>
</template>

<script setup lang="ts">
import type { ICheckpointStage } from '~/modules/checkpoint/entities/interfaces/ICheckpointStage';
import { useUserStore } from '~/modules/user/stores/userStore';
import { useCheckpointStore } from '~/modules/checkpoint/stores/checkpointStore';
import { useCheckpointPageStore } from '~/modules/checkpoint/stores/checkpointPageStore';

const user = useUserStore();
const page = useCheckpointPageStore();
const checkpoint = useCheckpointStore();

const isPending = ref<boolean>(false);

const score = computed((): number => {
    return completedStage.value?.score ?? 0;
});

const completedStage = computed((): ICheckpointStage | undefined => {
    return user.stages.find((stage) => stage.category.name === page.getCategory());
});

const nextStage = computed((): ICheckpointStage | undefined => {
    return user.stages.find((stage) => !stage.isCompleted);
});

const resendResults = async () => {
    isPending.value = true;

    await checkpoint.saveResults();

    isPending.value = false;
};
</script>

<style scoped lang="scss" src="./conclusion.styles.scss" />
