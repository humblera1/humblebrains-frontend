<template>
    <li class="list-item" @click="$emit('selected')">
        <span class="list-item__content">
            <span class="list-item__icon">
                <component :is="icon" :key="title" />
            </span>
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

<style scoped lang="scss" src="./list-item.styles.scss" />
