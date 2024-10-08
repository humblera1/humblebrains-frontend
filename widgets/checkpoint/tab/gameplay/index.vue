<template>
    <template v-if="page.isPreviewTabSelected()">
        <WidgetCheckpointTestPreview />
    </template>
    <template v-else>
        <component :is="currentChain" key="testChain" />
    </template>
</template>

<script setup lang="ts">
import { useCheckpointPageStore } from '~/modules/checkpoint/stores/checkpointPageStore';
import { WidgetCheckpointAttentionChain, WidgetCheckpointLogicChain, WidgetCheckpointMemoryChain } from '#components';
import { CognitiveCategoryEnum } from '~/entities/enums/cognitiveCategoryEnum';

const route = useRoute();
const page = useCheckpointPageStore();

let currentChain: typeof WidgetCheckpointMemoryChain | typeof WidgetCheckpointLogicChain | typeof WidgetCheckpointAttentionChain;

switch (route.params.category) {
    case CognitiveCategoryEnum.memory:
        currentChain = WidgetCheckpointMemoryChain;
        break;
    case CognitiveCategoryEnum.logic:
        currentChain = WidgetCheckpointLogicChain;
        break;
    case CognitiveCategoryEnum.attention:
        currentChain = WidgetCheckpointAttentionChain;
        break;
}

onUnmounted(() => {
    page.selectPreviewTab();
});
</script>

<style scoped lang="scss"></style>
