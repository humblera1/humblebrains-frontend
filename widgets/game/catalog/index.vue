<template>
    <div class="catalog">
        <header class="catalog__header">
            <h1 class="title catalog__title">{{ $t('gamesList') }}</h1>
            <WidgetGameFilters v-model="categories" />
        </header>
        <div class="catalog__content">
            <Transition name="load" mode="out-in">
                <div v-if="isSuccess && data" class="catalog__list">
                    {{ data }}
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
import type { IGameDetails } from '~/entities/interfaces/games/IGameDetails';

const { $api } = useNuxtApp();

const categories = ref<number[]>([]);

const { status, data, refresh } = await useLazyAsyncData('games', async () => {
    const response = await $api<BaseResponse<IGameDetails>>('/v1/games', {
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

<style scoped lang="scss">
.catalog {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    gap: 36px;

    &__title {
        display: flex;
        align-items: center;
        width: 100%;
        white-space: nowrap;
    }

    &__header {
        position: relative;
        display: grid;
        grid-template-columns: 1fr 3fr;
        justify-content: space-between;
        gap: 36px;
        width: 100%;

        @include tablet {
            grid-template-columns: 1fr;
            gap: 8px;
        }
    }

    &__content {
        display: flex;
        height: 100%;
    }

    &__list {
    }

    &__absence {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    }
}
</style>
