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
            <div v-if="user.user.isAnonymous" class="header__buttons">
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
            <NuxtLink v-else :to="localePath('/profile')" class="header__user">
                <div class="header__avatar">
                    <NuxtImg v-if="user.hasAvatar" :src="user.avatar" alt="Avatar" class="details__img" />
                    <IconAstronautHelmet v-else class="details__astronaut" />
                </div>
                <div class="header__username">
                    <p>{{ user.username }}</p>
                </div>
            </NuxtLink>
        </div>
        <div class="header__results">
            <IconTrophy />
        </div>
    </div>
</template>

<script setup lang="ts">
import { WidgetModalAuth, WidgetModalMenu } from '#components';
import { useUserStore } from '~/modules/user/stores/userStore';

const authState = useState('authState');

const localePath = useLocalePath();

const { openModal } = useHumbleModal();
const { toggleModal: toggleMenuModal, isSpecificWindowOpen } = useHumbleModal({ withBackdrop: false });

const user = useUserStore();

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
