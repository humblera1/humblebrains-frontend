<template>
    <div class="reset-password">
        <Transition name="fade" mode="out-in">
            <div v-if="saved" class="reset-password__success">
                <IconCheckCircle />
                <p>{{ $t('newPasswordSuccessfullySaved') }}</p>
            </div>
            <UiPreloader v-else-if="isPending" />
            <div v-else class="reset-password__content">
                <div class="reset-password__key">
                    <IconKey />
                </div>
                <h2 class="reset-password__title">{{ $t('passwordResetting') }}</h2>
                <p class="reset-password__subtitle">{{ $t('passwordResettingInstructions') }}</p>
                <form class="reset-password__form" @submit.prevent>
                    <UiInput
                        id="new-password"
                        v-model:value="form.fields.password"
                        v-model:error="form.errors.password"
                        :label="$t('newPassword')"
                        type="password"
                        theme="outlined"
                        required
                    />
                    <UiInput
                        id="new-password-confirmation"
                        v-model:value="form.fields.passwordConfirmation"
                        v-model:error="form.errors.passwordConfirmation"
                        :label="$t('newPasswordConfirmation')"
                        type="password"
                        theme="outlined"
                        required
                    />
                </form>
                <UiButton class="reset-password__button" @click="onSubmit">{{ $t('save') }}</UiButton>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { FetchError } from 'ofetch';
import { resetPasswordForm as form } from '~/entities/objects/forms/reset-password/resetPasswordForm';
import { ResponseStatusCodeEnum } from '~/entities/enums/ResponseStatusCodeEnum';
import type { IValidationErrorResponse } from '~/entities/interfaces/responses/auth/IValidationErrorResponse';
import type { IResetPasswordFormErrors } from '~/entities/interfaces/forms/reset-password/IResetPasswordFormErrors';

const route = useRoute();
const router = useRouter();

const service = useAuthService();

const { closeModal } = useHumbleModal();

const token = route.query.token;
const email = route.query.email;

let timerId: ReturnType<typeof setTimeout> | null = null;

const isPending = ref<boolean>(false);
const saved = ref<boolean>(false);

const resetTimer = () => {
    if (timerId) {
        clearTimeout(timerId);
        timerId = null;
    }
};

const onSubmit = async () => {
    if (form.fields.password !== '' && form.fields.passwordConfirmation !== '') {
        isPending.value = true;

        try {
            await service.resetPassword(form.fields);

            saved.value = true;

            await router.replace({ path: '/' });

            timerId = setTimeout(() => {
                closeModal();
            }, 3000);
        } catch (errorResponse) {
            const unknownResponse = errorResponse as FetchError;

            if (unknownResponse.statusCode === ResponseStatusCodeEnum.UnprocessableEntity) {
                const validationErrorResponse = unknownResponse as IValidationErrorResponse<IResetPasswordFormErrors>;

                form.setErrors(validationErrorResponse.data.errors);
            } else {
                // todo: обработчик неизвестной ошибки
                // eslint-disable-next-line no-console
                console.log('Неизвестная ошибка');
            }

            isPending.value = false;
        }
    }
};

const hydrateForm = () => {
    if (email && token && typeof email === 'string' && typeof token === 'string') {
        form.fields.email = email;
        form.fields.token = token;
    }
};

onMounted(() => {
    hydrateForm();
});

onUnmounted(() => {
    form.clearErrors();
    resetTimer();
});
</script>

<style scoped lang="scss" src="./reset-password-modal.styles.scss" />
