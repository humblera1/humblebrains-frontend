<template>
    <div class="main-swiper">
        <Swiper
            :modules="[Pagination, Navigation, Mousewheel]"
            :slides-per-view="3"
            :space-between="24"
            :loop="true"
            :mousewheel="{
                invert: false,
                forceToAxis: true,
            }"
            :pagination="{
                clickable: true,
            }"
        >
            <SwiperSlide v-for="(item, idx) in items" :key="idx">
                <WidgetMainpageSwiperItem :item />
            </SwiperSlide>
        </Swiper>
    </div>
</template>

<script setup lang="ts">
import { Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import type { MainSwiperItem } from '~/entities/types/MainSwiperItem';

const items: MainSwiperItem[] = [
    {
        theme: 'blue',
        image: 'free',
        title: 'swiper:online',
        subtitle: 'swiper:online-subtitle',
    },
    {
        theme: 'pink',
        image: 'free',
        title: 'swiper:online',
        subtitle: 'swiper:online-subtitle',
    },
    {
        theme: 'blue',
        image: 'free',
        title: 'swiper:online',
        subtitle: 'swiper:online-subtitle',
    },
    {
        theme: 'blue',
        image: 'free',
        title: 'swiper:online',
        subtitle: 'swiper:online-subtitle',
    },
    {
        theme: 'blue',
        image: 'free',
        title: 'swiper:online',
        subtitle: 'swiper:online-subtitle',
    },
];
</script>

<style scoped lang="scss">
.main-swiper {
    //height: 100%;
    //max-height: 100vw;
    // CSS Grid/Flexbox bug size workaround
    // @see https://github.com/kenwheeler/slick/issues/982
    //min-height: 0;
    min-width: 0;
    display: flex;
    align-items: center;
    //max-width: 100vw;
    //width: 100%;
    //overflow: hidden;

    width: auto;
    max-width: calc(3 * 225px + 2 * 24px);

    .swiper-slide {
        flex-shrink: 0;
        display: flex;
        justify-content: center;
         //width: 225px !important;
        //max-width: 225px;
    //    height: 100%;
    //    max-height: 100%;
    }

    //.swiper-wrapper {
    //    max-height: 100%;
    //    height: 100%;
    //    display: flex;
    //}
}
</style>
