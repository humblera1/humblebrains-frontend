<template>
    <div class="network-error">
        <div class="network-error__content">
            <IconExclamationTriangle class="network-error__exclamation" />
            <p class="network-error__message">
                {{ $t('gameSavingError') }}
            </p>
            <UiButton @click="$emit('resend')">
                <template #leading>
                    <IconRepeat />
                </template>
                {{ $t('repeat') }}
            </UiButton>
        </div>
    </div>
</template>

<script setup lang="ts">
defineEmits(['resend']);
</script>

<style scoped lang="scss" src="./network-error.styles.scss" />
