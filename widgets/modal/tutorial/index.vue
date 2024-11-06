<template>
    <UiModal>
        <div class="tutorial-modal">
            <Transition name="load" mode="out-in">
                <div v-if="isSuccess && data" class="tutorial-modal__content">
                    <div class="tutorial-modal__icon">
                        <IconGameGraduationCap />
                    </div>
                    <div class="tutorial-modal__title">
                        {{ data.game }}
                    </div>
                    <UiText :title="$t('rules')" :text="data.tutorial.content" class="tutorial-modal__text" />
                </div>
                <UiPreloader v-else />
            </Transition>
        </div>
    </UiModal>
</template>

<script setup lang="ts">
import type { BaseResponse } from '~/entities/interfaces/responses/BaseResponse';
import type { IGameTutorial } from '~/entities/interfaces/games/IGameTutorial';

const page = useGamePageStore();

const { $api } = useNuxtApp();

const { status, data } = await useLazyAsyncData('game-tutorial', async () => {
    const response = await $api<BaseResponse<IGameTutorial>>(`/v1/games/${page.game}/tutorial`);

    return response.data;
});

const isSuccess = computed((): boolean => status.value === 'success');
</script>

<style scoped lang="scss" src="./tutorial-modal.styles.scss" />
