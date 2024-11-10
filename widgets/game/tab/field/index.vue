<template>
    <WidgetGameUiLayout>
        <template v-if="page.isLoading">
            <UiPreloader />
        </template>
        <template v-else>
            <component :is="page.resolvedComponent" v-if="isUserReady" key="gameComponent" />
            <div v-else class="field__controls">
                <WidgetGameControls />
                <div class="field__buttons">
                    <div class="field__tutorial" @click="showTutorial">
                        <IconGameGraduationCap />
                        <p>{{ $t('showTutorial') }}</p>
                    </div>
                    <UiButton @click="startGame"> {{ $t('letsGo') }} </UiButton>
                </div>
            </div>
        </template>
    </WidgetGameUiLayout>
</template>

<script setup lang="ts">
import { WidgetModalTutorial } from '#components';

const { openModal } = useHumbleModal();

const page = useGamePageStore();

const isUserReady = ref<boolean>(false);

page.resolveComponent();

const showTutorial = () => {
    openModal(WidgetModalTutorial);
};

const startGame = () => {
    isUserReady.value = true;
};
</script>

<style scoped lang="scss" src="./game-field.styles.scss" />
