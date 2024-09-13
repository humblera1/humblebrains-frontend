// import type { AbstractFormErrorInterface } from '~/entities/interfaces/forms/AbstractFormErrorInterface';

export interface BaseResponse<T> {
    message?: string;
    data: T;
    // errors?: AbstractFormErrorInterface;
    errors?: {};
}
