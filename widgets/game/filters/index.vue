<template>
    <div class="game-filters">
        <div class="game-filters__container">
            <TransitionGroup name="scale">
                <WidgetGameFiltersCategory
                    v-for="category in selectedCategories"
                    :id="category.id"
                    :key="category.id"
                    :label="category.label"
                    :icon="getCategoryIcon(category.name)"
                    @unselect="unselectCategory"
                />
            </TransitionGroup>
        </div>
        <div ref="control" class="game-filters__controls" @click="toggleList">
            <IconFunnel class="game-filters__funnel" />
            <span v-show="hasActiveFilters" class="game-filters__marker"></span>
            <p class="game-filters__title">
                {{ $t('filters') }}
            </p>
        </div>
    </div>
    <Transition name="fade">
        <div v-show="isListOpened" ref="list" class="game-filters__list">
            <ul v-if="isSuccess">
                <li
                    v-for="category in categories"
                    :key="category.id"
                    :class="['game-filters__option', { 'game-filters__option_active': model?.includes(category.id) }]"
                    @click="toggleCategory(category)"
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
</template>

<script setup lang="ts">
import { CognitiveAbility } from '~/entities/enums/cognitiveAbility';
import type { BaseResponse } from '~/entities/interfaces/responses/BaseResponse';
import type { IGameCategory } from '~/entities/interfaces/games/IGameCategory';
import { IconCategoryAttention, IconCategoryDefault, IconCategoryLogic, IconCategoryMemory } from '#components';

const { $api } = useNuxtApp();

const isListOpened = ref<boolean>(false);

const model = defineModel<number[]>();
const selectedCategories = ref<IGameCategory[]>([]);

const list = ref<HTMLElement | null>(null);
const control = ref<HTMLElement | null>(null);

const { status, data: categories } = await useLazyAsyncData('categories', async () => {
    const response = await $api<BaseResponse<IGameCategory[]>>('/v1/categories');

    return response.data;
});

const hasActiveFilters = computed((): boolean => {
    return selectedCategories.value.length > 0;
});

const toggleList = () => {
    isListOpened.value = !isListOpened.value;
};

const toggleCategory = (category: IGameCategory) => {
    if (model.value) {
        const index = model.value.indexOf(category.id);

        if (index === -1) {
            model.value.push(category.id);
            selectedCategories.value.push(category);

            return;
        }

        model.value.splice(index, 1);
        selectedCategories.value.splice(index, 1);
    }
};

const unselectCategory = (categoryId: number) => {
    if (model.value) {
        const index = model.value.indexOf(categoryId);

        model.value.splice(index, 1);
        selectedCategories.value.splice(index, 1);
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

const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node;
    if (isListOpened.value && list.value && control.value && !list.value.contains(target) && !control.value.contains(target)) {
        isListOpened.value = false;
    }
};

const isSuccess = computed((): boolean => status.value === 'success');

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped lang="scss" src="./game-filters.styles.scss" />
