<template>
    <div class="in-development">
        <div class="in-development__content">
            <div class="in-development__gears">
                <IconGears />
            </div>
            <p class="in-development__message">{{ $t('sectionInDevelopment') }}</p>
            <UiButton class="in-development__button">
                <template #leading>
                    <IconHouse />
                </template>
                {{ $t('goHome') }}
            </UiButton>
        </div>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss" src="./in-development.styles.scss" />
