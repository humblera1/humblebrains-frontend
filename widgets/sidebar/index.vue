<template>
    <aside class="sidebar">
        <div class="sidebar__main">
            <WidgetSidebarItem v-for="(item, idx) in items" :key="idx" :title="item.title" :icon="item.icon" :to="item.to" />
        </div>
        <div class="sidebar__last">
            <WidgetSidebarItem :title="lastItem.title" :icon="lastItem.icon" :to="lastItem.to" />
        </div>
    </aside>
</template>

<script setup lang="ts">
import type { SidebarItem } from '~/widgets/sidebar/item/sidebar-item.types';
import House from '~/shared/icons/sidebar/house.vue';
import User from '~/shared/icons/sidebar/user.vue';
import Gear from '~/shared/icons/sidebar/gear.vue';
import Puzzle from '~/shared/icons/sidebar/puzzle.vue';

const items: SidebarItem[] = [
    {
        icon: House,
        to: '/',
        title: 'home',
    },
    {
        icon: User,
        to: '/profile',
        title: 'profile',
    },
    {
        icon: Puzzle,
        to: '/games',
        title: 'games',
    },
];

const lastItem: SidebarItem = {
    icon: Gear,
    to: '/settings',
    title: 'settings',
};
</script>

<style scoped lang="scss" src="./sidebar.styles.scss"></style>
