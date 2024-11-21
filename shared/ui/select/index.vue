<template>
    <div class="select">
        <div ref="trigger" class="select__trigger" @click="toggleDropdown">
            {{ selectedOption ? selectedOption.label : $t(placeholder) }}
            <IconChevron />
        </div>
        <div v-if="isOpen" ref="dropdown" class="select__dropdown">
            <div v-for="option in options" :key="option.value" class="select__option" @click="selectOption(option)">
                {{ option.label }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { SelectProps } from '~/shared/ui/select/select.types';
import type { SelectOption } from '~/entities/types/SelectOption';

const { options, defaultOption = undefined, placeholder = 'selectOption' } = defineProps<SelectProps>();

const emits = defineEmits(['selected']);

const trigger = ref<HTMLElement | null>(null);
const dropdown = ref<HTMLElement | null>(null);

const isOpen = ref(false);
const selectedOption = ref<SelectOption | null>(null);

function toggleDropdown() {
    isOpen.value = !isOpen.value;
}

function selectOption(option: SelectOption) {
    selectedOption.value = option;
    isOpen.value = false;
    emits('selected', option);
}

const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node;
    if (isOpen.value && dropdown.value && trigger.value && !dropdown.value.contains(target) && !trigger.value.contains(target)) {
        isOpen.value = false;
    }
};

watch(
    () => defaultOption,
    () => {
        if (defaultOption) {
            selectedOption.value = defaultOption;
        }
    },
);

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped lang="scss" src="./select.styles.scss" />
