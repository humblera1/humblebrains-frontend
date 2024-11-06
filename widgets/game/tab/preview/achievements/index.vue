<template>
    <div :class="['total-achievements', { 'total-achievements_pending': isPending }]">
        <h2 class="total-achievements__title">
            {{ $t('totalAchievements') }}
        </h2>
        <Transition name="load" mode="out-in">
            <template v-if="isSuccess && data">
                <div v-if="data.length" class="total-achievements__container">
                    <WidgetGameUiTotalAchievement
                        v-for="achievement in data"
                        :key="achievement.type"
                        :type="achievement.type"
                        :text="achievement.content"
                    />
                </div>
                <div v-else class="total-achievements__void">
                    <div class="total-achievements__icon">
                        <IconGameReward />
                    </div>
                    <p class="total-achievements__message">
                        {{ $t('startGettingTotalAchievements') }}
                    </p>
                    <UiButton> {{ $t('start') }} </UiButton>
                </div>
            </template>
            <template v-else>
                <UiPreloader />
            </template>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import type { BaseResponse } from '~/entities/interfaces/responses/BaseResponse';
import type { ITotalAchievement } from '~/entities/interfaces/games/ITotalAchievement';

const page = useGamePageStore();

const { $api } = useNuxtApp();

const { status, data } = await useLazyAsyncData('total-achievements', async () => {
    const response = await $api<BaseResponse<ITotalAchievement[]>>(`/v1/games/${page.game}/total-achievements`, {
        credentials: 'include',
    });

    return response.data;
});

const isPending = computed((): boolean => status.value === 'pending');
const isSuccess = computed((): boolean => status.value === 'success');
</script>

<style scoped lang="scss" src="./game-preview-achievements.scss" />
