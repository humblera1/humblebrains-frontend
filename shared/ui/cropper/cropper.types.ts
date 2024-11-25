export interface CropperProps {
    image: string | File | Blob;
    saveOriginalResolution?: boolean;

    /**
     * When working with very large images or limited memory environments, you can optimize resource usage by setting this option to true.
     *
     * You can defer the creation of Blob, File, or Base64 data
     * until you actually need it, reducing unnecessary processing and memory usage.
     *
     * Now you need to use one of methods getBlob(), getFile(), or getBase64() to generate the desired output.
     */
    lazyEvaluation?: boolean;

    /**
     * When lazyEvaluation is set to false, the image will be returned as a Blob, File, or Base64 data immediately with @cropped event.
     */
    returnAs?: 'File' | 'Blob' | 'Base64';
}

/**
 * Methods.
 */
export interface CropperExposedMethods {
    getBlob: () => Promise<Blob | null>;
    getFile: () => Promise<File | null>;
    getBase64: () => Promise<string | null>;
}

/**
 * Cropped event payload.
 */
export type CroppedEventPayload = null | string | File | Blob;

/**
 * Type for the emits.
 */
export type CroppedEvent = {
    (e: 'ready'): void;
    (e: 'cropped', payload: CroppedEventPayload): void;
};
