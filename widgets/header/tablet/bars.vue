<template>
    <div :class="['bars', { bars_opened: isMenuOpened }]">
        <div class="bars__badge" @click="toggleMenu">
            <Transition>
                <IconCross v-if="isMenuOpened" />
                <IconBars v-else />
            </Transition>
        </div>
        <Transition name="fade">
            <div v-show="isMenuOpened" class="bars__menu">
                <WidgetSidebar />
                <div class="bars__controls">
                    <WidgetLanguageSelect />
                    <WidgetColorMode />
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
const isMenuOpened = ref<boolean>(false);

const toggleMenu = () => {
    isMenuOpened.value = !isMenuOpened.value;
};
</script>

<style scoped lang="scss" src="./header-tablet-bars.styles.scss" />
