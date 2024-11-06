<template>
    <div :class="['info', { info_pending: isPending }]">
        <Transition name="load">
            <div v-if="status === 'success' && data" class="info__container">
                <div class="info__body">
                    <div class="info__image">
                        <NuxtImg :src="gameImageUrl" :alt="data.label" />
                    </div>
                    <h1 class="info__title">
                        {{ data.label }}
                    </h1>
                    <WidgetGameUiProgress :current="data.userLevel" :max="data.maxLevel" class="info__progress" />
                    <UiText :title="$t('description')" :text="data.description" class="info__description" />
                    <div class="info__tags">
                        <WidgetGameUiTag v-for="tag in data.tags" :key="tag.id" :tag="tag" />
                    </div>
                </div>
                <div class="info__footer">
                    <template v-if="status === 'success' && data">
                        <div class="info__tutorial" @click="showTutorial">
                            <IconGameGraduationCap />
                            <p>{{ $t('showTutorial') }}</p>
                        </div>
                        <UiButton> {{ $t('start') }} </UiButton>
                    </template>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import type { BaseResponse } from '~/entities/interfaces/responses/BaseResponse';
import type { IGameDetails } from '~/entities/interfaces/games/IGameDetails';
import { WidgetModalTutorial } from '#components';

const { openModal } = useHumbleModal();

const page = useGamePageStore();

const { $api } = useNuxtApp();

const { status, data } = await useLazyAsyncData('game-detail', async () => {
    const response = await $api<BaseResponse<IGameDetails>>(`/v1/games/${page.game}?XDEBUG_SESSION=XDEBUG_ECLIPSE`);

    return response.data;
});

const isPending = computed((): boolean => status.value === 'pending');

const gameImageUrl = computed((): string => {
    return data?.value?.image ? data.value.image : '/images/games/default-game-image.png';
});

const showTutorial = () => {
    openModal(WidgetModalTutorial);
};
</script>

<style scoped lang="scss" src="./game-preview-info.styles.scss" />
