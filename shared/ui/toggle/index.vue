<template>
    <div :class="['toggle', { toggle_on: model }]" @click="toggle">
        <div class="toggle__switch"></div>
    </div>
</template>

<script setup lang="ts">
const model = defineModel<boolean>();
const toggle = () => {
    model.value = !model.value;
};
</script>

<style scoped lang="scss" src="./toggle.styles.scss" />
