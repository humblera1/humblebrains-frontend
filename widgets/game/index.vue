<template>
    <WidgetGameTabPreview v-if="page.isPreviewTabSelected()" />
    <WidgetGameTabField v-else-if="page.isFieldTabSelected()" />
    <WidgetGameTabConstructor v-else-if="page.isConstructorTabSelected()" />
    <WidgetGameTabResult v-else-if="page.isResultTabSelected()" />
</template>

<script setup lang="ts">
import { GameEnum } from '~/entities/enums/games/GameEnum';

const page = useGamePageStore();
const route = useRoute();

const isGameEnum = (value: any): value is GameEnum => {
    return Object.values(GameEnum).includes(value);
};

onBeforeMount(() => {
    // set current game, now we can use store.game in components of this page
    if (typeof route.params.id === 'string' && isGameEnum(route.params.id)) {
        page.setupGame(route.params.id);
    } else {
        throw createError({
            statusCode: 404,
            statusMessage: 'Page Not Found',
        });
    }
});

onUnmounted(() => {
    // set default tab to current game when leaving...
    page.resetSelectedTab();
});
</script>

<style scoped lang="scss"></style>
