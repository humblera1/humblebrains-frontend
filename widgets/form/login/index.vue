<template>
    <form class="login-form" @submit="console.log('submitted')">
        <UiInput
            id="email-signin"
            v-model:value="loginForm.usermail"
            v-model:error="loginFormErrors.usermail"
            :label="$t('usernameOrEmail')"
            placeholder="Введите почту"
            type="text"
            required
        >
            <template #trailing>
                <IconEnvelope />
            </template>
        </UiInput>
        <UiInput
            id="password-signin"
            v-model:value="loginForm.password"
            v-model:error="loginFormErrors.password"
            :label="$t('password')"
            placeholder="Введите пароль"
            type="password"
            required
        >
            <template #trailing>
                <IconLock />
            </template>
        </UiInput>
        {{ loginFormErrors.general }}
    </form>
</template>

<script setup lang="ts">
import type { LoginForm } from '~/entities/interfaces/forms/login/LoginForm';
import type { LoginFormErrors } from '~/entities/interfaces/forms/login/LoginFormErrors';
import { useUserStore } from '~/modules/user/stores/userStore';
import type { User } from '~/entities/interfaces/user/User';
import type { BaseErrorResponse } from '~/entities/interfaces/responses/BaseErrorResponse';

const authService = useAuthService();

const { setErrors, clearErrors } = useFormService();
const { setUserData } = useUserStore();

const loginForm: LoginForm = reactive({
    usermail: '',
    password: '',
});

const loginFormErrors: LoginFormErrors = reactive({
    usermail: '',
    password: '',
    general: '',
});

const login = async () => {
    try {
        const user: User = await authService.login(loginForm);

        setUserData(user);
    } catch (errorResponse) {
        // cast response to a specific type
        const typedErrorResponse = errorResponse as BaseErrorResponse;

        setErrors(typedErrorResponse.data.errors, loginFormErrors);
    }
};

defineExpose({ login });

onUnmounted(() => {
    clearErrors(loginFormErrors);
});
</script>

<style scoped lang="scss"></style>
