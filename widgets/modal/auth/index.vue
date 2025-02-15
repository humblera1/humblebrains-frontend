<template>
    <UiModal>
        <div class="auth-modal" :class="`auth-modal_${state}`">
            <section class="auth-modal__section auth-modal__section_signup">
                <h2 class="auth-modal__title">
                    <span class="auth-modal__title_active">{{ $t('signUp') }}</span> /
                    <span @click="state = 'signin'">{{ $t('signIn') }}</span>
                </h2>
                <div class="auth-modal__form">
                    <WidgetFormRegister @success="onRegistrationSuccess" />
                </div>
            </section>
            <section class="auth-modal__section auth-modal__section_signin">
                <h2 class="auth-modal__title">
                    <span class="auth-modal__title_active">{{ $t('signIn') }}</span> /
                    <span @click="state = 'signup'">{{ $t('signUp') }}</span>
                </h2>
                <div class="auth-modal__form">
                    <WidgetFormLogin @success="onLoginSuccess" />
                </div>
            </section>
            <section class="auth-modal__section auth-modal__section_image">
                <NuxtImg :src="getImage('sign-up')" class="auth-modal__image auth-modal__image_signup" />
                <NuxtImg :src="getImage('sign-in')" class="auth-modal__image auth-modal__image_signin" />
            </section>
            <div class="auth-modal__section auth-modal__section_final">
                <NuxtImg :src="getImage('final')" class="auth-modal__image auth-modal__image_final" />
                <div class="auth-modal__instructions">
                    <h3 class="auth-modal__thanks">{{ $t('thankYou') }}</h3>
                    <p>{{ $t('checkEmail') }}</p>
                </div>
            </div>
        </div>
    </UiModal>
</template>

<script setup lang="ts">
const state = useState('authState');

const colorMode = useColorMode();

const { closeModal } = useHumbleModal();

const getImage = (image: 'final' | 'sign-in' | 'sign-up'): string => {
    return colorMode.value === 'dark' ? `/images/modals/auth/${image}-dark.png` : `/images/modals/auth/${image}-light.png`;
};

const onLoginSuccess = () => {
    closeModal();
};

const onRegistrationSuccess = () => {
    state.value = 'final-signup';
};
</script>

<style scoped lang="scss" src="./auth-modal.styles.scss"></style>
