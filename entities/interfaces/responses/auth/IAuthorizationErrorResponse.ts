import { FetchError } from 'ofetch';

interface IAuthorizationErrorData {
    message: string;
}

export interface IAuthorizationErrorResponse extends FetchError {
    data: IAuthorizationErrorData;
}
