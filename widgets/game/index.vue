<template>
    <div class="container">
        <Transition name="slide-fade">
            <component :is="currentTabComponent" key="gameTab" />
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { GameEnum } from '~/entities/enums/games/GameEnum';
import { WidgetGameTabConstructor, WidgetGameTabField, WidgetGameTabPreview, WidgetGameTabResult } from '#components';

const page = useGamePageStore();
const route = useRoute();

const currentTabComponent = computed(() => {
    switch (true) {
        case page.isPreviewTabSelected():
            return WidgetGameTabPreview;
        case page.isFieldTabSelected():
            return WidgetGameTabField;
        case page.isConstructorTabSelected():
            return WidgetGameTabConstructor;
        case page.isResultTabSelected():
            return WidgetGameTabResult;
    }
});

const isGameEnum = (value: any): value is GameEnum => {
    return Object.values(GameEnum).includes(value);
};

if (typeof route.params.id === 'string' && isGameEnum(route.params.id)) {
    page.setupGame(route.params.id);
} else {
    throw createError({
        statusCode: 404,
        statusMessage: 'Page Not Found',
    });
}

onUnmounted(() => {
    // set default tab to current game when leaving...
    page.resetSelectedTab();
});
</script>

<style scoped lang="scss">
.container {
    position: relative;
    width: 100%;
    height: 100%;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
    transition:
        transform 0.5s ease,
        opacity 0.25s ease-in-out;
    position: absolute;
    width: 100%;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    opacity: 0;
}

.slide-fade-enter-from {
    transform: translateX(80%);
}

.slide-fade-leave-to {
    transform: translateX(-5%);
}
</style>
