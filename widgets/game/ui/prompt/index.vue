<template>
    <div class="prompt" :class="promptClass">
        <div class="prompt__content">
            <p class="prompt__text">
                {{ game.prompt.translatable ? $t(game.prompt.content) : game.prompt.content }}
            </p>
        </div>
        <p class="prompt__controls" @click="game.closePrompt">
            {{ $t('ok') }}
        </p>
    </div>
</template>

<script setup lang="ts">
const game = useGameStore();

const promptClass = computed((): string => {
    return game.isInPromptState() ? 'prompt_visible' : '';
});
</script>

<style scoped lang="scss" src="./game-ui-prompt.styles.scss" />
