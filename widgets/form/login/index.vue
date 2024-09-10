<template>
    <form class="login-form" @submit="console.log('submitted')">
        <UiInput
            id="email-signin"
            v-model:value="form.fields.usermail"
            v-model:error="form.errors.usermail"
            :label="$t('usermail')"
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
            v-model:value="form.fields.password"
            v-model:error="form.errors.password"
            :label="$t('password')"
            placeholder="Введите пароль"
            type="password"
            required
        >
            <template #trailing>
                <IconLock />
            </template>
        </UiInput>
        {{ form.errors.general }}
    </form>
</template>

<script setup lang="ts">
import type { ILoginFormErrors } from '~/entities/interfaces/forms/login/ILoginFormErrors';
import { useUserStore } from '~/modules/user/stores/userStore';
import type { User } from '~/entities/interfaces/user/User';
import type { BaseErrorResponse } from '~/entities/interfaces/responses/BaseErrorResponse';
import { loginForm as form } from '~/entities/objects/forms/login/loginForm';

const authService = useAuthService();

const { setUserData } = useUserStore();

const login = async () => {
    form.clearErrors();

    try {
        const user: User = await authService.login(form.fields);
        setUserData(user);
    } catch (errorResponse) {
        // cast response to a specific type
        const typedErrorResponse = errorResponse as BaseErrorResponse<ILoginFormErrors>;
        form.setErrors(typedErrorResponse.data.errors);
    }
};

defineExpose({ login });

onUnmounted(() => {
    form.clearErrors();
});
</script>

<style scoped lang="scss"></style>
