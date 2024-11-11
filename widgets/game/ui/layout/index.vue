<template>
    <div class="game-layout">
        <div class="game-layout__inner">
            <section class="game-layout__header">
                <div class="game-layout__widgets">
                    <WidgetGameUiLevel />
                    <WidgetGameUiScore />
                    <WidgetGameUiTime />
                </div>
                <div class="game-layout__timeline">
                    <IconGameCross :class="crossIconClasses" />
                    <WidgetGameUiTimeline />
                    <IconGameCheck :class="checkIconClasses" />
                </div>
            </section>
            <WidgetGameUiMessage />
            <section class="game-layout__field">
                <slot />
            </section>
            <WidgetGameUiPrompt />
        </div>
        <WidgetGameUiPause />
        <WidgetGameUiCountdown />
    </div>
</template>

<script setup lang="ts">
const game = useGameStore();

const checkIconClasses = computed(() => {
    return [
        'game-layout__check',
        {
            'game-layout__check_visible': game.isInSuccessfulRoundFinishingState(),
        },
    ];
});

const crossIconClasses = computed(() => {
    return [
        'game-layout__cross',
        {
            'game-layout__cross_visible': game.isInFailedRoundFinishingState(),
        },
    ];
});
</script>

<style scoped lang="scss" src="./game-ui-layout.styles.scss"></style>
