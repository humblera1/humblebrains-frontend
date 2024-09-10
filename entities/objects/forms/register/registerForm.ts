import { BaseForm } from '~/entities/classes/forms/BaseForm';
import { registerFormFields } from '~/entities/objects/forms/register/registerFormFields';
import { registerFormErrors } from '~/entities/objects/forms/register/registerFormErrors';

export const registerForm = new BaseForm(registerFormFields, registerFormErrors);