<template>
    <div ref="cropper" class="cropper">
        <div class="cropper__overlay">
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
        <img v-if="image" :src="image" alt="Uploaded Image" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { CropperProps } from '~/shared/ui/cropper/cropper.types';

defineProps<CropperProps>();

const cropper = ref<HTMLDivElement | null>(null);
const cropArea = ref<HTMLDivElement | null>(null);

const handleSize = 8 / 2;

const cropSize = ref({ width: 0, height: 0 });
const cropPosition = ref({ x: 0, y: 0 });

const getEventCoordinates = (event: MouseEvent | TouchEvent) => {
    if (event instanceof MouseEvent) {
        return { x: event.clientX, y: event.clientY };
    } else if (event instanceof TouchEvent) {
        const touch = event.touches[0];
        return { x: touch.clientX, y: touch.clientY };
    }
    return { x: 0, y: 0 };
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
