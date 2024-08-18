<template>
    <div class="sidebar">
        <WidgetSidebarItem v-for="(item, idx) in items" :key="idx" :title="item.title" :icon="item.icon" :to="item.to" />
    </div>
</template>

<script setup lang="ts">
import type { SidebarItem } from '~/widgets/sidebar/item/sidebar-item.types';
import House from '~/shared/icons/sidebar/house.vue';
import User from '~/shared/icons/sidebar/user.vue';
import Gear from '~/shared/icons/sidebar/gear.vue';

const items: SidebarItem[] = [
    {
        icon: House,
        to: '/',
        title: 'Home',
    },
    {
        icon: Gear,
        to: '/settings',
        title: 'Settings',
    },
    {
        icon: User,
        to: '/users',
        title: 'Profile',
    },
];
</script>

<style scoped lang="scss"></style>