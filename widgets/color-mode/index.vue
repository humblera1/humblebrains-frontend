<template>
    <ClientOnly>
        <div :class="['color-mode', isDark ? 'color-mode_dark' : '']" @click="changeColorMode">
            <div class="color-mode__circle">
                <IconColorModeMoon :class="isDark ? 'color-mode_visible' : 'color-mode_hidden'" />
                <IconColorModeSun :class="isDark ? 'color-mode_hidden' : 'color-mode_visible'" />
            </div>
            <p class="color-mode__label">{{ isDark ? 'Darkmode' : 'Daymode' }}</p>
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

const changeColorMode = () => {
    // отключаем все анимации в момент смены темы (тени работают плохо при наличии transition)
    const body = document.body;
    body.classList.add('no-transition');

    isDark.value = !isDark.value;

    setTimeout(() => {
        body.classList.remove('no-transition');
    }, 0);
};
</script>

<style scoped lang="scss" src="./color-mode.styles.scss"></style>
