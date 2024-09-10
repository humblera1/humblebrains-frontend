import type { ILoginFormFields } from '~/entities/interfaces/forms/login/ILoginFormFields';
import { BaseForm } from '~/entities/classes/forms/BaseForm';
import type { ILoginFormErrors } from '~/entities/interfaces/forms/login/ILoginFormErrors';

const fields: ILoginFormFields = reactive({
    usermail: '',
    password: '',
});

const errors: ILoginFormErrors = reactive({
    usermail: '',
    password: '',
    general: '',
});

const loginForm = new BaseForm(fields, errors);

export { loginForm };
