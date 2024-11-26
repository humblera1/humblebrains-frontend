<template>
    <UiModal>
        <div class="change-password">
            <Transition name="fade" mode="out-in">
                <div v-if="saved" class="change-password__success">
                    <IconCheckCircle />
                    <p>{{ $t('passwordSuccessfullySaved') }}</p>
                </div>
                <UiPreloader v-else-if="isPending" />
                <div v-else class="change-password__content">
                    <div class="change-password__key">
                        <IconKey />
                    </div>
                    <h2 class="change-password__title">{{ $t('passwordChanging') }}</h2>
                    <form class="change-password__form" @submit.prevent>
                        <div class="change-password__current">
                            <UiInput
                                id="current-password"
                                v-model:value="form.fields.currentPassword"
                                v-model:error="form.errors.currentPassword"
                                :label="$t('currentPassword')"
                                type="password"
                                theme="outlined"
                                required
                            />
                            <p class="change-password__reset" @click="handleReset">
                                {{ $t('forgotPassword') }}
                            </p>
                        </div>
                        <UiInput
                            id="new-password"
                            v-model:value="form.fields.newPassword"
                            v-model:error="form.errors.newPassword"
                            :label="$t('newPassword')"
                            type="password"
                            required
                        />
                        <UiInput
                            id="new-password-confirmation"
                            v-model:value="form.fields.newPasswordConfirmation"
                            v-model:error="form.errors.newPasswordConfirmation"
                            :label="$t('newPasswordConfirmation')"
                            type="password"
                            required
                        />
                    </form>
                    <UiButton @click="onSubmit">{{ $t('confirm') }}</UiButton>
                </div>
            </Transition>
        </div>
    </UiModal>
</template>

<script setup lang="ts">
import { FetchError } from 'ofetch';
import { resetPasswordForm as form } from '~/entities/objects/forms/reset-password/resetPasswordForm';
import { useAuthService } from '~/modules/auth/composables/useAuthService';
import { ResponseStatusCodeEnum } from '~/entities/enums/ResponseStatusCodeEnum';
import type { IValidationErrorResponse } from '~/entities/interfaces/responses/auth/IValidationErrorResponse';
import type { IResetPasswordFormFields } from '~/entities/interfaces/forms/reset-password/IResetPasswordFormFields';

const service = useAuthService();

const { closeModal } = useHumbleModal();

const isPending = ref<boolean>(false);
const saved = ref<boolean>(false);

let timerId: ReturnType<typeof setTimeout> | null = null;

const resetTimer = () => {
    if (timerId) {
        clearTimeout(timerId);
        timerId = null;
    }
};

const onSubmit = async () => {
    isPending.value = true;

    try {
        await service.changePassword(form.fields);

        saved.value = true;

        timerId = setTimeout(() => {
            closeModal();
        }, 2000);
    } catch (errorResponse) {
        const unknownResponse = errorResponse as FetchError;

        if (unknownResponse.statusCode === ResponseStatusCodeEnum.UnprocessableEntity) {
            const validationErrorResponse = unknownResponse as IValidationErrorResponse<IResetPasswordFormFields>;

            form.setErrors(validationErrorResponse.data.errors);
        } else {
            // todo: обработчик неизвестной ошибки
            // eslint-disable-next-line no-console
            console.log('Неизвестная ошибка');
        }

        isPending.value = false;
    }
};

const handleReset = () => {
    // todo: handle password reset
};

onUnmounted(() => {
    resetTimer();
    form.reset();
});
</script>

<style scoped lang="scss" src="./change-password-modal.styles.scss" />
