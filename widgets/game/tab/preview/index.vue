<template>
    <div v-if="page.game" class="preview">
<!--        <WidgetGameTabPreviewInfo />-->
<!--        <WidgetGameTabPreviewAchievements />-->
        <WidgetGameTabPreviewStatistics />
    </div>
</template>

<script setup lang="ts">
const page = useGamePageStore();
</script>

<style scoped lang="scss" src="./game-preview.styles.scss" />
