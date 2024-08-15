<template>
    <UiModal v-model="model">
        <div class="auth-modal" :class="`auth-modal_${state}`">
            <section class="auth-modal__section auth-modal__section_signup">
                <h2 class="auth-modal__title">
                    <span class="auth-modal__title_active">Регистрация</span> / <span @click="state = 'signin'">Вход</span>
                </h2>
                <div class="auth-modal__form">
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
                </div>
                <div class="auth-modal__footer">
                    <UiButton>Зарегистрироваться</UiButton>
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
                </div>
                <div class="auth-modal__footer">
                    <UiButton theme="blue-outline">Войти</UiButton>
                    <p class="auth-modal__policy">
                        Данный сайт защищен reCAPTCHA с соответствующей <NuxtLink>политикой конфиденциальности Google</NuxtLink>
                    </p>
                </div>
            </section>
            <section class="auth-modal__section auth-modal__section_image">
                <NuxtImg src="/images/modals/auth/sign-up.png" class="auth-modal__image auth-modal__image_signup" :class="`auth-modal__image_`"/>
                <NuxtImg src="/images/modals/auth/sign-in.png" class="auth-modal__image auth-modal__image_signin" :class="`auth-modal__image_${state}`"/>
            </section>
        </div>
    </UiModal>
</template>

<script setup lang="ts">
const model = defineModel<boolean>();

const state = ref<string>('signup');

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
</script>

<style scoped lang="scss" src="./auth-modal.styles.scss"></style>
