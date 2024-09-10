export class BaseForm<F, E> {
    readonly fields: F;
    readonly errors: E;

    constructor(fields: F, errors: E) {
        this.fields = fields;
        this.errors = errors;
    }

    setError<K extends keyof E>(field: K, error: E[K]): void {
        this.errors[field] = error;
    }

    setErrors(errorsToSet: E): void {
        for (const field in errorsToSet) {
            if (Object.prototype.hasOwnProperty.call(this.errors, field)) {
                this.setError(field as keyof E, errorsToSet[field] as E[keyof E]);
            }
        }
    }

    clearErrors(): void {
        for (const field in this.errors) {
            if (Object.prototype.hasOwnProperty.call(this.errors, field)) {
                this.setError(field as keyof E, '' as E[keyof E]);
            }
        }
    }
}
