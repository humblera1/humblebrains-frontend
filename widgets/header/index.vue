<template>
    <div class="header">
        <div class="header__logo">

        </div>
        <div class="header__bars">
            <IconBars />
        </div>
        <div class="header__content">
            <div class="header__menu">
                <WidgetMenu />
            </div>
            <div class="header__controls">
                <WidgetLanguageSelect />
                <WidgetColorMode />
            </div>
            <div class="header__buttons">
                <UiButton class="header__signin">
                    <template #leading>
                        <IconUserLock />
                    </template>
                    {{ $t('signIn') }}
                </UiButton>
                <UiButton theme="blue-outline" class="header__signup">
                    <template #leading>
                        <IconUserPlus />
                    </template>
                    {{ $t('signUp') }}
                </UiButton>
            </div>
        </div>
        <div class="header__results">
            <IconTrophy />
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.header {
    gap: 16px;
    display: flex;
    justify-items: center;
    align-items: center;
    width: 100%;
    padding: 0 64px;

    &__content {
        display: flex;
        justify-content: space-between;
        gap: 32px;
        width: 100%;
    }

    &__menu {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
    }

    &__controls {
        display: flex;
        align-items: center;
        gap: 32px;
        flex: 1;
    }

    &__buttons {
        display: flex;
        gap: 16px;
    }

    &__signup {
        @include small-desktop {
            display: none;
        }
    }

    &__bars,
    &__results {
        display: none;
        justify-content: center;
        align-items: center;
        min-width: 40px;
        width: 40px;
        height: 40px;
        border-radius: 12px;

        @include tablet {
            display: flex;
        }
    }

    &__bars {
        background-color: var(--white);

        @include mainShadowMobile;
    }

    &__results {
        background-color: var(--blue-badge);
    }
}
</style>