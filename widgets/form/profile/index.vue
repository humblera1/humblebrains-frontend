<template>
    <form class="profile-form" @submit.prevent>
        <div class="profile-form__group">
            <UiInput
                id="name"
                v-model:value="form.fields.name"
                v-model:error="form.errors.name"
                :label="$t('name')"
                type="text"
                theme="outlined"
                required
                @change="updateProfile"
            />
            <UiDatePicker
                id="age"
                v-model:value="form.fields.birthday"
                v-model:error="form.errors.birthday"
                :label="$t('age')"
                type="age"
                required
                @change="updateProfile"
            />
        </div>
        <UiInput
            id="username"
            v-model:value="form.fields.username"
            v-model:error="form.errors.username"
            :label="$t('username')"
            type="text"
            required
            @change="updateProfile"
        />
        <UiInput
            id="email"
            v-model:value="form.fields.email"
            v-model:error="form.errors.email"
            :label="$t('email')"
            type="text"
            required
            @change="updateProfile"
        />
    </form>
</template>

<script setup lang="ts">
import { FetchError } from 'ofetch';
import { profileForm as form } from '~/entities/objects/forms/profile/profileForm';
import { useUserStore } from '~/modules/user/stores/userStore';
import { ResponseStatusCodeEnum } from '~/entities/enums/ResponseStatusCodeEnum';
import type { IValidationErrorResponse } from '~/entities/interfaces/responses/auth/IValidationErrorResponse';
import type { IProfileFormErrors } from '~/entities/interfaces/forms/profile/IProfileFormErrors';
import { ProfileFormStatusEnum } from '~/entities/enums/profile/ProfileFormStatusEnum';

const authService = useAuthService();

const user = useUserStore();

const model = defineModel<ProfileFormStatusEnum | undefined>();

let timerId: ReturnType<typeof setTimeout> | null = null;

const resetTimer = () => {
    if (timerId) {
        clearTimeout(timerId);
        timerId = null;
    }
};

const resetStatus = () => {
    timerId = setTimeout(() => {
        model.value = undefined;
    }, 2000);
};

const updateProfile = async () => {
    resetTimer();

    model.value = ProfileFormStatusEnum.Updating;

    try {
        const response = await authService.update(form.fields);

        if (response.data.personalData) {
            user.setPersonalData(response.data.personalData);
        }

        model.value = ProfileFormStatusEnum.Success;
        resetStatus();
    } catch (errorResponse) {
        const unknownResponse = errorResponse as FetchError;

        if (unknownResponse.statusCode === ResponseStatusCodeEnum.UnprocessableEntity) {
            const validationErrorResponse = unknownResponse as IValidationErrorResponse<IProfileFormErrors>;

            form.setErrors(validationErrorResponse.data.errors);
        } else {
            // todo: обработчик неизвестной ошибки
            // eslint-disable-next-line no-console
            console.log('Неизвестная ошибка');
        }

        model.value = ProfileFormStatusEnum.Failure;
        resetStatus();
    }
};

const hydrateForm = async () => {
    await user.getSetupPromise();

    form.fields.name = user.name;
    form.fields.username = user.username;
    form.fields.email = user.email;
};

onMounted(() => {
    hydrateForm();
});

onUnmounted(() => {
    form.clearErrors();
    resetTimer();
});
</script>

<style scoped lang="scss">
.profile-form {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &__group {
        display: grid;
        grid-template-columns: 3fr 2fr;
        gap: 8px;
    }
}
</style>
