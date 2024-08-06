<template>
    <ClientOnly>
        <div :class="['color-mode', isDark ? 'color-mode_dark' : '']" @click="isDark = !isDark">
            <div class="color-mode__circle">
                <IconColorModeMoon :class="isDark ? 'color-mode_visible' : 'color-mode_hidden'" />
                <IconColorModeSun :class="isDark ? 'color-mode_hidden' : 'color-mode_visible'" />
            </div>
            <p class="color-mode__label" :class="isDark ? 'color-mode__label_dark' : ''">{{ isDark ? 'Darkmode': 'Daymode' }}</p>
        </div>
    </ClientOnly>
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

<style scoped lang="scss" src="./color-mode.styles.scss"></style>