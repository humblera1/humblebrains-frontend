<template>
    this is preview tab of game {{ page.game }}
    <UiButton @click="page.selectFieldTab()"> to the field </UiButton>
    <UiButton @click="page.selectConstructorTab()"> to the constructor </UiButton>
</template>

<script setup lang="ts">
const page = useGamePageStore();

console.log(page.game);
</script>

<style scoped lang="scss"></style>
