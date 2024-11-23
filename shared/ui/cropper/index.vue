<template>
    <div ref="cropper" class="cropper">
        <div class="overlay">
            <div
                ref="cropArea"
                class="crop-area"
                :style="{
                    width: cropSize.width + 'px',
                    height: cropSize.height + 'px',
                    left: cropPosition.x + 'px',
                    top: cropPosition.y + 'px',
                }"
                @mousedown="startDrag"
            >
                <div class="crop-circle"></div>
                <div class="resize-handle top-left" @mousedown.stop="startResize($event, 'top-left')"></div>
                <div class="resize-handle top-right" @mousedown.stop="startResize($event, 'top-right')"></div>
                <div class="resize-handle bottom-left" @mousedown.stop="startResize($event, 'bottom-left')"></div>
                <div class="resize-handle bottom-right" @mousedown.stop="startResize($event, 'bottom-right')"></div>
            </div>
        </div>
        <img v-if="image" :src="image" alt="Uploaded Image" />
    </div>
</template>

<script setup lang="ts">
import type { CropperProps } from '~/shared/ui/cropper/cropper.types';

defineProps<CropperProps>();

const cropper = ref<HTMLDivElement | null>(null);
const cropArea = ref<HTMLDivElement | null>(null);

const handleSize = 8 / 2;

const cropSize = ref({ width: 0, height: 0 });
const cropPosition = ref({ x: 0, y: 0 });

const startResize = (event: MouseEvent, corner: string) => {
    event.preventDefault();

    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = cropSize.value.width;
    const startHeight = cropSize.value.height;
    const startLeft = cropPosition.value.x;
    const startTop = cropPosition.value.y;

    const cropperRect = cropper.value?.getBoundingClientRect();
    const cropperWidth = cropperRect?.width || 0;
    const cropperHeight = cropperRect?.height || 0;

    const onMouseMove = (moveEvent: MouseEvent) => {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

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

    const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
};

const startDrag = (event: MouseEvent) => {
    event.preventDefault();
    const startX = event.clientX;
    const startY = event.clientY;
    const startLeft = cropPosition.value.x;
    const startTop = cropPosition.value.y;

    const cropperRect = cropper.value?.getBoundingClientRect();
    const cropperWidth = cropperRect?.width || 0;
    const cropperHeight = cropperRect?.height || 0;

    const onMouseMove = (moveEvent: MouseEvent) => {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

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

    const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
};

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

<style scoped lang="scss">
.cropper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 24px;

    img {
        object-fit: cover;
        width: 100%;
        height: 100%;
        filter: brightness(80%);
    }

    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        //justify-content: center;
        //align-items: center;
    }

    .crop-area {
        cursor: move;
        z-index: 11;
        position: relative;
        //top: 50%;
        //left: 50%;
        //transform: translate(50%, 50%);
        width: 50%;
        height: 50%;
        box-sizing: border-box;
    }

    .crop-circle {
        position: absolute;
        //top: 50%;
        //left: 50%;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        //transform: translate(-50%, -50%);
        box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.65);
        pointer-events: none;
    }

    .resize-handle {
        position: absolute;
        width: 8px;
        height: 8px;
        background-color: #fff;
    }

    .top-left {
        cursor: nwse-resize;
        top: -4px;
        left: -4px;
    }

    .top-right {
        cursor: nesw-resize;
        top: -4px;
        right: -4px;
    }

    .bottom-left {
        cursor: nesw-resize;
        bottom: -4px;
        left: -4px;
    }

    .bottom-right {
        cursor: nwse-resize;
        bottom: -4px;
        right: -4px;
    }
}
</style>
