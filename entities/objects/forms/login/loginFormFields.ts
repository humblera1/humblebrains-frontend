import type { ILoginFormFields } from '~/entities/interfaces/forms/login/ILoginFormFields';

export const loginFormFields: ILoginFormFields = reactive({
    usermail: '',
    password: '',
});