<template>
    <section class="checkpoint-header">
        <WidgetCheckpointUiPause />
        <div class="checkpoint-header__step">
            <WidgetCheckpointUiStep />
        </div>
        <div class="checkpoint-header__widgets">
            <WidgetCheckpointUiProgress />
            <WidgetCheckpointUiTime />
        </div>
    </section>
</template>

<script setup lang="ts" />

<style scoped lang="scss" src="./checkpoint-ui-header.scss" />
