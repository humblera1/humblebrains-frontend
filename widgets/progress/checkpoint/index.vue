<template>
    <div class="progress-checkpoint">
        <h1 class="title progress-checkpoint__title">{{ $t('checkpoint') }}</h1>
        <header class="progress-checkpoint__header">
            <WidgetCheckpointUiBanner />
            <WidgetCheckpointUiSteps v-if="!device.isMobileOrTablet" />
        </header>
        <div class="progress-checkpoint__body" :class="{ 'progress-checkpoint__body_mobile': device.isMobile }">
            <template v-if="device.isMobile">
                <Swiper
                    :modules="[Pagination]"
                    :centered-slides="true"
                    :slides-per-view="1"
                    :pagination="{
                        clickable: true,
                    }"
                >
                    <SwiperSlide v-for="stage in user.stages.slice().reverse()" :key="stage.id">
                        <WidgetCheckpointUiCard :stage="stage" />
                    </SwiperSlide>
                </Swiper>
            </template>
            <template v-else>
                <WidgetCheckpointUiCard v-for="stage in user.stages" :key="stage.id" :stage="stage" />
            </template>
        </div>
        <UiButton v-if="isAllStagesCompleted" class="progress-checkpoint__button" @click="openModal(WidgetModalCompletionCheckpoint)">
            {{ $t('finish') }}
        </UiButton>
    </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper/modules';
import { useUserStore } from '~/modules/user/stores/userStore';
import 'swiper/css';
import 'swiper/css/pagination';
import { WidgetModalCompletionCheckpoint } from '#components';

const user = useUserStore();

const device = useDevice();

const { openModal } = useHumbleModal();

const isAllStagesCompleted = computed((): boolean => {
    return user.stages.every((stage) => stage.isCompleted);
});
</script>

<style scoped lang="scss" src="./progress-checkpoint.styles.scss" />
