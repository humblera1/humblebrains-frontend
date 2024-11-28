import { BaseForm } from '~/entities/classes/forms/BaseForm';
import { changePasswordFormFields } from '~/entities/objects/forms/change-password/changePasswordFormFields';
import { changePasswordFormErrors } from '~/entities/objects/forms/change-password/changePasswordFormErrors';

export const changePasswordForm = new BaseForm(changePasswordFormFields, changePasswordFormErrors);
