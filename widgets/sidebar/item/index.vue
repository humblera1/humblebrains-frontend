<template>
    <NuxtLink :to="to" :class="['sidebar-item', { 'sidebar-item_active': linkIsActive }]">
        <div class="sidebar-item__icon">
            <component :is="icon" />
        </div>
        <p class="sidebar-item__name">{{ title }}</p>
    </NuxtLink>
</template>

<script setup lang="ts">
import type { SidebarItem } from '~/widgets/sidebar/item/sidebar-item.types';

defineProps<SidebarItem>();
</script>

<style scoped lang="scss">
.sidebar-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    width: 100px;
    min-width: 100px;
    height: 80px;
    border-radius: 24px;

    background-color: var(--secondary-bg);

    @include mainShadow();
}
</style>