import type { IResetPasswordFormErrors } from '~/entities/interfaces/forms/reset-password/IResetPasswordFormErrors';

export const resetPasswordFormErrors: IResetPasswordFormErrors = reactive({
    currentPassword: '',
    newPassword: '',
    newPasswordConfirmation: '',
});
