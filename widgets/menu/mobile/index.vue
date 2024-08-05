<template>
    <nav class="menu-mobile">
        <ul class="menu-mobile__content">
            <li class="menu-mobile__item" v-for="item in menuItems" :key="item.label">
                <WidgetMenuItem :label="item.label" :icon="item.icon" :to="item.to"/>
            </li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
import type { MenuItem } from '~/widgets/menu/item/menu-item.types';

const menuItems: MenuItem[] = [
    {
        label: 'О проекте',
        icon: '/icons/about.svg',
        to: '/about'
    },
    {
        label: 'Поддержать нас',
        icon: '/icons/coins.svg',
        to: '/support'
    },
    {
        label: 'FAQ',
        icon: '/icons/faq.svg',
        to: '/faq'
    }
];
</script>

<style scoped lang="scss" src="./menu-mobile.styles.scss"></style>
