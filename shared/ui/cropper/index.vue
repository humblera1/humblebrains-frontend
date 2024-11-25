<template>
    <div ref="cropper" class="cropper">
        <div class="cropper__overlay">
            <canvas id="canvas" ref="canvas" style="display: none"></canvas>
            <div
                ref="cropArea"
                class="cropper__area"
                :style="{
                    width: cropSize.width + 'px',
                    height: cropSize.height + 'px',
                    left: cropPosition.x + 'px',
                    top: cropPosition.y + 'px',
                }"
                @mousedown="startDrag"
                @touchstart="startDrag"
                @mouseup="endCrop"
                @touchend="endCrop"
            >
                <div class="cropper__circle"></div>
                <div
                    class="resize-handle top-left"
                    @mousedown.stop="startResize($event, 'top-left')"
                    @touchstart.stop="startResize($event, 'top-left')"
                ></div>
                <div
                    class="resize-handle top-right"
                    @mousedown.stop="startResize($event, 'top-right')"
                    @touchstart.stop="startResize($event, 'top-right')"
                ></div>
                <div
                    class="resize-handle bottom-left"
                    @mousedown.stop="startResize($event, 'bottom-left')"
                    @touchstart.stop="startResize($event, 'bottom-left')"
                ></div>
                <div
                    class="resize-handle bottom-right"
                    @mousedown.stop="startResize($event, 'bottom-right')"
                    @touchstart.stop="startResize($event, 'bottom-right')"
                ></div>
            </div>
        </div>
        <img v-if="imageSrc" ref="imageElem" :src="imageSrc" alt="Uploaded Image" @load="onImageLoad" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { CroppedEvent, CropperExposedMethods, CropperProps } from '~/shared/ui/cropper/cropper.types';

const { image, saveOriginalResolution = false, lazyEvaluation = false, returnAs = 'File' } = defineProps<CropperProps>();

const emit = defineEmits<CroppedEvent>();

const canvas = ref<HTMLCanvasElement | null>(null);
const cropper = ref<HTMLDivElement | null>(null);
const cropArea = ref<HTMLDivElement | null>(null);
const imageElem = ref<HTMLImageElement | null>(null);

const handleSize = 8 / 2;

const cropSize = ref({ width: 0, height: 0 });
const cropPosition = ref({ x: 0, y: 0 });

const imageSrc = ref<string | null>(null);

const onImageLoad = () => {
    emit('ready');
};

const convertToSrc = (image: string | File | Blob): Promise<string> => {
    if (typeof image === 'string') {
        return Promise.resolve(image);
    }

    if (image instanceof File || image instanceof Blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;

            reader.readAsDataURL(image);
        });
    }

    throw new Error('Unsupported image type');
};

const getEventCoordinates = (event: MouseEvent | TouchEvent) => {
    if (event instanceof MouseEvent) {
        return { x: event.clientX, y: event.clientY };
    } else if (event instanceof TouchEvent) {
        const touch = event.touches[0];
        return { x: touch.clientX, y: touch.clientY };
    }
    return { x: 0, y: 0 };
};

const mimeType = computed((): string => {
    let type = 'image/png';

    if (imageElem.value) {
        const originalFormat = imageElem.value.src.split('.').pop()?.toLowerCase();

        if (originalFormat === 'jpg' || originalFormat === 'jpeg') {
            type = 'image/jpeg';
        }
    }

    return type;
});

/**
 * The effective scale based on object-fit: cover.
 */
const effectiveScale = computed((): number => {
    if (imageElem.value) {
        // Calculate the scaling factors: actual dimensions of the image / displayed dimensions of the image
        const scaleX = imageElem.value.naturalWidth / imageElem.value.clientWidth;
        const scaleY = imageElem.value.naturalHeight / imageElem.value.clientHeight;

        return Math.min(scaleX, scaleY);
    }

    return 1; // Default scale if no image is loaded
});

/**
 * Offset introduced by object-fit: cover.
 */
