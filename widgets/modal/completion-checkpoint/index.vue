<template>
    <UiModal>
        <div class="completion-checkpoint">
            <Transition name="load" mode="out-in">
                <template v-if="isSuccess">
                    <p class="completion-checkpoint__title">{{ $t('saved') }}</p>
                </template>
                <template v-else-if="isPending">
                    <UiPreloader />
                </template>
                <template v-else>
                    <div class="completion-checkpoint__content">
                        <div class="completion-checkpoint__body">
                            <div class="completion-checkpoint__image">
                                <IconPieChart v-if="hasDuplicateScores" />
                                <NuxtImg v-else :src="priorityStageImage" :alt="priorityStage.category.label" />
                            </div>
                            <div class="completion-checkpoint__info">
                                <p class="completion-checkpoint__title">{{ $t(title) + ': ' + priorityStage.category.label }}</p>
                                <p class="completion-checkpoint__subtitle">{{ $t(subtitle) }}</p>
                            </div>
                            <div class="completion-checkpoint__select">
                                <UiSelect
                                    :options="selectOptions"
                                    :default-option="defaultOption"
                                    placeholder="selectCategory"
                                    @selected="handleSelect"
                                />
                            </div>
                        </div>
                        <div class="completion-checkpoint__button">
                            <UiButton :disabled="selectedOption === undefined" @click="handleConfirm"> {{ $t('confirm') }} </UiButton>
                        </div>
                    </div>
                </template>
            </Transition>
        </div>
    </UiModal>
</template>

<script setup lang="ts">
import { useUserStore } from '~/modules/user/stores/userStore';
import type { ICheckpointStage } from '~/modules/checkpoint/entities/interfaces/ICheckpointStage';
import type { SelectOption } from '~/entities/types/SelectOption';
import { useCheckpointService } from '#imports';
import type { CognitiveCategoryEnum } from '~/entities/enums/cognitiveCategoryEnum';

const user = useUserStore();
const service = useCheckpointService();

const { closeModal, isOpen } = useHumbleModal();

const isPending = ref<boolean>(false);
const isSuccess = ref<boolean>(false);

const selectedOption = ref<SelectOption>();
const defaultOption = ref<SelectOption>();

const hasDuplicateScores = computed((): boolean => {
    const scores: number[] = [];

    for (const stage of user.stages) {
        if (scores.includes(stage.score)) {
            return true;
        }

        scores.push(stage.score);
    }

    return false;
});

const priorityStage = computed((): ICheckpointStage => {
    return user.stages.reduce((minItem, currentItem) => {
        return currentItem.score < minItem.score ? currentItem : minItem;
    }, user.stages[0]);
});

const selectOptions = computed((): SelectOption[] => {
    const options: SelectOption[] = [];

    for (const stage of user.stages) {
        options.push({
            value: stage.category.name,
            label: `${stage.category.label} — ${stage.score}%`,
        });
    }

    return options;
});

const priorityStageImage = computed((): string => {
    return `/images/categories/${priorityStage.value.category.name}.png`;
});

const title = computed((): string => {
    if (hasDuplicateScores.value) {
        return 'choosePriority';
    }

    return 'yourPriorityIs';
});

const subtitle = computed((): string => {
    if (hasDuplicateScores.value) {
        return 'choosePriorityDescription';
    }

    return 'yourPriorityIsDescription';
});

const handleSelect = (option: SelectOption) => {
    selectedOption.value = option;
};

const handleConfirm = async () => {
    if (selectedOption.value) {
        isPending.value = true;

        try {
            const response = await service.finishCheckpoint(selectedOption.value.value as CognitiveCategoryEnum);

            user.setProgramData(response.data.program);
            user.completeCheckpoint(response.data.time);

            isSuccess.value = true;
            isPending.value = false;

            setTimeout(() => {
                if (isOpen.value) {
                    closeModal();
                }
            }, 2000);
        } catch {
            console.log('error');
        }
    }
};

onMounted(() => {
    if (!hasDuplicateScores.value) {
        const option: SelectOption = {
            value: priorityStage.value.category.name,
            label: `${priorityStage.value.category.label} — ${priorityStage.value.score}%`,
        };

        defaultOption.value = option;
        selectedOption.value = option;
    }
});
</script>

<style scoped lang="scss" src="./completion-checkpoint-modal.styles.scss" />
