<template>
    <div class="statistics">
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
    </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Mousewheel, Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper/types';
import type { ICheckpointStatistics } from '~/modules/checkpoint/entities/interfaces/ICheckpointStatistics';
import type { ChartData } from '~/entities/types/ChartData';

import 'swiper/css';
import 'swiper/css/pagination';

const statistics: ICheckpointStatistics = {
    stages: [1, 2, 3, 4],
    memory: [65, 45, 34, 89, 12],
    attention: [34, 23, 46, 78, 92],
    logic: [65, 45, 34, 89, 12],
};

const device = useDevice();

const activeSlideIndex = ref<number>(0);
const previousSlideIndex = ref<number | undefined>(undefined);

const chartsData = computed((): { type: string; data: ChartData }[] => {
    const { stages, ...otherFields } = statistics;

    return Object.entries(otherFields).map(([key, values]) => ({
        type: key,
        data: {
            xAsis: stages,
            yAsis: values,
        },
    }));
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
