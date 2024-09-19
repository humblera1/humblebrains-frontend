<template>
    <div ref="cell" class="cell" @click="handleClick">
        <div v-for="wave in waves" :key="wave.id" class="cell__wave" :style="wave.style" />
    </div>
</template>

<script setup lang="ts">
type Wave = {
    id: number;
    style: {
        width: string;
        height: string;
        left: string;
        top: string;
    };
};

const emit = defineEmits(['select']);

const waves = ref<Wave[]>([]);

const handleClick = (event: MouseEvent): void => {
    makeWave(event);
    emit('select');
};

const makeWave = (event: MouseEvent) => {
    const cell = event.currentTarget as HTMLElement;
    const rect = cell.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width;
    const y = event.clientY - rect.top - rect.width;

    const wave = {
        id: Date.now(),
        style: {
            width: `${rect.width * 2}px`,
            height: `${rect.width * 2}px`,
            left: `${x}px`,
            top: `${y}px`,
        },
    };

    waves.value.push(wave);

    setTimeout(() => {
        waves.value = waves.value.filter((w) => w.id !== wave.id);
    }, 500); // Длительность анимации
};
</script>

<style lang="scss">
.cell {
    position: relative;
    cursor: pointer;

    aspect-ratio: 1/ 1;
    display: flex;
    background-color: var(--matrix-cell);
    overflow: hidden;
    transition: background-color 200ms ease;
    border-radius: 16px;

    &:hover {
        background-color: var(--matrix-cell-hovered);
    }

    &__wave {
        position: absolute;
        border-radius: 50%;
        background-color: var(--matrix-cell-active);
        transform: scale(0);
        animation: wave 500ms linear;
    }

    @keyframes wave {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
}
</style>
