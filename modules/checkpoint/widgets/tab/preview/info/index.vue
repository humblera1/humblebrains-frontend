<template>
    <div class="info">
        <div class="info__body">
            <div class="info__image">
                <NuxtImg :src="image" :alt="`${page.getCategory()} category image`" />
            </div>
            <div class="info__description">
                <UiText :title="$t('description')" :text="$t(description)" />
            </div>
        </div>
        <div class="info__footer">
            <UiButton @click="selectGameplayTab">Пройти</UiButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { CheckpointTabEnum } from '~/entities/enums/checkpoint/CheckpointTabEnum';
import { useCheckpointPageStore } from '~/modules/checkpoint/stores/checkpointPageStore';
import { CognitiveCategoryEnum } from '~/entities/enums/cognitiveCategoryEnum';

const page = useCheckpointPageStore();
const currentTab = useState<CheckpointTabEnum>('checkpoint');

const selectGameplayTab = (): void => {
    currentTab.value = CheckpointTabEnum.gameplay;
};

const description = computed((): string => {
    switch (page.getCategory()) {
        case CognitiveCategoryEnum.memory:
            return 'checkpoint:memoryDescription';
        case CognitiveCategoryEnum.attention:
            return 'checkpoint:attentionDescription';
        case CognitiveCategoryEnum.logic:
            return 'checkpoint:logicDescription';
    }

    return 'description';
});

const image = computed((): string => {
    return `/images/categories/${page.getCategory()}.png`;
});
</script>

<style scoped lang="scss" src="./preview-info.styles.scss" />
