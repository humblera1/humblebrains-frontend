<template>
    <ul class="game-filters">
        <li
            v-for="ability in abilities"
            :key="ability"
            :class="['game-filters__item', { 'game-filters__item_active': model && model.includes(ability) }]"
        >
            <input :id="ability" v-model="model" type="checkbox" :value="ability" class="game-filters__input" />
            <span class="game-filters__label">{{ $t(ability) }}</span>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { CognitiveAbility } from '~/entities/enums/cognitiveAbility';

const model = defineModel<string[]>();

const abilities = Object.keys(CognitiveAbility).filter((item) => isNaN(Number(item)));
</script>

<style scoped lang="scss">
.game-filters {
    display: flex;
    gap: 12px;

    &__item {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px 20px;
        border-radius: 12px;
        border: 1px solid var(--border-primary);
        transition: all 0.25s ease;

        @include mainFont(600, 16, var(--text-primary-60));

        &_active {
            background-color: var(--secondary-bg);
            border-color: var(--secondary-bg);
            color: var(--text-primary-80);

            @include mainShadow();
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
