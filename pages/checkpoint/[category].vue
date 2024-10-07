<template>
    <NuxtLayout>
        <component :is="currentTabComponent" key="checkpointTab" />
    </NuxtLayout>
</template>

<script setup lang="ts">
import { CheckpointTabEnum } from '~/entities/enums/checkpoint/CheckpointTabEnum';
import { WidgetCheckpointTabConclusion, WidgetCheckpointTabGameplay, WidgetCheckpointTabPreview } from '#components';

const currentTab = useState<CheckpointTabEnum>('checkpoint', () => CheckpointTabEnum.preview);

const currentTabComponent = computed(() => {
    switch (currentTab.value) {
        case CheckpointTabEnum.preview:
            return WidgetCheckpointTabPreview;
        case CheckpointTabEnum.gameplay:
            return WidgetCheckpointTabGameplay;
        case CheckpointTabEnum.conclusion:
            return WidgetCheckpointTabConclusion;
    }
});
</script>

<style scoped lang="scss"></style>
