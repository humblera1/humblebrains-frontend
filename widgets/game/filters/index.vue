<template>
    <div class="game-filters">
        <div class="game-filters__container"></div>
        <div class="game-filters__controls" @click="toggleList">
            <IconFunnel class="game-filters__funnel" />
            <p class="game-filters__title">
                {{ $t('filters') }}
            </p>
        </div>
        <Transition name="fade">
            <div v-show="isListOpened" class="game-filters__list">
                <ul v-if="isSuccess" class="game-filters__select">
                    <li
                        v-for="category in categories"
                        :key="category.id"
                        :class="['game-filters__option', { 'game-filters__option_active': model?.includes(category.id) }]"
                        @click="selectCategory(category.id)"
                    >
                        <input :id="category.name" v-model="model" type="checkbox" :value="category.id" class="game-filters__input" />
                        <span class="game-filters__item">
                            <span class="game-filters__icon">
                                <component :is="getCategoryIcon(category.name)" :key="category.name" />
                            </span>
                            <span class="game-filters__label">{{ category.label }}</span>
                        </span>
                        <span class="game-filters__check">
                            <Transition name="fade">
                                <IconGameCheck v-show="model?.includes(category.id)" />
                            </Transition>
                        </span>
                    </li>
                </ul>
                <UiPreloader v-else />
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { CognitiveAbility } from '~/entities/enums/cognitiveAbility';
import type { BaseResponse } from '~/entities/interfaces/responses/BaseResponse';
import type { IGameCategory } from '~/entities/interfaces/games/IGameCategory';
import { IconCategoryAttention, IconCategoryDefault, IconCategoryLogic, IconCategoryMemory } from '#components';

const { $api } = useNuxtApp();

const isListOpened = ref<boolean>(false);

const model = defineModel<number[]>();

const { status, data: categories } = await useLazyAsyncData('categories', async () => {
    const response = await $api<BaseResponse<IGameCategory[]>>('/v1/categories');

    return response.data;
});

const toggleList = () => {
    isListOpened.value = !isListOpened.value;
};

const selectCategory = (categoryId: number) => {
    if (model.value) {
        const index = model.value.indexOf(categoryId);

        index === -1 ? model.value.push(categoryId) : model.value.splice(index, 1);
    }
};

const getCategoryIcon = (name: string): Component => {
    switch (name) {
        case CognitiveAbility.Memory:
            return IconCategoryMemory;
        case CognitiveAbility.Logic:
            return IconCategoryLogic;
        case CognitiveAbility.Attention:
            return IconCategoryAttention;
        default:
            return IconCategoryDefault;
    }
};

const isSuccess = computed((): boolean => status.value === 'success');
</script>

<style scoped lang="scss">
.game-filters {
    position: relative;
    display: flex;
    width: 100%;

    &__container {
        display: flex;
        justify-content: flex-end;
        width: 100%;
    }

    &__controls {
        cursor: pointer;
        display: flex;
        gap: 8px;
        align-items: center;

        &:hover {
            .game-filters__title {
                color: var(--primary-subtitle-hovered);
            }
        }
    }

    &__title {
        transition: color 500ms ease;
        @include mainFont(500, 16, var(--primary-subtitle));

        @include mobile {
            @include mainFont(400, 14, var(--primary-subtitle));
        }
    }

    &__funnel {
        transition: color 500ms ease;
        color: var(--primary-subtitle);
        width: 18px;
        height: 16px;
    }

    &__list {
        position: absolute;
        top: 100%;
        margin-top: 8px;
        right: 0;
        border-radius: 12px;
        padding: 18px 12px;
        background-color: var(--badge-bg);

        @include mainShadow();
    }

    &__option {
        position: relative;
        display: flex;
        justify-content: space-between;
        gap: 12px;
        align-items: center;
        padding: 10px 20px;
        border-radius: 12px;
        transition: all 0.25s ease;
        color: var(--primary-subtitle);

        @include mainFont(600, 16, var(--primary-subtitle));

        &:hover {
            background-color: var(--blue-badge);
            color: var(--primary-subtitle-hovered);
        }

        &_active {
            color: var(--primary-subtitle-hovered);
            //background-color: var(--secondary-bg);
            //color: var(--text-primary-80);
        }
    }

    &__item {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    &__icon {
        width: 14px;
        height: 14px;

        svg {
            object-fit: contain;
            width: 100%;
            height: 100%;
        }
    }

    &__label {
    }

    &__check {
        display: flex;
        width: 10px;
        height: 10px;
        color: var(--primary-subtitle-hovered);

        svg {
            object-fit: contain;
            width: 100%;
            height: 100%;
        }
    }

    &__input {
        cursor: pointer;
        position: absolute;
        opacity: 0;
        width: 100%;
        height: 100%;
    }
}
</style>
