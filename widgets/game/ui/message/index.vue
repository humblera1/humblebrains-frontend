<template>
    <div :class="messageClasses">
        <p class="game-message__text">{{ $t(message) }}</p>
    </div>
</template>

<script setup lang="ts">
const game = useGameStore();

const messageClasses = computed(() => {
    return [
        'game-message',
        {
            'game-message_visible': game.isInLevelFinishingState(),
        },
    ];
});

const message = computed((): string => {
    switch (true) {
        case game.isInLevelDemotionState():
            return 'levelDown';
        case game.isInLevelPromotionState():
            return 'levelUp';
        default:
            return '';
    }
});
</script>

<style scoped lang="scss" src="./game-ui-message.scss"></style>
