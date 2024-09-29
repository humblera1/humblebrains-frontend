<template>
    <div v-if="page.game">
        this is preview tab of game {{ page.game }}
        <UiButton @click="page.selectFieldTab()"> to the field </UiButton>
        <UiButton @click="page.selectConstructorTab()"> to the constructor </UiButton>
    </div>
</template>

<script setup lang="ts">
const page = useGamePageStore();
</script>

<style scoped lang="scss"></style>
