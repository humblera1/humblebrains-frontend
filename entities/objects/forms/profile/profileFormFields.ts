import type { IProfileFormFields } from '~/entities/interfaces/forms/profile/IProfileFormFields';

export const profileFormFields: IProfileFormFields = reactive({
    email: '',
    name: '',
    username: '',
    birthday: '',
});
