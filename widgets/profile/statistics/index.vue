<template>
    <template v-if="status === 'success'">
        <div :class="['statistics', { statistics_empty: !isEnoughData }]">
            <template v-if="isEnoughData">
                <Swiper
                    :modules="[Pagination, Navigation, Mousewheel]"
                    :slides-per-view="'auto'"
                    :space-between="16"
                    :loop="true"
                    :watch-slides-progress="true"
                    :slide-to-clicked-slide="true"
                    :mousewheel="{
                        invert: false,
                        forceToAxis: true,
                    }"
                    :pagination="{
                        enabled: device.isMobile,
                        clickable: true,
                    }"
                    :navigation="{
                        nextEl: '.statistics__arrow_next',
                        prevEl: '.statistics__arrow_prev',
                        disabledClass: 'statistics__arrow_disabled',
                    }"
                    @active-index-change="onIndexChange"
                    @swiper="onSwiper"
                    @slide-change-transition-end="onSlideChangeTransitionEnd"
                >
                    <SwiperSlide v-for="(chartData, idx) in chartsData" :key="idx">
                        <WidgetProfileStatisticsItem
                            :data="chartData.data"
                            :type="chartData.type"
                            :is-active="idx === activeSlideIndex"
                            :is-visible="idx === activeSlideIndex || idx === (activeSlideIndex + 1) % chartsData.length"
                        />
                    </SwiperSlide>
                </Swiper>
                <div class="statistics__arrow statistics__arrow_next">
                    <div class="statistics__badge">
                        <IconChevron />
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="statistics__container">
                    <div class="statistics__icon">
                        <IconGameChart />
                    </div>
                    <p class="statistics__message">{{ $t('completeMoreCheckpoints') }}</p>
                </div>
            </template>
        </div>
    </template>
    <template v-else>
        <UiPreloader />
    </template>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Mousewheel, Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper/types';
import type { ICheckpointStatistics } from '~/modules/checkpoint/entities/interfaces/ICheckpointStatistics';
import type { ChartData } from '~/entities/types/ChartData';

import 'swiper/css';
import 'swiper/css/pagination';
import type { BaseResponse } from '~/entities/interfaces/responses/BaseResponse';

const { $api } = useNuxtApp();

const { status, data: statistics } = await useLazyAsyncData('games', async () => {
    const response = await $api<BaseResponse<ICheckpointStatistics>>('/v1/users/statistics', {
        credentials: 'include',
    });

    return response.data;
});

const device = useDevice();

const activeSlideIndex = ref<number>(0);
const previousSlideIndex = ref<number | undefined>(undefined);

const isEnoughData = computed((): boolean => {
    return Boolean(statistics.value?.stages && statistics.value.stages.length > 1);
});

const chartsData = computed((): { type: string; data: ChartData }[] => {
    if (statistics.value?.stages) {
        const { stages, ...otherFields } = statistics.value;

        return Object.entries(otherFields).map(([key, values]) => ({
            type: key,
            data: {
                xAsis: stages,
                yAsis: values,
            },
        }));
    }

    return [];
});

const onSwiper = (swiper: SwiperClass) => {
    activeSlideIndex.value = swiper.realIndex;
    previousSlideIndex.value = activeSlideIndex.value;

    swiper.update();
};

const onIndexChange = (swiper: SwiperClass) => {
    previousSlideIndex.value = activeSlideIndex.value;
    activeSlideIndex.value = swiper.realIndex;
};

const onSlideChangeTransitionEnd = (swiper: SwiperClass) => {
    // todo: width of previous slide

    const slideWidth = 290;
    const gap = 16;
    const translate = slideWidth + gap;
    const totalSlides = swiper.slides.length;

    swiper.wrapperEl.style.transition = 'transform 300ms ease';

    /**
     * Forward Transition: The condition activeSlideIndex.value === (previousSlideIndex.value + 1) % totalSlides checks if the active slide index is the next one in sequence, accounting for the loop back to zero.
     * Backward Transition: The condition previousSlideIndex.value === (activeSlideIndex.value + 1) % totalSlides checks if the previous slide index is the next one in sequence when moving backward, accounting for the loop from zero to the last slide index.
     */
    if (previousSlideIndex.value !== undefined && activeSlideIndex.value !== undefined) {
        if (activeSlideIndex.value === (previousSlideIndex.value + 1) % totalSlides) {
            // Moving forward
            swiper.setTranslate(-translate);
        } else if (previousSlideIndex.value === (activeSlideIndex.value + 1) % totalSlides) {
            // Moving backward
            swiper.setTranslate(0);
        }
    }
};
</script>

<style scoped lang="scss" src="./profile-statistics.styles.scss" />
