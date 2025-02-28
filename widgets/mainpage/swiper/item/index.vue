<template>
    <div :class="['swiper-item', { 'swiper-item_active': isActive }]">
        <div :class="`swiper-item__badge swiper-item__badge_${item.theme}`">
            <NuxtImg :src="imageSrc" alt="Swiper Item Image" />
        </div>
        <div class="swiper-item__content">
            <p class="swiper-item__title">
                {{ $t(item.title) }}
            </p>
            <p class="swiper-item__subtitle">
                {{ $t(item.subtitle) }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { SwiperItemProps } from '~/widgets/mainpage/swiper/item/swiper-item.types';

const { item } = defineProps<SwiperItemProps>();

const mode = useColorMode();

const imageSrc = computed((): string => {
    const imageName = mode.value === 'dark' ? `${item.image}-dark` : item.image;

    return `/images/main-swiper/${imageName}.png`;
});
</script>

<style scoped lang="scss" src="./swiper-item.styles.scss" />
