<template>
    <div class="row">
        <Swiper
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
        >
            <SwiperSlide v-for="(game, idx) in games" :key="idx">
                <WidgetGameSnippet :game="game" :style="{ zIndex: games.length - idx }" />
            </SwiperSlide>
        </Swiper>
        <div v-show="games?.length >= 1" class="row__arrow row__arrow_prev">
            <IconChevron />
        </div>
        <div v-show="games?.length >= 1" class="row__arrow row__arrow_next">
            <IconChevron />
        </div>
    </div>
</template>

<script setup lang="ts">
import { Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import type { GameRowProps } from '~/widgets/game/row/game-row.types';

import 'swiper/css';
import 'swiper/css/pagination';

defineProps<GameRowProps>();
</script>

<style scoped lang="scss" src="./game-row.styles.scss" />
