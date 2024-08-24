<template>
    <div class="app">
        <div class="app__page">
            <div class="app__inner">
                <div class="app__header">
                    <WidgetHeader />
                </div>
                <div class="app__content">
                    <div class="app__sidebar">
                        <WidgetSidebar />
                    </div>
                    <div class="content">
                        <slot />
                    </div>
                </div>
                <div class="app__footer"></div>
            </div>
        </div>
        <aside class="app__aside"></aside>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.app {
    display: grid;
    grid-template-columns: 75vw 25vw;
    min-height: 100dvh;
    height: 100dvh;

    @include tablet {
        grid-template-columns: 100vw;
    }

    &__page {
        display: flex;
        justify-content: flex-end;
        padding: 25px;
        background-color: var(--secondary-bg);
        border-radius: 0 48px 48px 0;

        @include boxShadow(4, -4, 25, 0, rgba(55, 64, 109, 0.1));

        @include tablet {
            padding: 15px;
            border-radius: 0;
        }
    }

    &__inner {
        display: flex;
        flex-direction: column;
        gap: 50px;
        width: 100%;
        max-width: 1520px;
        height: 100%;
    }

    &__aside {
        width: 25vw;
        max-width: 400px;

        @include tablet {
            display: none;
        }
    }

    &__content {
        display: flex;
        gap: 60px;
        height: 100%;
    }

    &__sidebar {
        width: fit-content;
        height: 100%;

        @include tablet {
            display: none;
        }
    }
}

.content {
    width: 100%;
}
</style>
