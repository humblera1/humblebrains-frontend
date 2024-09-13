import type { FetchError } from 'ofetch';

interface IValidationErrorData<E> {
    message: string;
    errors: E;
}

export interface IValidationErrorResponse<E> extends FetchError {
    data: IValidationErrorData<E>;
}
