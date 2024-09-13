<template>
    <div class="register-form">
        <form class="register-form__form">
            <div class="register-form__section">
                <h3 class="register-form__subtitle">Заполните обязательные поля</h3>
                <UiInput
                    id="email"
                    v-model:value="form.fields.email"
                    v-model:error="form.errors.email"
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
                    v-model:value="form.fields.password"
                    v-model:error="form.errors.password"
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
            <div class="register-form__section">
                <h3 class="register-form__subtitle">Дополнительная информация</h3>
                <UiInput
                    id="username"
                    v-model:value="form.fields.username"
                    v-model:error="form.errors.username"
                    label="Username"
                    placeholder="Введите никнейм"
                    type="text"
                >
                    <template #trailing>
                        <IconAstronaut />
                    </template>
                </UiInput>
                <div class="register-form__inputs">
                    <UiInput
                        id="firstname"
                        v-model:value="form.fields.firstName"
                        v-model:error="form.errors.firstName"
                        label="Firstname"
                        placeholder="Ваше имя"
                        theme="outlined"
                        type="text"
                    />
                    <UiInput
                        id="lastname"
                        v-model:value="form.fields.secondName"
                        v-model:error="form.errors.secondName"
                        label="Lastname"
                        placeholder="...и фамилия"
                        theme="outlined"
                        type="text"
                    />
                </div>
            </div>
        </form>
        <div class="register-form__footer">
            <UiButton @click="register">Зарегистрироваться</UiButton>
            <p class="register-form__policy">
                Данный сайт защищен reCAPTCHA с соответствующей <NuxtLink>политикой конфиденциальности Google</NuxtLink>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { FetchError } from 'ofetch';
import { registerForm as form } from '~/entities/objects/forms/register/registerForm';
import type { User } from '~/modules/user/entities/interfaces/User';
import { useUserStore } from '~/modules/user/stores/userStore';
import type { IRegisterFormErrors } from '~/entities/interfaces/forms/register/IRegisterFormErrors';
import { ResponseStatusCodeEnum } from '~/entities/enums/ResponseStatusCodeEnum';
import type { IAuthorizationErrorResponse } from '~/entities/interfaces/responses/auth/IAuthorizationErrorResponse';
import type { IValidationErrorResponse } from '~/entities/interfaces/responses/auth/IValidationErrorResponse';

const authService = useAuthService();

const { setUserData } = useUserStore();

const state = useState('authState');

const register = async () => {
    form.clearErrors();

    try {
        const user: User = await authService.register(form.fields);
        setUserData(user);
        setFinalState();
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
            const validationErrorResponse = unknownResponse as IValidationErrorResponse<IRegisterFormErrors>;
            form.setErrors(validationErrorResponse.data.errors);

            return;
        }

        // todo: обработчик неизвестной ошибки
        // eslint-disable-next-line no-console
        console.log('Неизвестная ошибка');
    }
};

const setFinalState = (): void => {
    state.value = 'final';
};
</script>

<style scoped lang="scss" src="./form-register.styles.scss"></style>
