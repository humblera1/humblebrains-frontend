<template>
    <div class="register-form">
        <form class="register-form__form">
            <div class="register-form__section">
                <h3 class="register-form__subtitle">{{ $t('fillRequiredFields') }}</h3>
                <UiInput
                    id="email"
                    v-model:value="form.fields.email"
                    v-model:error="form.errors.email"
                    :label="$t('email')"
                    :placeholder="$t('enterEmail')"
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
                    :label="$t('password')"
                    :placeholder="$t('enterPassword')"
                    type="password"
                    required
                >
                    <template #trailing>
                        <IconLock />
                    </template>
                </UiInput>
            </div>
            <div class="register-form__section">
                <h3 class="register-form__subtitle">{{ $t('additionalInfo') }}</h3>
                <UiInput
                    id="username"
                    v-model:value="form.fields.username"
                    v-model:error="form.errors.username"
                    :label="$t('username')"
                    :placeholder="$t('enterUsername')"
                    type="text"
                >
                    <template #trailing>
                        <IconAstronaut />
                    </template>
                </UiInput>
                <div class="register-form__inputs">
                    <UiInput
                        id="firstname"
                        v-model:value="form.fields.name"
                        v-model:error="form.errors.name"
                        :label="$t('name')"
                        :placeholder="$t('yourName')"
                        theme="outlined"
                        type="text"
                    />
                </div>
            </div>
        </form>
        <div class="register-form__footer">
            <UiButton @click="register">{{ $t('signUp') }}</UiButton>
            <p class="register-form__policy">
                {{ $t('recaptchaNotice') }}
                <NuxtLink to="https://policies.google.com/privacy">{{ $t('googlePrivacyPolicy') }}</NuxtLink>
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
import type { BaseResponse } from '~/entities/interfaces/responses/BaseResponse';

const authService = useAuthService();

const emit = defineEmits(['success']);

const { setUserData } = useUserStore();

const register = async () => {
    form.clearErrors();

    try {
        const user: BaseResponse<User> = await authService.register(form.fields);

        setUserData(user.data);
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
            const validationErrorResponse = unknownResponse as IValidationErrorResponse<IRegisterFormErrors>;
            form.setErrors(validationErrorResponse.data.errors);

            return;
        }

        // todo: обработчик неизвестной ошибки
        // eslint-disable-next-line no-console
        console.log('Неизвестная ошибка');
    }
};
</script>

<style scoped lang="scss" src="./form-register.styles.scss"></style>
