<template>
    <div ref="calendar" class="calendar" @click="toggleFilters">
        <IconCalendar />
        <Transition name="fade">
            <ul v-show="isFiltersOpened" ref="filters" class="calendar__filters">
                <li
                    v-for="(value, key) in PeriodEnum"
                    :key="key"
                    :value="value"
                    :class="['calendar__option', { calendar__option_selected: option === value }]"
                    @click="selectOption(value)"
                >
                    {{ $t(value) }}
                </li>
            </ul>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { PeriodEnum } from '~/entities/enums/PeriodEnum';

const option = defineModel<PeriodEnum>();

const isFiltersOpened = ref<boolean>(false);

const filters = ref<HTMLElement | null>(null);
const calendar = ref<HTMLElement | null>(null);

const toggleFilters = () => {
    isFiltersOpened.value = !isFiltersOpened.value;
};

const selectOption = (value: PeriodEnum) => {
    option.value = value;
};

const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node;
    if (isFiltersOpened.value && filters.value && calendar.value && !filters.value.contains(target) && !calendar.value.contains(target)) {
        isFiltersOpened.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped lang="scss" src="./game-ui-calendar.styles.scss" />
