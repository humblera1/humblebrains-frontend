import { profileFormFields } from '~/entities/objects/forms/profile/profileFormFields';
import { profileFormErrors } from '~/entities/objects/forms/profile/profileFormErrors';
import { BaseForm } from '~/entities/classes/forms/BaseForm';

export const profileForm = new BaseForm(profileFormFields, profileFormErrors);
