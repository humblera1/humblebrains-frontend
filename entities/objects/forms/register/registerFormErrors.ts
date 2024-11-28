import type { IRegisterFormErrors } from '~/entities/interfaces/forms/register/IRegisterFormErrors';

export const registerFormErrors: IRegisterFormErrors = reactive({
    email: '',
    password: '',
    username: '',
    name: '',
});