const offsetX = computed((): number => {
    if (imageElem.value) {
        return (imageElem.value.naturalWidth - imageElem.value.clientWidth * effectiveScale.value) / 2;
    }

    return 0;
});

/**
 * Offset introduced by object-fit: cover.
 */
const offsetY = computed((): number => {
    if (imageElem.value) {
        return (imageElem.value.naturalHeight - imageElem.value.clientHeight * effectiveScale.value) / 2;
    }

    return 0;
});

/**
 * X & Y coordinates of the top-left corner of the source image to start cropping.
 */
const cropCoordinates = computed((): { x: number; y: number } => {
    if (imageElem.value) {
        return {
            x: cropPosition.value.x * effectiveScale.value + offsetX.value,
            y: cropPosition.value.y * effectiveScale.value + offsetY.value,
        };
    }

    return { x: 0, y: 0 };
});

/**
 * Dimension of source image.
 */
const cropSizeScaled = computed((): number => {
    return cropSize.value.width * effectiveScale.value;
});

const endCrop = async (event: MouseEvent | TouchEvent) => {
    event.preventDefault();

    let output = null;

    if (!lazyEvaluation) {
        switch (returnAs) {
            case 'File':
                output = await getFile();
                break;
            case 'Blob':
                output = await getBlob();
                break;
            case 'Base64':
                output = await getBase64();
                break;
        }
    }

    emit('cropped', output);
};

const startResize = (event: MouseEvent | TouchEvent, corner: string) => {
    event.preventDefault();

    const { x: startX, y: startY } = getEventCoordinates(event);
    const startWidth = cropSize.value.width;
    const startHeight = cropSize.value.height;
    const startLeft = cropPosition.value.x;
    const startTop = cropPosition.value.y;

    const cropperRect = cropper.value?.getBoundingClientRect();
    const cropperWidth = cropperRect?.width || 0;
    const cropperHeight = cropperRect?.height || 0;

    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
        const { x: moveX, y: moveY } = getEventCoordinates(moveEvent);
        const dx = moveX - startX;
        const dy = moveY - startY;

        let newSize;

        switch (corner) {
            case 'top-left':
                newSize = Math.max(startWidth - dx, startHeight - dy);

                if (startLeft + startWidth - newSize < handleSize) {
                    newSize = startLeft + startWidth - handleSize;
                }

                if (startTop + startHeight - newSize < handleSize) {
                    newSize = startTop + startHeight - handleSize;
                }

                cropPosition.value.x = startLeft + (startWidth - newSize);
                cropPosition.value.y = startTop + (startHeight - newSize);

                break;
            case 'top-right':
                newSize = Math.max(startWidth + dx, startHeight - dy);

                if (startTop + startHeight - newSize < handleSize) {
                    newSize = startTop + startHeight - handleSize;
                }

                if (startLeft + newSize > cropperWidth - handleSize) {
                    newSize = cropperWidth - startLeft - handleSize;
                }

                cropPosition.value.y = startTop + (startHeight - newSize);

                break;
            case 'bottom-left':
                newSize = Math.max(startWidth - dx, startHeight + dy);

                if (startLeft + startWidth - newSize < handleSize) {
                    newSize = startLeft + startWidth - handleSize;
                }

                if (startTop + newSize > cropperHeight - handleSize) {
                    newSize = cropperHeight - startTop - handleSize;
                }

                cropPosition.value.x = startLeft + (startWidth - newSize);

                break;
            case 'bottom-right':
                newSize = Math.max(startWidth + dx, startHeight + dy);

                if (startLeft + newSize > cropperWidth - handleSize) {
                    newSize = cropperWidth - startLeft - handleSize;
                }

                if (startTop + newSize > cropperHeight - handleSize) {
                    newSize = cropperHeight - startTop - handleSize;
                }

                break;
        }

        if (newSize) {
            cropSize.value.width = newSize;
            cropSize.value.height = newSize;
        }
    };

    const onEnd = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchmove', onMove);
    document.addEventListener('touchend', onEnd);
};

