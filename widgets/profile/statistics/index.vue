<template>
    <div class="statistics">
        {{ activeSlideIndex }}
        <Swiper
            :modules="[Pagination, Navigation, Mousewheel]"
            :slides-per-view="2"
            :space-between="16"
            :loop="true"
            :mousewheel="{
                invert: false,
                forceToAxis: true,
            }"
            :pagination="{
                clickable: true,
            }"
            :navigation="{
                nextEl: '.statistics__arrow_next',
                prevEl: '.statistics__arrow_prev',
                disabledClass: 'statistics__arrow_disabled',
            }"
            @active-index-change="onIndexChange"
            @swiper="onSwiper"
        >
            <SwiperSlide v-for="(chartData, idx) in chartsData" :key="idx">
                <WidgetProfileStatisticsItem
                    :data="chartData.data"
                    :type="chartData.type"
                    :is-active="idx === activeSlideIndex"
                    @click="onSlideClick(idx)"
                />
            </SwiperSlide>
        </Swiper>
    </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Mousewheel, Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper/types';
import type { ICheckpointStatistics } from '~/modules/checkpoint/entities/interfaces/ICheckpointStatistics';
import type { ChartData } from '~/entities/types/ChartData';

const statistics: ICheckpointStatistics = {
    stages: [1, 2, 3, 4, 5],
    memory: [65, 45, 34, 89, 12],
    attention: [34, 23, 46, 78, 92],
    logic: [65, 45, 34, 89, 12],
    test: [65, 45, 34, 89, 12],
};

const activeSlideIndex = ref<number>(0);
const swiperInstance = ref<SwiperClass | null>(null);

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

initializeChartsData();

const onSwiper = (swiper: SwiperClass) => {
    swiperInstance.value = swiper;
};

const onIndexChange = (swiper: SwiperClass) => {
    activeSlideIndex.value = swiper.activeIndex;
};

const onSlideClick = (index: number) => {
    if (swiperInstance.value) {
        console.log('active index: ' + index);
        swiperInstance.value.slideToLoop(index);
        console.log('swiper instance active index: ' + swiperInstance.value.activeIndex);
    }
};
</script>

<style scoped lang="scss">
.statistics {
    width: 100%; // чтобы свайпер занимал всю доступную ширину
    max-width: 100%;
    padding: 0 16px;
    overflow: hidden;
    box-sizing: border-box;
}

.swiper-slide {
    display: flex;
    width: fit-content;
    justify-content: center;
    box-sizing: border-box;
}

.swiper {
    width: 100%; // чтобы свайпер занимал всю доступную ширину
    overflow: hidden;
    box-sizing: border-box;
}
</style>
