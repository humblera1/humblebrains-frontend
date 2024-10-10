<template>
    <UiModal>
        <div class="pause-modal">
            <div class="pause-modal__header">
                <p class="pause-modal__title"> {{ $t('pause') }} </p>
                <div class="pause-modal__info">
                    <IconGameTarget />
                    <p class="pause-modal__subtitle"> {{ $t('checkpoint') }} </p>
                </div>
            </div>
            <div class="pause-modal__content">
                <ul class="pause-modal__menu">
                    <UiListItem title="showRules" :icon="IconGameGraduationCap" @selected="console.log('selected')" />
                    <UiListItem title="quit" :icon="IconGameLeftToBracket" @selected="console.log('selected')" />
                </ul>
                <UiButton>Продолжить</UiButton>
            </div>
        </div>
    </UiModal>
</template>

<script setup lang="ts">
import { IconGameGraduationCap, IconGameLeftToBracket } from '#components';
</script>

<style scoped lang="scss">
.pause-modal {
    display: flex;
    flex-direction: column;
    gap: 42px;
    background-color: var(--badge-bg);
    padding: 32px 24px 48px;
    width: 310px;
    height: 360px;
    border-radius: 24px;

    &__header {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    &__content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        height: 100%;
    }

    &__menu {
        width: 100%;
    }

    &__title {
        @include mainFont(500, 20, var(--primary-title));
        text-align: center;
    }

    &__info {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;

        @include mobile {
            gap: 4px;
        }
    }

    &__subtitle {
        @include mainFont(400, 14, var(--primary-subtitle));

        @include mobile {
            font-size: 12px;
        }
    }

    svg {
        color: var(--primary-subtitle);
        min-width: 14px;
        width: 14px;
        height: 14px;

        @include mobile {
            min-width: 10px;
            width: 10px;
            height: 10px;
        }
    }
}
</style>