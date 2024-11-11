<template>
    <div class="game-pause" @click="setPause">
        <IconGamePause />
    </div>
</template>

<script setup lang="ts">
import { WidgetModalPauseGame } from '#components';

const game = useGameStore();

const { openModal } = useHumbleModal({ closeOnClickOutside: false, closeOnEsc: false });

const setPause = () => {
    game.setPause();
    openModal(WidgetModalPauseGame);
};
</script>

<style scoped lang="scss" src="./game-ui-pause.styles.scss" />