const startDrag = (event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    const { x: startX, y: startY } = getEventCoordinates(event);
    const startLeft = cropPosition.value.x;
    const startTop = cropPosition.value.y;

    const cropperRect = cropper.value?.getBoundingClientRect();
    const cropperWidth = cropperRect?.width || 0;
    const cropperHeight = cropperRect?.height || 0;

    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
        const { x: moveX, y: moveY } = getEventCoordinates(moveEvent);
        const dx = moveX - startX;
        const dy = moveY - startY;

        let newX = startLeft + dx;
        let newY = startTop + dy;

        newX = Math.max(0, Math.min(newX, cropperWidth - cropSize.value.width - handleSize));
        newY = Math.max(0, Math.min(newY, cropperHeight - cropSize.value.height - handleSize));

        if (dx < 0) {
            newX += handleSize;
        }
        if (dy < 0) {
            newY += handleSize;
        }

        cropPosition.value.x = newX;
        cropPosition.value.y = newY;
    };

    const onEnd = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchmove', onMove);
    document.addEventListener('touchend', onEnd);
};

/**
 *
 */
const getCanvasWithContext = (): HTMLCanvasElement | null => {
    if (canvas.value && imageElem.value) {
        const context = canvas.value.getContext('2d');

        if (context) {
            const croppedImageWidth = saveOriginalResolution ? cropSizeScaled.value : cropSize.value.width;
            const croppedImageHeight = saveOriginalResolution ? cropSizeScaled.value : cropSize.value.height;

            canvas.value.width = croppedImageWidth;
            canvas.value.height = croppedImageHeight;

            context.drawImage(
                imageElem.value, // Source image element
                cropCoordinates.value.x, // X coordinate of the top-left corner of the source image to start cropping
                cropCoordinates.value.y, // Y coordinate of the top-left corner of the source image to start cropping
                cropSizeScaled.value, // Width of the source image to crop
                cropSizeScaled.value, // Height of the source image to crop
                0, // X coordinate on the canvas to place the cropped image
                0, // Y coordinate on the canvas to place the cropped image
                croppedImageWidth, // Width of the cropped image on the canvas
                croppedImageHeight, // Height of the cropped image on the canvas
            );

            return canvas.value;
        }
    }

    return null;
};

/**
 * The use of a Promise in the getBlob method is necessary because the process of converting a canvas to a Blob is asynchronous.
 */
const getBlob = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
        const canvas = getCanvasWithContext();

        if (canvas) {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, mimeType.value);
        } else {
            resolve(null);
        }
    });
};

const getFile = async (): Promise<File | null> => {
    const blob = await getBlob();

    if (blob) {
        const fileName = 'cropped-image.' + mimeType.value.split('/')[1];

        return new File([blob], fileName, { type: mimeType.value });
    }

    return null;
};

const getBase64 = async (): Promise<string | null> => {
    const blob = await getBlob();

    if (blob) {
        return new Promise((resolve) => {
            const reader = new FileReader();

            reader.onloadend = () => {
                resolve(reader.result as string);
            };

            reader.readAsDataURL(blob);
        });
    }

    return null;
};

// Watch for changes to the image prop and convert it to a src
watch(
    () => image,
    async (newImage) => {
        if (newImage) {
            imageSrc.value = await convertToSrc(newImage);
        }
    },
    { immediate: true },
);

defineExpose<CropperExposedMethods>({
    getFile,
    getBlob,
    getBase64,
});

onMounted(() => {
    if (cropper.value) {
        const cropperRect = cropper.value.getBoundingClientRect();

        // Set cropSize to half of the smaller dimension of the cropper
        const size = Math.min(cropperRect.width, cropperRect.height) / 2;
        cropSize.value.width = size;
        cropSize.value.height = size;

        // Center the crop area within the cropper
        cropPosition.value.x = (cropperRect.width - cropSize.value.width) / 2;
        cropPosition.value.y = (cropperRect.height - cropSize.value.height) / 2;
    }
});
</script>

<style scoped lang="scss" src="./cropper.styles.scss" />
