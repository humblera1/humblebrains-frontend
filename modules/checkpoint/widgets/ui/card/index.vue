<template>
    <div class="card" :class="cardClass">
        <!-- todo: logic-category: -->
        <template v-if="stage.category.name === CognitiveCategoryEnum.logic">
            <UiInDevelopment />
        </template>
        <template v-else>
            <div class="card__body">
                <div class="card__image">
                    <NuxtImg :src="imageSrc" :alt="stage.category.name" />
                </div>
                <div class="card__description">
                    <div class="card__title">
                        {{ stage.category.label }}
                    </div>
                    <div class="card__text">
                        {{ stage.category.description }}
                    </div>
                </div>
            </div>
            <div class="card__footer">
                <div v-if="stage.isCompleted" class="card__result">
                    <p class="card__message">Завершено!</p>
                    <div class="card__points">
                        <div class="card__star">
                            <IconStar />
                        </div>
                        <div class="card__score">
                            <span class="card__score_primary">
                                {{ stage.score }}
                            </span>
                            <span> / 100 </span>
                        </div>
                    </div>
                </div>
                <div v-else class="card__controls">
                    <UiButton v-if="type === 'stage'" :to="to"> Пройти </UiButton>
                    <UiButton v-else :to="to">
                        К следующему
                        <template #trailing>
                            <IconArrowLeft />
                        </template>
                    </UiButton>
                </div>
            </div>
            <div v-if="stage.isCompleted" class="card__check">
                <IconCheckCircle />
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { CognitiveCategoryEnum } from '../../../../../entities/enums/cognitiveCategoryEnum';
import type { CheckpointUiCardProps } from '~/modules/checkpoint/widgets/ui/card/checkpoint-ui-card.types';

const { stage, type = 'stage' } = defineProps<CheckpointUiCardProps>();

const localePath = useLocalePath();

const cardClass = computed((): string => {
    return stage.isCompleted ? 'card_completed' : '';
});

const imageSrc = computed((): string => {
    return `/images/categories/${stage.category.name}.png`;
});

const to = computed((): string => {
    return localePath(`/checkpoint/${stage.category.name}`);
});
</script>

<style scoped lang="scss" src="./checkpoint-ui-card.styles.scss" />
