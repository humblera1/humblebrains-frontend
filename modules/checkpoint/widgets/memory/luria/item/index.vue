<template>
    <div :class="itemClasses">
        <span v-if="luria.isCurrentItemWord" class="item__word">
            <span>
                {{ item.content }}
            </span>
        </span>
        <div v-else class="item__icon" v-html="luria.getCurrentIconRawSvg()" />
    </div>
</template>

<script setup lang="ts">
import type { LuriaItemProps } from '~/modules/checkpoint/widgets/memory/luria/item/luria-item.types';
import { useLuriaStore } from '~/modules/checkpoint/stores/memory/luriaStorage';

const { item } = defineProps<LuriaItemProps>();

const luria = useLuriaStore();

const itemClasses = computed(() => {
    return ['item', `item_${item.type}`, item.color];
});
</script>

<style scoped lang="scss" src="./luria-item.styles.scss" />
