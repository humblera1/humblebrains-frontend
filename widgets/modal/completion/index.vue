<template>
    <UiModal>
        <div class="completion">
            {{ type + ' completed!' }}
        </div>
    </UiModal>
</template>

<script setup lang="ts">
import type { CompletionModalProps } from '~/widgets/modal/completion/completion-modal.types';

defineProps<CompletionModalProps>();
</script>

<style scoped lang="scss">

</style>