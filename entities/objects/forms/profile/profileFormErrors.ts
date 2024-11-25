import type { IProfileFormErrors } from '~/entities/interfaces/forms/profile/IProfileFormErrors';

export const profileFormErrors: IProfileFormErrors = reactive({
    email: '',
    name: '',
    username: '',
    birthday: '',
});
