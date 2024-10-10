<template>
    <div class="checkpoint-pause" @click="openModal(WidgetModalPauseTest)">
        <IconGamePause />
    </div>
</template>

<script setup lang="ts">
import { WidgetModalPauseTest } from '#components';

const { openModal } = useHumbleModal();
</script>

<style scoped lang="scss" src="./checkpoint-ui-pause.styles.scss" />
