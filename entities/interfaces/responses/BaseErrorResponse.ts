import { FetchError } from 'ofetch';

export interface BaseErrorResponse<E> extends FetchError {
    // тут мы объявляем, что в ответе всегда будет присутствовать поле data
    // это не то же самое, что использование FetchError<{ message: string, errors: any }>
    data: {
        message: string;
        errors: E;
    };
}
