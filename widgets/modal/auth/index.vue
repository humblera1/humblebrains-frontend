<template>
    {{ authState }}
    <UiModal v-model="show">
        <div class="auth-modal" :class="`auth-modal_${state}`">
            <section class="auth-modal__section auth-modal__section_signup">
                <h2 class="auth-modal__title">
                    <span class="auth-modal__title_active">Регистрация</span> / <span @click="state = 'signin'">Вход</span>
                </h2>
                <form class="auth-modal__form">
                    <div class="auth-modal__block">
                        <h3 class="auth-modal__subtitle">Заполните обязательные поля</h3>
                        <UiInput
                            id="email"
                            v-model="form.email"
                            :error="errors.email"
                            label="E-mail"
                            placeholder="Введите почту"
                            type="text"
                            required
                        >
                            <template #trailing>
                                <IconEnvelope />
                            </template>
                        </UiInput>
                        <UiInput
                            id="password"
                            v-model="form.password"
                            :error="errors.password"
                            label="Password"
                            placeholder="Введите пароль"
                            type="password"
                            required
                        >
                            <template #trailing>
                                <IconLock />
                            </template>
                        </UiInput>
                    </div>
                    <div class="auth-modal__block">
                        <h3 class="auth-modal__subtitle">Дополнительная информация</h3>
                        <UiInput
                            id="username"
                            v-model="form.username"
                            :error="errors.username"
                            label="Username"
                            placeholder="Введите никнейм"
                            type="text"
                        >
                            <template #trailing>
                                <IconAstronaut />
                            </template>
                        </UiInput>
                        <div class="auth-modal__inputs">
                            <UiInput
                                id="firstname"
                                v-model="form.firstname"
                                :error="errors.firstname"
                                label="Firstname"
                                placeholder="Ваше имя"
                                theme="outlined"
                                type="text"
                            />
                            <UiInput
                                id="lastname"
                                v-model="form.lastname"
                                :error="errors.lastname"
                                label="Lastname"
                                placeholder="...и фамилия"
                                theme="outlined"
                                type="text"
                            />
                        </div>
                    </div>
                </form>
                <div class="auth-modal__footer">
                    <UiButton @click="submitForm">Зарегистрироваться</UiButton>
                    <p class="auth-modal__policy">
                        Данный сайт защищен reCAPTCHA с соответствующей <NuxtLink>политикой конфиденциальности Google</NuxtLink>
                    </p>
                </div>
            </section>
            <section class="auth-modal__section auth-modal__section_signin">
                <h2 class="auth-modal__title">
                    <span class="auth-modal__title_active">Вход</span> / <span @click="state = 'signup'">Регистрация</span>
                </h2>
                <div class="auth-modal__form auth-modal__form_signin">
                    <div class="auth-modal__block">
                        <h3 class="auth-modal__subtitle">Введите почту и пароль</h3>
                        <WidgetFormLogin ref="loginForm" />
                    </div>
                </div>
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
import type { LoginForm } from '~/entities/interfaces/forms/login/LoginForm';
import type { LoginFormErrors } from '~/entities/interfaces/forms/login/LoginFormErrors';

const show = defineModel<boolean>('show');
const state = defineModel<string>('state');

const loginForm = ref();

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
};

const submitForm = () => {
    state.value = 'final-' + state.value;
};
</script>

<style scoped lang="scss" src="./auth-modal.styles.scss"></style>
