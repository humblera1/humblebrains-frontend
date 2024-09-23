<template>
    <div class="game-layout">
        <section class="game-layout__header">header</section>
        <section class="game-layout__field">
            <slot />
        </section>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.game-layout {
    height: 100%;
    border-radius: 24px;
    background-color: var(--game-field-bg);

    &__header {
    }

    &__field {
        display: flex;
        justify-content: center;
    }
}
</style>
