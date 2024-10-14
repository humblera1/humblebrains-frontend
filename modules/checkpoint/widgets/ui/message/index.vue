<template>
    <div :class="messageClasses">
        <p class="checkpoint-message__text">{{ needToTranslate() ? $t(checkpoint.message) : checkpoint.message }}</p>
    </div>
</template>

<script setup lang="ts">
import { useCheckpointStore } from '~/modules/checkpoint/stores/checkpointStore';

const checkpoint = useCheckpointStore();

// Не переводим, если сообщение не задано или содержит только число
const needToTranslate = () => {
    return typeof checkpoint.message === 'string' && checkpoint.message !== '';
};

const messageClasses = computed(() => {
    return [
        'checkpoint-message',
        {
            'checkpoint-message_visible': checkpoint.isMessageSet() && !checkpoint.isInPauseState(),
        },
    ];
});
</script>

<style scoped lang="scss">
.checkpoint-message {
    min-height: 24px;
    opacity: 0;
    transition: opacity 250ms ease;

    &__text {
        @include mainFont(500, 20, var(--text-primary));

        @include tablet {
            font-size: 18px;
        }

        @include mobile {
            font-size: 16px;
        }
    }

    &_visible {
        opacity: 1;
    }
}
</style>
