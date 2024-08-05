<template>
    <ClientOnly>
        <div :class="['color-mode', isDark ? 'color-mode_dark' : '']" @click="isDark = !isDark">
            <div class="color-mode__circle">
                <IconColorModeSun />
            </div>
            <p class="color-mode__label">{{ isDark ? 'Darkmode' : 'Daymode' }}</p>
        </div>
    </ClientOnly>
    {{ colorMode }}
</template>

<script setup lang="ts">
const colorMode = useColorMode();

const isDark = computed({
    get() {
        return colorMode.value === 'dark';
    },
    set() {
        colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
    },
});
</script>

<style scoped lang="scss">
.color-mode {
    position: relative;
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 16px;
    min-width: 155px;
    width: 155px;
    height: 50px;
    border-radius: 100px;
    padding: 5px;
    background-color: var(--blue-badge);

    &_dark {
        .color-mode__circle {
            transform: translateX(calc(150px - 40px - 5px));
        }
    }

    svg {
        color: var(--white-to-black);
    }

    &__circle {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 40px;
        border-radius: 100%;
        background-color: var(--blue-secondary);
    }

    &__label {
        @include mainFont(400, 16, var(--text-gray-to-light));
    }
}

</style>