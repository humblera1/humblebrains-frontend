export interface Input {
    id: string;
    label: string;
    type: 'password' | 'number' | 'text';
    theme?: 'default' | 'outlined';
    maxLength?: number;
    required?: boolean;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    error?: string;
}
