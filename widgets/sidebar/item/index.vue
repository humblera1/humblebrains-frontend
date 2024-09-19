<template>
    <NuxtLink :to="to" :class="['sidebar-item', { 'sidebar-item_active': linkIsActive }]">
        <div class="sidebar-item__icon">
            <component :is="icon" />
        </div>
        <p class="sidebar-item__title">{{ $t(title) }}</p>
    </NuxtLink>
</template>

<script setup lang="ts">
import type { SidebarItem } from '~/widgets/sidebar/item/sidebar-item.types';

const { title, to } = defineProps<SidebarItem>();

const route = useRoute();
const linkIsActive = ref<boolean>(false);

onMounted(() => {
    if (route.path === '/' && to === '/') {
        linkIsActive.value = true;
    }

    if (route.matched.some(({ path }) => path.startsWith(`/${title.toLowerCase()}`))) {
        linkIsActive.value = true;
    }
});
</script>

<style scoped lang="scss" src="./sidebar-item.styles.scss"></style>
