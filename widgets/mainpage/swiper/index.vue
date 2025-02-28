<template>
    <div ref="swiperContainer" class="main-swiper">
        <Swiper
            :modules="[Pagination, Navigation, Mousewheel]"
            :slides-per-view="computedSlidesPerView"
            :space-between="24"
            :loop="true"
            :set-wrapper-size="true"
            :mousewheel="{
                invert: false,
                forceToAxis: true,
            }"
            :pagination="{
                clickable: true,
            }"
            @active-index-change="onIndexChange"
        >
            <SwiperSlide v-for="(item, idx) in items" :key="idx">
                <WidgetMainpageSwiperItem :item :is-active="idx === activeSlideIndex" />
            </SwiperSlide>
        </Swiper>
    </div>
</template>

<script setup lang="ts">
import { Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { useElementSize } from '@vueuse/core';
import type { Swiper as SwiperClass } from 'swiper/types';
import type { MainSwiperItem } from '~/entities/types/MainSwiperItem';

const swiperContainer = ref<HTMLElement | null>(null);
const { width } = useElementSize(swiperContainer);

const activeSlideIndex = ref(0);

const computedSlidesPerView = computed((): number => {
    switch (true) {
        case width.value > 570:
            return 3;
        case width.value > 380:
            return 2;
        default:
            return 1;
    }
});

const items: MainSwiperItem[] = [
    {
        theme: 'blue',
        image: 'online',
        title: 'swiper.online.title',
        subtitle: 'swiper.online.subtitle',
    },
    {
        theme: 'pink',
        image: 'free',
        title: 'swiper.free.title',
        subtitle: 'swiper.free.subtitle',
    },
    {
        theme: 'blue',
        image: 'time',
        title: 'swiper.time.title',
        subtitle: 'swiper.time.subtitle',
    },
    {
        theme: 'pink',
        image: 'progress',
        title: 'swiper.progress.title',
        subtitle: 'swiper.progress.subtitle',
    },
    {
        theme: 'blue',
        image: 'personalization',
        title: 'swiper.personalization.title',
        subtitle: 'swiper.personalization.subtitle',
    },
];

const onIndexChange = (swiper: SwiperClass) => {
    activeSlideIndex.value = swiper.realIndex;
};
</script>

<style scoped lang="scss" src="./swiper.styles.scss" />
