<template>
    <NuxtLayout>
        <div class="games">
            <header class="games__header">
                <h1 class="games__title">{{ $t('gamesList') }}</h1>
            </header>
        </div>
    </NuxtLayout>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.games {
    display: flex;
    flex-direction: column;
    gap: 36px;

    &__header {
        display: flex;
        justify-content: space-between;
    }

    &__title {
        @include mainFont(600, 24, var(--text-primary));
    }
}
</style>
