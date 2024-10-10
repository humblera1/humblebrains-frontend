<template>
    <li class="list-item" @click="$emit('selected')">
        <span class="list-item__content">
            <component :is="icon" :key="title" />
            <span class="list-item__title">{{ $t(title) }}</span>
        </span>
    </li>
</template>

<script setup lang="ts">
import type { ListItem } from '~/shared/ui/list/item/list-item.types';
import { IconDot } from '#components';

defineEmits(['selected']);

withDefaults(defineProps<ListItem>(), {
    icon: IconDot,
});
</script>

<style scoped lang="scss">
.list-item {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 8px 16px;
    border-radius: 12px;
    transition: background-color 250ms ease;

    &__content {
        display: flex;
        gap: 12px;
    }

    &__title {
        @include mainFont(400, 16, var(--primary-subtitle));
    }

    &:hover {
        background-color: var(--item-hovered-bg);
    }
}
</style>