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

<style scoped>
.app {
    padding: 20px 20px 18px 20px;
    max-width: 1920px;
    width: 100%;
    min-height: 100dvh;
    height: 100dvh;
}
</style>