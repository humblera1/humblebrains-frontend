import { BaseForm } from '~/entities/classes/forms/BaseForm';
import { resetPasswordFormFields } from '~/entities/objects/forms/reset-password/resetPasswordFormFields';
import { resetPasswordFormErrors } from '~/entities/objects/forms/reset-password/resetPasswordFormErrors';

export const resetPasswordForm = new BaseForm(resetPasswordFormFields, resetPasswordFormErrors);
