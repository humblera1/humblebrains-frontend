<template>
    <div class="checkpoint-layout">
        <div class="checkpoint-layout__inner">
            <WidgetCheckpointUiHeader />
            <WidgetCheckpointUiMessage />
            <section class="checkpoint-layout__field" :class="fieldClass">
                <slot />
            </section>
            <WidgetCheckpointUiPrompt />
            <WidgetCheckpointUiFooter />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useCheckpointStore } from '~/modules/checkpoint/stores/checkpointStore';

const checkpoint = useCheckpointStore();

const fieldClass = computed((): string => {
    return checkpoint.isInPauseState() ? 'checkpoint-layout__field_hidden' : '';
});
</script>

<style scoped lang="scss" src="./checkpoint-ui-layout.styles.scss" />
