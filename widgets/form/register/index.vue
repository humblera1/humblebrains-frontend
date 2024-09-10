<template>
    <form class="register-form">
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
                    v-model:value="form.fields.lastName"
                    v-model:error="form.errors.lastName"
                    label="Lastname"
                    placeholder="...и фамилия"
                    theme="outlined"
                    type="text"
                />
            </div>
        </div>
    </form>
</template>

<script setup lang="ts">
import { registerForm as form } from '~/entities/objects/forms/register/registerForm';
import type { User } from '~/entities/interfaces/user/User';
import { useUserStore } from '~/modules/user/stores/userStore';
import type { BaseErrorResponse } from '~/entities/interfaces/responses/BaseErrorResponse';
import type { IRegisterFormErrors } from '~/entities/interfaces/forms/register/IRegisterFormErrors';

const authService = useAuthService();

const { setUserData } = useUserStore();

const register = async () => {
    form.clearErrors()

    try {
        const user: User = await authService.register(form.fields);
        setUserData(user);
    } catch (errorResponse) {
        const typedErrorResponse = errorResponse as BaseErrorResponse<IRegisterFormErrors>;
        form.setErrors(typedErrorResponse.data.errors);
    }

};

defineExpose({ register });
</script>

<style scoped lang="scss">

</style>