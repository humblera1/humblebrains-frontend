<template>
    <div class="datepicker">
        <VueDatePicker
            v-model="value"
            name="birthday"
            :min-date="minDate"
            :max-date="maxDate"
            :format="dateFormat"
            :enable-time-picker="false"
            :show-time="false"
            no-today
            @update:model-value="handleDateChange"
            @open="isActive = true"
            @closed="isActive = false"
        >
            <template #trigger>
                <div class="datepicker__wrapper" :class="{ datepicker__wrapper_focused: isActive }">
                    <label :class="['datepicker__label', { datepicker__label_required: required }]">{{ props.label }}</label>
                    <div class="datepicker__content">
                        {{ formatLocaleDate(value) }}
                    </div>
                    <div class="datepicker__icon">
                        <IconCalendarDays />
                    </div>
                    <div v-show="error" class="datepicker__error">
                        <p>{{ error }}</p>
                    </div>
                </div>
            </template>
            <template #month="{ text }">
                {{ $t(text.toLowerCase()) }}
            </template>
            <template #month-overlay-value="{ text }">
                {{ $t(text.toLowerCase()) }}
            </template>
            <template #calendar-header="{ day }">
                <span>{{ $t(day.toLowerCase()) }}</span>
            </template>
            <template #calendar-icon>
                <IconCalendarDays class="datepicker__calendar" />
            </template>
            <template #action-row="{ internalModelValue, selectDate }">
                <Transition name="fade">
                    <div v-if="internalModelValue" class="datepicker__controls">
                        <p class="datepicker__preview">{{ formatLocaleDate(internalModelValue as Date) }}</p>
                        <UiButton size="small" class="datepicker__button" @click="selectDate">{{ $t('save') }}</UiButton>
                    </div>
                </Transition>
            </template>
        </VueDatePicker>
    </div>
</template>

<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { format } from 'date-fns';
import type { DatePickerProps } from '~/shared/ui/date-picker/date-picker.types';

const props = defineProps<DatePickerProps>();

const emit = defineEmits(['change']);

const value = defineModel<string>('value');
const error = defineModel<string>('error');

const minDate = new Date(new Date().setFullYear(new Date().getFullYear() - 100));
const maxDate = new Date();

const { locale } = useI18n();

const isActive = ref<boolean>(false);

const defaultDateFormat = 'MM.dd.yyyy';

const dateFormat = computed((): string => {
    switch (locale.value) {
        case 'ru':
            return 'dd.MM.yyyy';
        default:
            return 'MM.dd.yyyy';
    }
});

const formatLocaleDate = (date: Date | string | undefined): string => {
    if (date) {
        return format(date, dateFormat.value);
    }

    return '';
};

const formatDate = (date: Date | string | undefined): string => {
    if (date) {
        return format(date, defaultDateFormat);
    }

    return '';
};

const handleDateChange = (newValue: Date | null) => {
    if (newValue) {
        value.value = formatDate(newValue);

        error.value = '';

        emit('change', newValue);
    }
};
</script>

<style scoped lang="scss" src="./date-picker.styles.scss" />
