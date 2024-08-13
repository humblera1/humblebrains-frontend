<template>
    <div v-show="model" class="modal__backdrop" @click="closeModal">
        <div class="modal">
            <div class="modal__inner" @click.stop>
                <button v-if="!withoutCloseBtn" class="modal__close" @click="closeModal"><IconCross /></button>
                <div class="modal__content">
                    <slot />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Modal } from '~/shared/ui/modal/modal.types';

const model = defineModel<boolean>();

withDefaults(defineProps<Modal>(), {
        withoutCloseBtn: false,
    },
);

const closeModal = () => {
    model.value = false;
}
</script>

<style scoped lang="scss" src="./modal.styles.scss"></style>
