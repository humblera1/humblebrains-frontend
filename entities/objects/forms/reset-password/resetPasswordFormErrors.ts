import type { IResetPasswordFormErrors } from '~/entities/interfaces/forms/reset-password/IResetPasswordFormErrors';

export const resetPasswordFormErrors: IResetPasswordFormErrors = reactive({
    email: '',
    token: '',
    password: '',
    passwordConfirmation: '',
});
