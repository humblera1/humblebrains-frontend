<template>
    <UiModal position="bottom" without-close-btn>
        <div class="menu-modal">
            <WidgetSidebar />
            <div class="menu-modal__controls">
                <WidgetLanguageSelect />
                <WidgetColorMode />
            </div>
        </div>
    </UiModal>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss" src="./menu-modal.styles.scss"></style>
