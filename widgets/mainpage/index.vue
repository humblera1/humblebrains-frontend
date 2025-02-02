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

<style scoped lang="scss">
.main {
    &__top {
        display: flex;
        gap: 60px;

        @include mobile {
            flex-direction: column-reverse;
            align-items: center;
            gap: 36px;
        }
    }

    &__bottom {
        min-width: 0;
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 60px;

        @include tablet {
            flex-direction: column;
        }
    }

    &__image {
        width: 100%;
        max-width: 480px;
        min-width: 300px;

        @include tablet {
            max-width: 300px;
            min-width: 200px;
        }

        @include mobile {
            min-width: unset;
        }

        img {
            object-fit: contain;
            width: 100%;
            height: 100%;
        }
    }

    &__insight {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        gap: 48px;

        @include tablet {
            gap: 32px;
        }
    }

    &__text {
        display: flex;
        flex-direction: column;
        gap: 24px;

        @include tablet {
            gap: 20px;
        }
    }

    &__button {
        &_desktop {
            @include mobile {
                display: none;
            }
        }

        &_mobile {
            display: none;

            @include mobile {
                display: flex;
            }
        }
    }

    &__gradient {
        font-weight: 600;
        background: linear-gradient(to right, #102a7f, #b32d91);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    &__title {
        @include mainFont(500, 36, var(--primary-title));

        @include tablet {
            font-size: 24px;
        }

        @include mobile {
            text-align: center;
            font-size: 20px;
        }
    }

    &__subtitle {
        @include mainFont(400, 20, var(--primary-subtitle), 28);

        @include tablet {
            font-size: 18px;
        }

        @include mobile {
            text-align: center;
            font-size: 14px;
        }
    }
}
</style>
