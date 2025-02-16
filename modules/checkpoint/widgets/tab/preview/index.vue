<template>
    <div class="preview">
        <!-- todo: logic-category: -->
        <template v-if="page.getCategory() === CognitiveCategoryEnum.logic">
            <UiInDevelopment />
        </template>
        <template v-else>
            <h1 class="title">{{ $t(page.getCategory()) }}</h1>
            <WidgetCheckpointTabPreviewInfo />
        </template>
    </div>
</template>

<script setup lang="ts">
import { useCheckpointPageStore } from '~/modules/checkpoint/stores/checkpointPageStore';
import { CognitiveCategoryEnum } from '~/entities/enums/cognitiveCategoryEnum';

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
