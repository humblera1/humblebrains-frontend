import { FetchError } from 'ofetch';
import type { AbstractFormErrorInterface } from '~/entities/interfaces/forms/AbstractFormErrorInterface';

export interface BaseErrorResponse extends FetchError {
    // тут мы объявляем, что в ответе всегда будет присутствовать поле data
    // это не то же самое, что использование FetchError<{ message: string, errors: any }>
    data: {
        message: string;
        errors: {};
    };
}
