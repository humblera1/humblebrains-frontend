<template>
    <div class="swiper-item">
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

const imageSrc = computed((): string => {
    return `/images/main-swiper/${item.image}.png`;
});
</script>

<style scoped lang="scss">
.swiper-item {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 225px;
    height: 300px;

    @include tablet {
        width: 200px;
        height: 250px;
    }

    &__badge {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 220px;
        border-radius: 32px;

        @include tablet {
            height: 180px;
        }

        &_pink {
            background-color: var(--pink-bg);
        }

        &_blue {
            background-color: var(--iris-bg);
        }
    }

    &__content {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    &__title {
        text-align: center;
        @include mainFont(500, 16, var(--primary-title));
        @include lineclamp(1);

        @include tablet {
            font-size: 14px;
        }
    }

    &__subtitle {
        text-align: center;
        @include mainFont(400, 12, var(--primary-subtitle));
        @include lineclamp(2);

        @include mobile {
            font-size: 10px;
        }
    }
}
</style>
