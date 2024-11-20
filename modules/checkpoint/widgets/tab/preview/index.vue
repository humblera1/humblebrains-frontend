<template>
    <div class="preview">
        <h1 class="title">{{ $t(page.getCategory()) }}</h1>
        <WidgetCheckpointTabPreviewInfo />
    </div>
</template>

<script setup lang="ts">
import { useCheckpointPageStore } from '~/modules/checkpoint/stores/checkpointPageStore';

const page = useCheckpointPageStore();
</script>

<style scoped lang="scss">
.preview {
    display: flex;
    flex-direction: column;
    gap: 32px;

    @include tablet {
        gap: 24px;
    }

    @include mobile {
        align-items: center;
        gap: 16px;
    }
}
</style>
