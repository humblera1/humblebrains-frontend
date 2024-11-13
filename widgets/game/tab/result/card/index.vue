<template>
    <div class="card" :class="{ card_completed: isCompleted }">
        <div class="card__body">
            <div class="card__image">
                <NuxtImg :src="imageSrc" :alt="title" />
            </div>
            <div class="card__info">
                <p class="card__title">{{ title }}</p>
                <template v-if="isCompleted">
                    <p class="card__subtitle">
                        {{ $t('score') + ': ' + score }}
                    </p>
                </template>
                <template v-else>
                    <WidgetGameUiProgress v-if="current && max" :current="current" :max="max" size="small" />
                </template>
            </div>
        </div>
        <div class="card__footer">
            <template v-if="isCompleted">
                <div class="card__controls">
                    <div class="card__check">
                        <IconGameCheck />
                    </div>
                    <UiButton :theme="'gray-blue'">
                        <template #leading>
                            <IconRepeat />
                        </template>
                        {{ $t('repeat') }}
                    </UiButton>
                </div>
            </template>
            <template v-else>
                <UiButton>
                    {{ $t('nextOne') }}
                    <template #trailing>
                        <IconArrowLeft />
                    </template>
                </UiButton>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { GameResultCardProps } from '~/widgets/game/tab/result/card/game-result-card.types';

const { image, score } = defineProps<GameResultCardProps>();

const isCompleted = computed((): boolean => {
    return score !== undefined;
});

const imageSrc = computed((): string => {
    return image ?? '/images/games/default-game-image.png';
});
</script>

<style scoped lang="scss" src="./game-result-card.styles.scss" />
