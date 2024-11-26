export interface Button {
    to?: string;
    size?: 'small' | 'medium';
    theme?:
        | 'pure-blue' // Blue in light theme and blue in dark one
        | 'gray-blue' // Blue in light theme and gray in dark one
        | 'outline'; // Outlined
    disabled?: boolean;
    full?: boolean;
}
