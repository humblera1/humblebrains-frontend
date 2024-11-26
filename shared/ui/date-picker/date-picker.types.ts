export interface DatePickerProps {
    id: string;
    label: string;
    // theme?: 'default' | 'outlined';
    type?: 'age' | 'default';
    required?: boolean;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    error?: string;
}
