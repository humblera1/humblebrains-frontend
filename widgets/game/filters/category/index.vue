<template>
    <div class="category">
        <div class="category__content">
            <div class="category__icon">
                <component :is="icon" />
            </div>
            <div class="category__label">
                {{ label }}
            </div>
        </div>
        <div class="category__cross" @click="emit('unselect', id)">
            <IconCross />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { FilterCategoryProps } from '~/widgets/game/filters/category/filter-category.types';

defineProps<FilterCategoryProps>();
const emit = defineEmits(['unselect']);
</script>

<style scoped lang="scss" src="./filter-category.styles.scss" />
