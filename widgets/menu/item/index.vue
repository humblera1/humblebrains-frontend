<template>
    <NuxtLink :to="localePath(to)" class="menu-item">
        <div class="menu-item__icon">
            <component :is="icon" />
        </div>
        <span class="menu-item__label">
            {{ $t(label) }}
        </span>
    </NuxtLink>
</template>
/>

<script setup lang="ts">
import type { MenuItem } from '~/widgets/menu/item/menu-item.types';

defineProps<MenuItem>();

const localePath = useLocalePath();
</script>

<style scoped lang="scss" src="./menu-item.styles.scss"></style>
