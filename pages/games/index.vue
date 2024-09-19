<template>
    <NuxtLayout>
        <div class="games">
            <header class="games__header">
                <h1 class="games__title">{{ $t('gamesList') }}</h1>
                <WidgetGameFilters v-model="filters" />
            </header>
        </div>
    </NuxtLayout>
</template>

<script setup lang="ts">
const filters = ref<string[]>([]);
</script>

<style scoped lang="scss">
.games {
    display: flex;
    flex-direction: column;
    width: 100%;
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
