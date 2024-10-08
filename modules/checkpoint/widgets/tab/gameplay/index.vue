<template>
    <template v-if="page.isPreviewTabSelected()">
        <WidgetCheckpointTestPreview />
    </template>
    <template v-else-if="page.isGameplayTabSelected()">
        <component
            :is="page.currentTestComponent.component"
            v-if="page.currentTestComponent?.component"
            :key="page.currentTestComponent.name"
        />
    </template>
</template>

<script setup lang="ts">
import { useCheckpointPageStore } from '~/modules/checkpoint/stores/checkpointPageStore';

const page = useCheckpointPageStore();

page.setupStore();

onUnmounted(() => {
    page.destroyStore();
});
</script>

<style scoped lang="scss"></style>
