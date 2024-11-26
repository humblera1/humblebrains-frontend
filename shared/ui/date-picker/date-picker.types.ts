export interface DatePickerProps {
    id: string;
    label: string;
    // theme?: 'default' | 'outlined';
    required?: boolean;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    error?: string;
}
