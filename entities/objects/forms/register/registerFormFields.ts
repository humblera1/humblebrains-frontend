import type { IRegisterFormFields } from '~/entities/interfaces/forms/register/IRegisterFormFields';

export const registerFormFields: IRegisterFormFields  = reactive({
    email: '',
    password: '',
    username: '',
    firstName: '',
    secondName: '',
})