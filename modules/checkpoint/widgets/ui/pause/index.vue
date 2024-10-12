<template>
    <div class="checkpoint-pause" @click="setPause">
        <IconGamePause />
    </div>
</template>

<script setup lang="ts">
import { WidgetModalPauseTest } from '#components';
import { useCheckpointStore } from '~/modules/checkpoint/stores/checkpointStore';

const checkpoint = useCheckpointStore();

const { openModal } = useHumbleModal({ closeOnClickOutside: false, closeOnEsc: false });

const setPause = () => {
    checkpoint.setPause();
    openModal(WidgetModalPauseTest);
};
</script>

<style scoped lang="scss" src="./checkpoint-ui-pause.styles.scss" />
