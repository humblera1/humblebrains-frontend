<template>
    <UiModal>
        <div class="completion">
            <div class="completion__icon">
                <IconPieChart v-if="type === CompletionModalTypeEnum.session" />
                <IconBlankWithPencil v-else />
            </div>
            <div class="completion__info">
                <p class="completion__title">{{ $t(title) }}</p>
                <p class="completion__subtitle">{{ $t(subtitle) }}</p>
            </div>
            <UiButton class="completion__button">
                <template #leading>
                    <IconUser v-if="type === CompletionModalTypeEnum.session" />
                    <IconPieChart v-else />
                </template>
                {{ $t('goTo') }}
            </UiButton>
        </div>
    </UiModal>
</template>

<script setup lang="ts">
import type { CompletionModalProps } from '~/widgets/modal/completion/completion-modal.types';
import { CompletionModalTypeEnum } from '~/entities/enums/games/CompletionModalTypeEnum';

const { type } = defineProps<CompletionModalProps>();

const title = computed((): string => {
    switch (type) {
        case CompletionModalTypeEnum.session:
            return 'sessionCompleted';
        case CompletionModalTypeEnum.program:
            return 'programCompleted';
    }
});

const subtitle = computed((): string => {
    switch (type) {
        case CompletionModalTypeEnum.session:
            return 'sessionCompletedInfo';
        case CompletionModalTypeEnum.program:
            return 'programCompletedInfo';
    }
});
</script>

<style scoped lang="scss" src="./completion-modal.styles.scss" />
