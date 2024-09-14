<template>
    <div class="header">
        <div class="header__logo"></div>
        <div
            :class="['header__bars', { header__bars_active: isSpecificWindowOpen(WidgetModalMenu) }]"
            @click="toggleMenuModal(WidgetModalMenu)"
        >
            <Transition>
                <IconCross v-if="isSpecificWindowOpen(WidgetModalMenu)" />
                <IconBars v-else />
            </Transition>
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
                <UiButton class="header__signin" @click="openSignin">
                    <template #leading>
                        <IconUserLock />
                    </template>
                    {{ $t('signIn') }}
                </UiButton>
                <UiButton theme="outline" class="header__signup" @click="openSignup">
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
import { WidgetModalAuth, WidgetModalMenu } from '#components';

const authState = useState('authState');

const { openModal } = useHumbleModal();
const { toggleModal: toggleMenuModal, isSpecificWindowOpen } = useHumbleModal({ withBackdrop: false });

const openSignin = () => {
    authState.value = 'signin';
    openAuthModal();
};

const openSignup = () => {
    authState.value = 'signup';
    openAuthModal();
};

const openAuthModal = () => {
    openModal(WidgetModalAuth);
};
</script>

<style scoped lang="scss" src="./header.styles.scss"></style>
