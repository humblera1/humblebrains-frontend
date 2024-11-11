<template>
    <div :class="messageClasses">
        <p class="game-message__text">{{ game.message.translatable ? $t(game.message.text) : game.message.text }}</p>
    </div>
</template>

<script setup lang="ts">
const game = useGameStore();

const messageClasses = computed(() => {
    return [
        'game-message',
        {
            'game-message_visible': game.isMessageSet(),
        },
    ];
});
</script>

<style scoped lang="scss" src="./game-ui-message.scss"></style>
