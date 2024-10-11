<template>
    <div class="prompt" :class="promptClass">
        <div class="prompt__content">
            <p class="prompt__text">
                {{ $t(checkpoint.promptContent) }}
            </p>
        </div>
        <p class="prompt__controls" @click="checkpoint.closePrompt">
            {{ $t('ok') }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { useCheckpointStore } from '~/modules/checkpoint/stores/checkpointStore';

const checkpoint = useCheckpointStore();

const promptClass = computed((): string => {
    return checkpoint.isInPromptState() ? 'prompt_visible' : '';
});
</script>

<style scoped lang="scss" src="./checkpoint-ui-prompt.styles.scss" />
