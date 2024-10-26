<template>
    <div :class="itemClasses">
        <span v-if="item.type === LuriaItemTypeEnum.word">{{ item.content }}</span>
        <div v-else class="item__icon" v-html="luria.getIconRawSvg(item.content.name)" />
    </div>
</template>

<script setup lang="ts">
import type { LuriaItemProps } from '~/modules/checkpoint/widgets/memory/luria/item/luria-item.types';
import { LuriaItemTypeEnum } from '~/modules/checkpoint/entities/enums/luria/LuriaItemTypeEnum';
import { useLuriaStore } from '~/modules/checkpoint/stores/memory/luriaStorage';

const { item } = defineProps<LuriaItemProps>();

const luria = useLuriaStore();

const itemClasses = computed(() => {
    return ['item', `item_${item.type}`, item.color];
});
</script>

<style scoped lang="scss">
.item {
    position: relative;
    background-color: var(--badge-bg);
    @include mainShadow();

    &_word {
        padding: 24px 48px;
        border-radius: 24px;
        text-transform: uppercase;

        @include mainFont(500, 24);
    }

    &_icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 85px;
        height: 85px;
        aspect-ratio: 1;
        border-radius: 50%;
    }

    &__icon {
        width: 36px;
        height: 36px;
        max-width: 36px;
        max-height: 36px;

        // Эти стили помогают избежать "скачков" svg-иконки при отрисовке
        margin-left: -1px;
        margin-top: -1px;

        ::v-deep(svg) {
            width: 100%;
            height: 100%;
        }
    }
}
</style>
