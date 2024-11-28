import { BaseForm } from '~/entities/classes/forms/BaseForm';
import { resetPasswordFormErrors } from '~/entities/objects/forms/reset-password/resetPasswordFormErrors';
import { resetPasswordFormFields } from '~/entities/objects/forms/reset-password/resetPasswordFormFields';

export const resetPasswordForm = new BaseForm(resetPasswordFormFields, resetPasswordFormErrors);
