<template>
    <div :class="countdownClasses">
        <p class="game-countdown__text">{{ gameStore.countdown }}</p>
    </div>
</template>

<script setup lang="ts">
const gameStore = useGameStore();

const isCountdownVisible = computed(() => {
    return gameStore.isCountdownState();
});

const countdownClasses = computed(() => {
    return [
        'game-countdown',
        {
            'game-countdown_visible': isCountdownVisible.value,
        },
    ];
});
</script>

<style scoped lang="scss" src="./game-ui-countdown.styles.scss"></style>
