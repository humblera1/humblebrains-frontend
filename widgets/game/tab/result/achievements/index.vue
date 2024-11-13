<template>
    <div ref="container" class="achievements">
        <Transition name="fade" mode="out-in">
            <!--            <div v-if="isSuccess" ref="inner" class="achievements__inner">-->
            <div v-if="isSuccess" ref="inner" class="achievements__inner" :style="innerStyle">
                <TransitionGroup name="achievement">
                    <WidgetGameUiAchievement
                        v-for="achievement in visibleAchievements"
                        :key="achievement.type"
                        :type="achievement.type"
                        :text="achievement.content"
                    />
                </TransitionGroup>
            </div>
            <div v-else class="achievements__preloader">
                <UiPreloader />
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { useElementSize } from '@vueuse/core';
import type { BaseResponse } from '~/entities/interfaces/responses/BaseResponse';
import type { IAchievement } from '~/entities/interfaces/games/IAchievement';

const { $api } = useNuxtApp();

const page = useGamePageStore();

const emit = defineEmits(['rendered']);

const visibleAchievements = ref<IAchievement[]>([]);

const container = ref(null);
const inner = ref(null);
const { width: containerWidth } = useElementSize(container);

const { status, data: achievements } = await useLazyAsyncData('total-achievements', async () => {
    const response = await $api<BaseResponse<IAchievement[]>>(`/v1/games/${page.game}/achievements`, {
        credentials: 'include',
    });

    return response.data;
});

const displayAchievements = async () => {
    if (!achievements.value) return;

    await new Promise((resolve) => setTimeout(resolve, 500));

    for (const achievement of achievements.value) {
        visibleAchievements.value.push(achievement);
        await new Promise((resolve) => setTimeout(resolve, 750));
    }

    emit('rendered');
};

const isSuccess = computed((): boolean => status.value === 'success');

const innerStyle = computed(() => {
    let width = 1098;
    switch (true) {
        case containerWidth.value < 725:
            width = 350;
            break;
        case containerWidth.value < 1098:
            width = 725;
            break;
    }

    return { maxWidth: `${width}px` };
});

watch(status, (value) => {
    if (value === 'success') {
        displayAchievements();
    }
});
</script>

<style scoped lang="scss" src="./game-result-achievements.styles.scss" />
