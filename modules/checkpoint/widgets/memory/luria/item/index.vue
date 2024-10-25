<template>
    <div :class="itemClasses">
        <span v-if="item.type === LuriaItemTypeEnum.word">{{ item.content }}</span>
        <img v-else :src="item.content.src" :alt="item.content.name" />
    </div>
</template>

<script setup lang="ts">
import type { LuriaItemProps } from '~/modules/checkpoint/widgets/memory/luria/item/luria-item.types';
import { LuriaItemTypeEnum } from '~/modules/checkpoint/entities/enums/luria/LuriaItemTypeEnum';

const { item } = defineProps<LuriaItemProps>();

const itemClasses = computed(() => {
    return ['item', `item_${item.type}`];
});
</script>

<style scoped lang="scss">
.item {
    background-color: var(--badge-bg);
    @include mainShadow();

    &_word {
        padding: 18px 32px;
        border-radius: 16px;
    }

    &_icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 54px;
        aspect-ratio: 1;
        border-radius: 50%;
    }
}
</style>
