<template>
    <div :class="messageClasses">
        <p class="checkpoint-message__text">{{ checkpoint.isMessageSet() ? $t(checkpoint.getMessage()) : '' }}</p>
    </div>
</template>

<script setup lang="ts">
import { useCheckpointStore } from '~/modules/checkpoint/stores/checkpointStore';

const checkpoint = useCheckpointStore();

const messageClasses = computed(() => {
    return [
        'checkpoint-message',
        {
            'checkpoint-message_visible': checkpoint.isMessageSet(),
        },
    ];
});
</script>

<style scoped lang="scss">
.checkpoint-message {
    min-height: 24px;
    opacity: 0;
    transition: opacity 250ms linear;

    &__text {
        @include mainFont(500, 20, var(--text-primary));

        @include tablet {
            font-size: 16px;
        }

        @include mobile {
            font-size: 14px;
        }
    }

    &_visible {
        opacity: 1;
    }
}
</style>
