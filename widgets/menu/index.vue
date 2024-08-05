<template>
    <nav ref="menu" class="menu">
        <ul class="menu__content">
            <li class="menu__item" v-for="item in itemsInHeader" :key="item.label">
                <WidgetMenuItem :label="item.label" :icon="item.icon" :to="item.to"/>
            </li>
            <li v-show="!isEnoughWidth" class="menu__item menu__item_ellipsis" @click="isPopoverVisible = true">
                <IconEllipsis />
            </li>
        </ul>
        <UiPopover v-if="!isEnoughWidth" v-model="isPopoverVisible" align="right">
            <ul class="menu__popover">
                <li class="menu__item" v-for="item in itemsInPopover" :key="item.label">
                    <WidgetMenuItem :label="item.label" :icon="item.icon" :to="item.to"/>
                </li>
            </ul>
        </UiPopover>
    </nav>
</template>

<script setup lang="ts">
import type {MenuItem} from "~/widgets/menu/item/menu-item.types";
import { useElementSize } from '@vueuse/core';

const isPopoverVisible = ref<boolean>(false);

const menu = ref(null);

const { width } = useElementSize(menu)

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

const isEnoughWidth = computed((): boolean => {
    return width.value > 300;
});

const itemsInHeader = computed((): MenuItem[] => {
    if (width.value < 255) {
        return menuItems.slice(0, 1);
    }

    if (width.value < 300) {
        return menuItems.slice(0, 2);
    }

    return menuItems;
});

const itemsInPopover = computed((): MenuItem[] => {
    if (width.value < 255) {
        return menuItems.slice(1);
    }

    if (width.value < 300) {
        return menuItems.slice(2);
    }

    return [];
});
</script>

<style scoped lang="scss" src="./menu.styles.scss"></style>