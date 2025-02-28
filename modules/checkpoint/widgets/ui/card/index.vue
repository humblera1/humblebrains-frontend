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
                        {{ $t(stage.category.name) }}
                    </div>
                    <div class="card__text">
                        {{ $t(description) }}
                    </div>
                </div>
            </div>
            <div class="card__footer">
                <div v-if="stage.isCompleted" class="card__result">
                    <p class="card__message">{{ $t('completed') }}!</p>
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
                    <UiButton v-if="type === 'stage'" :to="to"> {{ $t('start') }} </UiButton>
                    <UiButton v-else :to="to">
                        {{ $t('toTheNext') }}
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
import type { CheckpointUiCardProps } from '~/modules/checkpoint/widgets/ui/card/checkpoint-ui-card.types';
import { CognitiveCategoryEnum } from '~/entities/enums/cognitiveCategoryEnum';

const { stage, type = 'stage' } = defineProps<CheckpointUiCardProps>();

const localePath = useLocalePath();

const mode = useColorMode();

const cardClass = computed((): string => {
    return stage.isCompleted ? 'card_completed' : '';
});

const imageSrc = computed((): string => {
    const imageName = mode.value === 'dark' ? `${stage.category.name}-dark` : stage.category.name;

    return `/images/categories/${imageName}.png`;
});

const to = computed((): string => {
    return localePath(`/checkpoint/${stage.category.name}`);
});

// todo: в дальнейшем получаем перевод с бэка
const description = computed((): string => {
    switch (stage.category.name) {
        case CognitiveCategoryEnum.memory:
            return 'checkpoint:memoryShortDescription';
        case CognitiveCategoryEnum.attention:
            return 'checkpoint:attentionShortDescription';
        case CognitiveCategoryEnum.logic:
            return 'checkpoint:logicShortDescription';
    }

    return 'description';
});
</script>

<style scoped lang="scss" src="./checkpoint-ui-card.styles.scss" />
