import type { IChangePasswordFormErrors } from '~/entities/interfaces/forms/change-password/IChangePasswordFormErrors';

export const changePasswordFormErrors: IChangePasswordFormErrors = reactive({
    currentPassword: '',
    newPassword: '',
    newPasswordConfirmation: '',
});
