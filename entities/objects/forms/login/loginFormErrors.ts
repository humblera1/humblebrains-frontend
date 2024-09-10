import type { ILoginFormErrors } from '~/entities/interfaces/forms/login/ILoginFormErrors';

export const loginFormErrors: ILoginFormErrors = reactive({
    usermail: '',
    password: '',
    general: '',
});
