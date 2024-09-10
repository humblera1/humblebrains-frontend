import { BaseForm } from '~/entities/classes/forms/BaseForm';
import { loginFormErrors } from '~/entities/objects/forms/login/loginFormErrors';
import { loginFormFields } from '~/entities/objects/forms/login/loginFormFields';

export const loginForm = new BaseForm(loginFormFields, loginFormErrors);
