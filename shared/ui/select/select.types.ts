import type { SelectOption } from '~/entities/types/SelectOption';

export type SelectProps = {
    options: SelectOption[];
    defaultOption?: SelectOption | undefined;
    placeholder?: string;
};
