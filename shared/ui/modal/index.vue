<template>
    <div class="modal__container">
        <div :class="['modal', `modal_${position}`]">
            <button v-if="!withoutCloseBtn" class="modal__close" @click="closeModal"><IconCross /></button>
            <div class="modal__content">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Modal } from '~/shared/ui/modal/modal.types';

const { closeModal } = useHumbleModal();

withDefaults(defineProps<Modal>(), {
    withoutCloseBtn: false,
    position: 'center',
});
</script>

<style scoped lang="scss" src="./modal.styles.scss"></style>
