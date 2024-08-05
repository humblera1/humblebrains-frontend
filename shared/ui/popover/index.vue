<template>
    <div v-on-click-outside="closePopover" :class="popoverClasses">
        <slot />
        {{ model }}
        <button v-if="closeButton" class="popover__close">
            <IconCross @click="closePopover" />
        </button>
    </div>
</template>

<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components';
import type {Popover} from "~/shared/ui/popover/popover.types";

const props = withDefaults(defineProps<Popover>(), {
    align: 'left',
    position: 'under',
    closeButton: true,
});

const model = defineModel<boolean>();

const popoverClasses = computed(() => {
    return ['popover', `popover_${props.align}`, `popover_${props.position}`, model.value ? 'popover_active' : ''];
});

const closePopover = () => {
    model.value = false;
};
</script>

<style scoped lang="scss" src="./popover.styles.scss"></style>
