import type { AbstractFormErrorInterface } from '~/entities/interfaces/forms/AbstractFormErrorInterface';

export const useFormService = () => {
    // Helps to setting errors from response to provided form
    const setErrors = (errorsToSet: AbstractFormErrorInterface, formFields: AbstractFormErrorInterface) => {
        for (const field in errorsToSet) {
            formFields[field] = errorsToSet[field];
        }
    };

    // Clears all errors in form when the component is unmounted
    const clearErrors = (formFields: AbstractFormErrorInterface) => {
        for (const field in formFields) {
            formFields[field] = '';
        }
    };

    return { setErrors, clearErrors };
};
