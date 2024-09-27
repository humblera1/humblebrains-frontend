<template>
    <div class="game-layout">
        <div class="game-layout__inner">
            <section class="game-layout__header">
                <div class="game-layout__widgets">
                    <WidgetGameUiLevel />
                    <WidgetGameUiScore />
                    <WidgetGameUiTime />
                </div>
                <div class="game-layout__timeline">
                    <WidgetGameUiTimeline />
                </div>
            </section>
            <section class="game-layout__field">
                <slot />
            </section>
        </div>
        <WidgetGameUiCountdown />
    </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss" src="./game-ui-layout.styles.scss"></style>
