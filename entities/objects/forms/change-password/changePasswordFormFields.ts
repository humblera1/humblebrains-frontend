import type { IChangePasswordFormFields } from '~/entities/interfaces/forms/change-password/IChangePasswordFormFields';

export const changePasswordFormFields: IChangePasswordFormFields = reactive({
    currentPassword: '',
    newPassword: '',
    newPasswordConfirmation: '',
});
