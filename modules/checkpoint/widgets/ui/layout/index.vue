<template>
    <div class="checkpoint-layout">
        <div class="checkpoint-layout__inner">
            <WidgetCheckpointUiHeader />
            <section class="checkpoint-layout__field">
                <slot />
            </section>
            <WidgetCheckpointUiFooter />
        </div>
    </div>
</template>

<script setup lang="ts" />

<style scoped lang="scss" src="./checkpoint-ui-layout.styles.scss" />
