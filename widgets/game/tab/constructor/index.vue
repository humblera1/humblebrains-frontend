<template>
    <div>
        this is the constructor tab
        <UiButton @click="page.selectPreviewTab()"> preview </UiButton>
        <UiButton @click="page.selectFieldTab()"> field </UiButton>
    </div>
</template>

<script setup lang="ts">
const page = useGamePageStore();
</script>

<style scoped lang="scss"></style>
