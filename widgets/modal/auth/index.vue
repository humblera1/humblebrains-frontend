<template>
    <UiModal v-model="show">
        <div class="auth-modal" :class="`auth-modal_${state}`">
            <section class="auth-modal__section auth-modal__section_signup">
                <h2 class="auth-modal__title">
                    <span class="auth-modal__title_active">Регистрация</span> / <span @click="state = 'signin'">Вход</span>
                </h2>
                <WidgetFormRegister ref="registerForm" />
                <div class="auth-modal__footer">
                    <UiButton @click="submitRegisterForm">Зарегистрироваться</UiButton>
                    <p class="auth-modal__policy">
                        Данный сайт защищен reCAPTCHA с соответствующей <NuxtLink>политикой конфиденциальности Google</NuxtLink>
                    </p>
                </div>
            </section>
            <section class="auth-modal__section auth-modal__section_signin">
                <h2 class="auth-modal__title">
                    <span class="auth-modal__title_active">Вход</span> / <span @click="state = 'signup'">Регистрация</span>
                </h2>
                <WidgetFormLogin ref="loginForm" />
                <div class="auth-modal__footer">
                    <UiButton theme="blue-outline" @click="submitLoginForm">Войти</UiButton>
                    <p class="auth-modal__policy">
                        Данный сайт защищен reCAPTCHA с соответствующей <NuxtLink>политикой конфиденциальности Google</NuxtLink>
                    </p>
                </div>
            </section>
            <section class="auth-modal__section auth-modal__section_image">
                <NuxtImg src="/images/modals/auth/sign-up.png" class="auth-modal__image auth-modal__image_signup" />
                <NuxtImg src="/images/modals/auth/sign-in.png" class="auth-modal__image auth-modal__image_signin" />
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
const show = defineModel<boolean>('show');
const state = defineModel<string>('state');

const loginForm = ref();
const registerForm = ref();

const authService = useAuthService();

type Form = {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
};

const form: Form = reactive({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
});

const errors = reactive({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
});

const submitLoginForm = () => {
    loginForm.value.login();
    // setFinalState()
};

const submitRegisterForm = () => {
    registerForm.value.register();
    // setFinalState()
}

const setFinalState = () => {
    state.value = 'final-' + state.value;
}

</script>

<style scoped lang="scss" src="./auth-modal.styles.scss"></style>
