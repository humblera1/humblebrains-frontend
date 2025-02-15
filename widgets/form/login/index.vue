<template>
    <form class="login-form">
        <div class="login-form__section">
            <h3 class="login-form__subtitle">Введите почту и пароль</h3>
            <UiInput
                id="email-signin"
                v-model:value="form.fields.usermail"
                v-model:error="form.errors.usermail"
                :label="$t('usermail')"
                :placeholder="$t('usermail')"
                type="text"
                required
            >
                <template #trailing>
                    <IconEnvelope />
                </template>
            </UiInput>
            <UiInput
                id="password-signin"
                v-model:value="form.fields.password"
                v-model:error="form.errors.password"
                :label="$t('password')"
                :placeholder="$t('enterPassword')"
                type="password"
                required
            >
                <template #trailing>
                    <IconLock />
                </template>
            </UiInput>
            <div v-show="showGeneralError" class="login-form__error">
                <IconExclamation />
                <p>{{ form.errors.general }}</p>
            </div>
        </div>
        <div class="login-form__footer">
            <UiButton theme="pure-blue" @click="login">Войти</UiButton>
            <p class="login-form__policy">
                Данный сайт защищен reCAPTCHA с соответствующей <NuxtLink>политикой конфиденциальности Google</NuxtLink>
            </p>
        </div>
    </form>
</template>

<script setup lang="ts">
import { FetchError } from 'ofetch';
import type { ILoginFormErrors } from '~/entities/interfaces/forms/login/ILoginFormErrors';
import { useUserStore } from '~/modules/user/stores/userStore';
import type { User } from '~/modules/user/entities/interfaces/User';
import { loginForm as form } from '~/entities/objects/forms/login/loginForm';
import { ResponseStatusCodeEnum } from '~/entities/enums/ResponseStatusCodeEnum';
import type { IAuthorizationErrorResponse } from '~/entities/interfaces/responses/auth/IAuthorizationErrorResponse';
import type { IValidationErrorResponse } from '~/entities/interfaces/responses/auth/IValidationErrorResponse';

const authService = useAuthService();

const emit = defineEmits(['success']);

const { setUserData } = useUserStore();

const login = async () => {
    form.clearErrors();

    try {
        const user: User = await authService.login(form.fields);
        setUserData(user);
        emit('success');
    } catch (errorResponse) {
        const unknownResponse = errorResponse as FetchError;

        if (unknownResponse.statusCode === ResponseStatusCodeEnum.Forbidden) {
            const authorizationErrorResponse = unknownResponse as IAuthorizationErrorResponse;

            // todo: обработчик ошибки при повторном логине/регистрации
            // eslint-disable-next-line no-console
            console.log('Ошибка авторизации: ' + authorizationErrorResponse.data.message);

            return;
        }

        if (unknownResponse.statusCode === ResponseStatusCodeEnum.UnprocessableEntity) {
            const validationErrorResponse = unknownResponse as IValidationErrorResponse<ILoginFormErrors>;
            form.setErrors(validationErrorResponse.data.errors);

            return;
        }

        // todo: обработчик неизвестной ошибки
        // eslint-disable-next-line no-console
        console.log('Неизвестная ошибка');
    }
};

const showGeneralError = computed((): boolean => {
    return form.errors.general !== '';
});

onUnmounted(() => {
    form.clearErrors();
});
</script>

<style scoped lang="scss" src="./form-login.styles.scss"></style>
