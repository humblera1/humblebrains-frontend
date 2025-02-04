<template>
    <div class="main">
        <div class="main__top">
            <UiButton class="main__button_mobile">
                Вперёд!
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
                        Станьте лучшей версией себя с
                        <span class="main__gradient">humblebrains</span>
                    </h1>
                    <p class="main__subtitle">
                        Проходите упражнения на сайте, соревнуйтесь с другими игроками и прокачивайте свои способности
                    </p>
                </div>
                <UiButton class="main__button_desktop">
                    Вперёд!
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

const imageSrc = computed((): string => {
    return colorMode.value === 'dark' ? '/images/main-dark.png' : '/images/main-light.png';
});
</script>

<style scoped lang="scss" src="./mainpage.styles.scss" />
