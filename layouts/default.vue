<template>
    <div class="app">
        <div class="app__page">
            <div class="app__header">

            </div>
            <div class="app__content">
                <aside class="app__sidebar">

                </aside>
                <div class="content">
                    <slot />
                </div>
            </div>
        </div>
        <aside class="app__aside">

        </aside>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.app {
    display: flex;
    justify-content: center;
    min-height: 100dvh;
    height: 100dvh;
    width: 100%;

    &__page {
        padding: 25px;
        max-width: 1920px;
        width: 100%;
        background-color: var(--secondary-bg);
    }
}
</style>