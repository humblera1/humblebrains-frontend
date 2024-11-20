<template>
    <NuxtLayout>
        <component :is="currentTabComponent" key="checkpointTab" />
    </NuxtLayout>
</template>

<script setup lang="ts">
import { CheckpointTabEnum } from '~/entities/enums/checkpoint/CheckpointTabEnum';
import { WidgetCheckpointTabConclusion, WidgetCheckpointTabGameplay, WidgetCheckpointTabPreview } from '#components';
import { useCheckpointPageStore } from '~/modules/checkpoint/stores/checkpointPageStore';

const page = useCheckpointPageStore();
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

onMounted(() => {
    page.setupStore();
});

onUnmounted(() => {
    currentTab.value = CheckpointTabEnum.preview;
    page.destroyStore();
});
</script>

<style scoped lang="scss"></style>
