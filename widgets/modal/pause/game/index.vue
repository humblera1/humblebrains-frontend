<template>
    <UiModal without-close-btn>
        <div class="pause-modal">
            <div class="pause-modal__header">
                <p class="pause-modal__title">{{ $t('pause') }}</p>
                <div class="pause-modal__info">
                    <IconGameTarget />
                    <p class="pause-modal__subtitle">{{ game.gameName }}</p>
                </div>
            </div>
            <div class="pause-modal__content">
                <ul class="pause-modal__menu">
                    <UiListItem title="showRules" :icon="IconGameGraduationCap" @selected="showRules" />
                    <UiListItem title="quit" :icon="IconGameLeftToBracket" @selected="quit" />
                </ul>
                <UiButton @click="close">{{ $t('continue') }}</UiButton>
            </div>
        </div>
    </UiModal>
</template>

<script setup lang="ts">
import { IconGameGraduationCap, IconGameLeftToBracket } from '#components';

const game = useGameStore();

const localePath = useLocalePath();

const { closeModal } = useHumbleModal();

const showRules = () => {
    // todo...
};

const quit = () => {
    closeModal();
    navigateTo(localePath('/games'));
};

const close = () => {
    game.endPause();
    closeModal();
};
</script>

<style scoped lang="scss" src="./pause-game-modal.styles.scss" />
