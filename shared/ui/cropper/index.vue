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
const cropSize = ref({ width: 50, height: 50 });
const cropPosition = ref({ x: 0, y: 0 });

const startResize = (event: MouseEvent, corner: string) => {
    event.preventDefault();
    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = cropSize.value.width;
    const startHeight = cropSize.value.height;

    const onMouseMove = (moveEvent: MouseEvent) => {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;
        const newSize = Math.max(startWidth + dx, startHeight + dy);

        cropSize.value.width = newSize;
        cropSize.value.height = newSize;
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

    const cropperWidth = cropper.value?.clientWidth || 0;
    const cropperHeight = cropper.value?.clientHeight || 0;

    // console.log('w: ' + cropperWidth);
    // console.log('h: ' + cropperHeight);

    const onMouseMove = (moveEvent: MouseEvent) => {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        // Calculate new position
        let newX = startLeft + dx;
        let newY = startTop + dy;

        // console.log('newX: ' + newX);
        console.log('newY: ' + newY);
        console.log('constrainedY: ' + Math.min(newY, cropperHeight));

        newX = Math.max(0, Math.min(newX, cropperWidth));
        newY = Math.min(newY, cropperHeight - cropSize.value.height);

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
    if (cropArea.value) {
        cropPosition.value.x = cropArea.value.offsetLeft;
        cropPosition.value.y = cropArea.value.offsetTop;
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
        justify-content: center;
        align-items: center;
    }

    .crop-area {
        cursor: move;
        z-index: 11;
        position: relative;
        width: 50%;
        height: 50%;
        box-sizing: border-box;
    }

    .crop-circle {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.65);
        pointer-events: none;
    }

    .resize-handle {
        position: absolute;
        width: 10px;
        height: 10px;
        background-color: #fff;
    }

    .top-left {
        cursor: nwse-resize;
        top: -5px;
        left: -5px;
    }

    .top-right {
        cursor: nesw-resize;
        top: -5px;
        right: -5px;
    }

    .bottom-left {
        cursor: nesw-resize;
        bottom: -5px;
        left: -5px;
    }

    .bottom-right {
        cursor: nwse-resize;
        bottom: -5px;
        right: -5px;
    }
}
</style>
