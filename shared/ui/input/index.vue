<template>
    <div :class="['input', 'input_' + theme, { 'input_invalid': hasError }]">
        <div class="input__wrapper">
            <label :for="props.id" :class="['input__label', { 'input__label_required': required }]">{{ props.label }}</label>
            <input
                :id="props.id"
                v-model="model"
                :name="props.id"
                :type="props.type"
                :maxlength="props.maxlength"
                :placeholder="props.placeholder"
                :readonly="readonly"
                autocomplete="off"
                class="input__input"
                @change="() => emit('change')"
            >
            <div class="input__icon">
                <slot name="trailing" />
            </div>
        </div>
        <div v-show="hasError" class="input__error">
            <p>{{ props.error }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Input } from '~/shared/ui/input/input.types';

const model = defineModel<string>();

const props = withDefaults(defineProps<Input>(), {
    type: 'text',
    theme: 'default',
    maxlength: 255,
    required: false,
    error: '',
    readonly: false,
});

const hasError = computed((): boolean => {
    return props.error !== '';
});
</script>

<style scoped lang="scss">
    .input {
        display: flex;
        flex-direction: column;
        gap: 6px;
        width: 100%;

        &__wrapper {
            position: relative;
            display: flex;
            flex-direction: column;
            gap: 3px;
            width: 100%;
            height: 60px;
            padding: 10px 16px 16px 20px;
            border-radius: 18px;
            border: 1px solid var(--input-border);
            background-color: var(--input-bg);

            transition: border-color 0.2s ease-in-out;

            &:has(> input:focus:not([readonly])) {
                border: 1px solid var(--input-border-focused);
            }

            @include mobile {
                gap: 6px;
                padding: 12px 16px;
            }
        }

        &__icon {
            position: absolute;
            right: 16px;
            top: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            min-width: 16px;
            width: 16px;
            height: 18px;
            margin: auto;
            color: var(--input-icon);

            svg {
                object-fit: contain;
                width: 100%;
                height: 100%;
            }
        }

        &__label {
            @include mainFont(500, 12, var(--input-label));

            @include mobile {
                @include mainFont(500, 10, var(--input-label));
            }

            &_required:after {
                content: ' *';
                color: var(--input-asterisk);
            }
        }

        &__input {
            width: calc(100% - 32px);
            outline: none;
            border: none;
            background-color: transparent;

            @include mainFont(600, 14, var(--text-primary));

            @include mobile {
                @include mainFont(600, 12, var(--text-primary));
            }

            &::placeholder {
                @include mainFont(500, 14, var(--input-icon), 1, italic);

                @include mobile {
                    @include mainFont(500, 12, var(--input-icon), 1, italic);
                }
            }
        }

        &__error {
             @include mainFont(500, 12, var(--input-invalid));
        }

        &_invalid {
            border-color: var(--input-border);

            .input__wrapper {
                border-color: var(--input-invalid);
            }

            .input__icon,
            .input__label
            {
                color: var(--input-invalid);
            }
        }
    }
</style>