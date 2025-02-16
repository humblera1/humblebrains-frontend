<template>
    <div class="catalog">
        <header class="catalog__header">
            <h1 class="title catalog__title">{{ $t('gamesList') }}</h1>
            <WidgetGameFilters v-model="categories" />
        </header>
        <div class="catalog__content">
            <Transition name="load" mode="out-in">
                <div v-if="isSuccess && data" class="catalog__list">
                    <WidgetGameCard v-for="game in data" :key="game.id" :game="game" />
                </div>
                <div v-else class="catalog__absence">
                    <UiPreloader />
                </div>
            </Transition>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { BaseResponse } from '~/entities/interfaces/responses/BaseResponse';
import type { IGamePreview } from '~/entities/interfaces/games/IGamePreview';

const { $api } = useNuxtApp();

const categories = ref<number[]>([]);

const { status, data, refresh } = await useLazyAsyncData('games', async () => {
    const response = await $api<BaseResponse<IGamePreview[]>>('/v1/games', {
        credentials: 'include',
        params: {
            'categoryIds[]': categories.value,
        },
    });

    return response.data;
});

watch(
    categories,
    () => {
        refresh();
    },
    { deep: true },
);

const isSuccess = computed((): boolean => status.value === 'success');
</script>

<style scoped lang="scss" src="./game-catalog.styles.scss" />
