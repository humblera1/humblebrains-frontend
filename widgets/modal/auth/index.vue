<template>
    <UiModal>
        <div class="auth-modal" :class="`auth-modal_${state}`">
            <section class="auth-modal__section auth-modal__section_signup">
                <h2 class="auth-modal__title">
                    <span class="auth-modal__title_active">Регистрация</span> / <span @click="state = 'signin'">Вход</span>
                </h2>
                <div class="auth-modal__form">
                    <WidgetFormRegister />
                </div>
            </section>
            <section class="auth-modal__section auth-modal__section_signin">
                <h2 class="auth-modal__title">
                    <span class="auth-modal__title_active">Вход</span> / <span @click="state = 'signup'">Регистрация</span>
                </h2>
                <div class="auth-modal__form">
                    <WidgetFormLogin />
                </div>
            </section>
            <section class="auth-modal__section auth-modal__section_image">
                <NuxtImg :src="signUpImage" class="auth-modal__image auth-modal__image_signup" />
                <NuxtImg :src="signInImage" class="auth-modal__image auth-modal__image_signin" />
            </section>
            <div class="auth-modal__section auth-modal__section_final">
                <NuxtImg src="/images/modals/auth/final.png" class="auth-modal__image auth-modal__image_final" />
                <div class="auth-modal__instructions">
                    <h3 class="auth-modal__thanks">Благодарим за регистрацию!</h3>
                    <p>Для завершения регистрации следуйте инструкциям, отправенным на ваш почтовый ящик</p>
                </div>
            </div>
        </div>
    </UiModal>
</template>

<script setup lang="ts">
const state = useState('authState');

const colorMode = useColorMode();

const signInImage = computed((): string => {
    return colorMode.value === 'dark' ? '/images/modals/auth/sign-in-dark.png' : '/images/modals/auth/sign-in-light.png';
});

const signUpImage = computed((): string => {
    return colorMode.value === 'dark' ? '/images/modals/auth/sign-up-dark.png' : '/images/modals/auth/sign-up-light.png';
});
</script>

<style scoped lang="scss" src="./auth-modal.styles.scss"></style>
