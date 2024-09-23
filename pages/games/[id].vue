<template>
    <NuxtLayout>
        <WidgetGameUiLayout>
            <component :is="component" v-if="component" />
            <span v-else> loading... </span>
        </WidgetGameUiLayout>
    </NuxtLayout>
</template>

<script setup lang="ts">
import type { Component } from 'vue';

const route = useRoute();
const router = useRouter();

const component = shallowRef<Component>();

const loadGameComponent = (gameName: string | string[]) => {
    switch (gameName) {
        case 'matrix':
            component.value = defineAsyncComponent(() => import('@/widgets/game/matrix/index.vue'));
            break;
        default:
            router.push('/404');
    }
};
onMounted(() => {
    loadGameComponent(route.params.id);
});
</script>

<style scoped lang="scss"></style>
