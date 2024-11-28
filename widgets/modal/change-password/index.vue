<template>
    <UiModal>
        <div class="change-password">
            <Transition name="fade" mode="out-in">
                <div v-if="saved" class="change-password__success">
                    <IconCheckCircle />
                    <p>{{ $t(successMessage) }}</p>
                </div>
                <UiPreloader v-else-if="isPending" />
                <div v-else class="change-password__content">
                    <Transition name="slide" mode="out-in">
                        <section v-if="state === PasswordWindowStateEnum.Changing" class="change-password__section">
                            <div class="change-password__key">
                                <IconKey />
                            </div>
                            <h2 class="change-password__title change-password__title_changing">{{ $t('passwordChanging') }}</h2>
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
                            <UiButton class="change-password__button" @click="onChange">{{ $t('confirm') }}</UiButton>
                        </section>
                        <section v-else-if="state === PasswordWindowStateEnum.Resetting" class="change-password__section">
                            <div class="change-password__key">
                                <IconKey />
                            </div>
                            <h2 class="change-password__title change-password__title_resetting">{{ $t('passwordResetting') }}</h2>
                            <p class="change-password__subtitle">{{ $t('passwordResettingInstructions') }}</p>
                            <form class="change-password__form" @submit.prevent>
                                <UiInput
                                    id="email-to-reset"
                                    v-model:value="emailToReset"
                                    v-model:error="emailError"
                                    :label="$t('email')"
                                    type="text"
                                    theme="outlined"
                                    required
                                />
                            </form>
                            <UiButton class="change-password__button" @click="onReset">{{ $t('send') }}</UiButton>
                        </section>
                    </Transition>
                    <Transition name="fade">
                        <IconChevron
                            v-show="state === PasswordWindowStateEnum.Resetting"
                            class="change-password__chevron"
                            @click="handleChange"
                        />
                    </Transition>
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
import { useUserStore } from '~/modules/user/stores/userStore';

const enum PasswordWindowStateEnum {
    Changing,
    Resetting,
}

const user = useUserStore();

const service = useAuthService();

const { closeModal } = useHumbleModal();

const state = ref<PasswordWindowStateEnum>(PasswordWindowStateEnum.Changing);

const isPending = ref<boolean>(false);
const saved = ref<boolean>(false);

const emailToReset = ref<string>('');
const emailError = ref<string>('');

let timerId: ReturnType<typeof setTimeout> | null = null;

const successMessage = computed((): string => {
    switch (state.value) {
        case PasswordWindowStateEnum.Changing:
            return 'newPasswordSuccessfullySaved';
        case PasswordWindowStateEnum.Resetting:
            return 'instructionsSentToYourEmail';
    }
});

const resetTimer = () => {
    if (timerId) {
        clearTimeout(timerId);
        timerId = null;
    }
};

const onReset = async () => {
    isPending.value = true;

    if (emailToReset.value === '') {
        return;
    }

    try {
        await service.forgotPassword(emailToReset.value);

        saved.value = true;

        timerId = setTimeout(() => {
            closeModal();
        }, 2000);
    } catch (errorResponse) {
        const unknownResponse = errorResponse as FetchError;

        if (unknownResponse.statusCode === ResponseStatusCodeEnum.UnprocessableEntity) {
            const validationErrorResponse = unknownResponse as IValidationErrorResponse<any>;

            emailError.value = validationErrorResponse.data.errors.email as string;
        } else {
            // todo: обработчик неизвестной ошибки
            // eslint-disable-next-line no-console
            console.log('Неизвестная ошибка');
        }

        isPending.value = false;
    }
};

const onChange = async () => {
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
    state.value = PasswordWindowStateEnum.Resetting;
};

const handleChange = () => {
    state.value = PasswordWindowStateEnum.Changing;
};

onMounted(() => {
    emailToReset.value = user.email;
});

onUnmounted(() => {
    resetTimer();
    form.reset();
    emailError.value = '';
    state.value = PasswordWindowStateEnum.Changing;
});
</script>

<style scoped lang="scss" src="./change-password-modal.styles.scss" />
