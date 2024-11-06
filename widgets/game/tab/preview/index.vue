<template>
    <div v-if="page.game" class="preview">
        <div class="preview__info">
            <WidgetGameTabPreviewInfo />
        </div>
        <div class="preview__stats">
            <WidgetGameTabPreviewAchievements />
            <WidgetGameTabPreviewStatistics />
        </div>
    </div>
</template>

<script setup lang="ts">
const page = useGamePageStore();
</script>

<style scoped lang="scss" src="./game-preview.styles.scss" />
