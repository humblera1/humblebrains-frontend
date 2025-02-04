<template>
    <div class="row" :class="{ row_full: !showArrows }">
        <Swiper
            ref="swiperRef"
            :modules="[Pagination, Navigation, Mousewheel]"
            :slides-per-view="'auto'"
            :space-between="16"
            :mousewheel="{
                invert: false,
                forceToAxis: true,
            }"
            :pagination="{
                clickable: true,
            }"
            :navigation="{
                nextEl: '.row__arrow_next',
                prevEl: '.row__arrow_prev',
                disabledClass: 'row__arrow_disabled',
            }"
            @swiper="onSwiperInit"
        >
            <SwiperSlide v-for="(game, idx) in games" :key="idx">
                <WidgetGameSnippet :game="game" :style="{ zIndex: games.length - idx }" />
            </SwiperSlide>
        </Swiper>
        <div v-show="showArrows && games?.length >= 1" class="row__arrow row__arrow_prev">
            <IconChevron />
        </div>
        <div v-show="showArrows && games?.length >= 1" class="row__arrow row__arrow_next">
            <IconChevron />
        </div>
    </div>
</template>

<script setup lang="ts">
import { Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import type { Swiper as SwiperType } from 'swiper/types';
import type { GameRowProps } from '~/widgets/game/row/game-row.types';

import 'swiper/css';
import 'swiper/css/pagination';

defineProps<GameRowProps>();

const swiperRef = ref<SwiperType | null>(null);
const showArrows = ref(true);

const updateArrowsVisibility = () => {
    if (!swiperRef.value) return;

    showArrows.value = !(swiperRef.value.isBeginning && swiperRef.value.isEnd);
};

const onSwiperInit = (swiper: SwiperType) => {
    swiperRef.value = swiper;
};

onMounted(() => {
    updateArrowsVisibility();
});
</script>

<style scoped lang="scss" src="./game-row.styles.scss" />
