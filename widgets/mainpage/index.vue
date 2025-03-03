<template>
    <div class="main">
        <div class="main__top">
            <UiButton class="main__button_mobile">
                {{ $t('main.buttonForward') }}
                <div id="trailing">
                    <IconArrowLeft />
                </div>
            </UiButton>
            <div class="main__image">
                <NuxtImg :src="imageSrc" alt="Main Image" />
            </div>
            <div class="main__insight">
                <div class="main__text">
                    <h1 class="main__title">
                        {{ $t('main.titlePrefix') }}
                        <span class="main__gradient">humblebrains</span>
                    </h1>
                    <p class="main__subtitle">
                        {{ $t('main.subtitle') }}
                    </p>
                </div>
                <UiButton :to="localePath('/games')" class="main__button_desktop">
                    {{ $t('main.buttonForward') }}
                    <div id="trailing">
                        <IconArrowLeft />
                    </div>
                </UiButton>
            </div>
        </div>
        <div class="main__bottom">
            <WidgetMainpageSwiper />
            <WidgetMainpageBenefits />
        </div>
    </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode();

const localePath = useLocalePath();

const imageSrc = computed((): string => {
    return colorMode.value === 'dark' ? '/images/main-dark.png' : '/images/main-light.png';
});
</script>

<style scoped lang="scss" src="./mainpage.styles.scss" />
