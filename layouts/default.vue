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

    @include small-desktop {
        grid-template-columns: 100vw;
    }

    &__page {
        display: flex;
        justify-content: flex-end;
        padding: 25px;
        background-color: var(--primary-bg);
        border-radius: 0 48px 48px 0;
        //overflow: hidden;

        @include mainShadow();

        @include small-desktop {
            border-radius: 0;
        }

        @include tablet {
            padding: 16px;
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

        @include small-desktop {
            display: none;
        }
    }

    &__content {
        display: flex;
        gap: 60px;
        height: 100%;

        @include tablet {
            padding: 0 16px;
        }

        @include mobile {
            padding: 0;
        }
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

    @include mobile {
        overflow: visible;
    }
}
</style>
