<template>
    <div class="statistics">
        <Swiper
            :modules="[Pagination, Navigation, Mousewheel]"
            :slides-per-view="'auto'"
            :watch-slides-progress="true"
            :space-between="16"
            :loop="true"
            :slide-to-clicked-slide="true"
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
            @slide-change-transition-end="onSlideChangeTransitionEnd"
        >
            <SwiperSlide v-for="(chartData, idx) in chartsData" :key="idx">
                <WidgetProfileStatisticsItem :data="chartData.data" :type="chartData.type" :is-active="idx === activeSlideIndex" />
            </SwiperSlide>
        </Swiper>
        <div class="statistics__arrow statistics__arrow_next">
            <IconChevron />
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
    stages: [1, 2, 3, 4, 5],
    memory: [65, 45, 34, 89, 12],
    attention: [34, 23, 46, 78, 92],
    logic: [65, 45, 34, 89, 12],
};

const activeSlideIndex = ref<number | undefined>(undefined);
const previousSlideIndex = ref<number | undefined>(undefined);

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

const onSwiper = (swiper: SwiperClass) => {
    swiperInstance.value = swiper;
    activeSlideIndex.value = swiper.realIndex;
    previousSlideIndex.value = activeSlideIndex.value;
};

const onIndexChange = (swiper: SwiperClass) => {
    previousSlideIndex.value = activeSlideIndex.value;
    activeSlideIndex.value = swiper.realIndex;
};

const onSlideChangeTransitionEnd = (swiper: SwiperClass) => {
    // todo: width of previous slide

    const slideWidth = 290; // Ширина слайда
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

<style scoped lang="scss">
.statistics {
    display: block;
    position: relative;
    width: 100%;
    max-width: 100%;
    padding: 0 48px 0 16px;
    overflow: hidden;
    box-sizing: border-box;

    @include mobile {
        overflow: hidden;
        width: calc(100vw - 16px);
        padding: unset;
        //margin: 0 -32px;
        margin-left: -16px;
        //margin-right: 16px;
    }

    &__arrow {
        cursor: pointer;
        z-index: 11;
        position: absolute;
        top: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 25px;
        height: 25px;
        margin: auto;
        border-radius: 100px;
        color: var(--accent-white);
        background-color: var(--blue);

        transition: all 250ms ease;

        @include mobile {
            display: none;
        }

        &_next {
            right: 0;
            rotate: -90deg;
        }

        &_disabled {
            cursor: unset;
            background-color: var(--gray-absence);
            //color: var(--gray-absence);
        }

        &:hover {
            background-color: var(--blue-hovered);
        }
    }
}

.swiper-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.swiper-slide {
    display: flex;
    align-items: center;
    width: 290px;
    height: 255px;
    opacity: 0;
    visibility: hidden;

    &-active {
        width: calc(375px);
    }

    &-visible {
        opacity: 1;
        visibility: visible;
    }
}

.swiper-pagination {
    display: none;

    @include mobile {
        display: block;
    }
}

.swiper {
    display: flex;
    align-items: center;
    height: calc(255px + 16px + 48px);
    max-width: calc(712px + 32px);
    padding: 16px 32px 48px 32px;
    overflow: hidden;

    @include mobile {
        padding: 16px;
    }
}
</style>
