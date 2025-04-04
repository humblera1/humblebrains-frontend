import type { IResetPasswordFormFields } from '~/entities/interfaces/forms/reset-password/IResetPasswordFormFields';

export const resetPasswordFormFields: IResetPasswordFormFields = reactive({
    email: '',
    token: '',
    password: '',
    passwordConfirmation: '',
});
