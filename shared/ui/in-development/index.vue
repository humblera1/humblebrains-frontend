<template>
    <div class="in-development">
        <div class="in-development__content">
            <div class="in-development__gears">
                <IconGears />
            </div>
            <p class="in-development__message">{{ $t('sectionInDevelopment') }}</p>
            <UiButton v-if="withButton" :to="localePath('/')" class="in-development__button">
                <template #leading>
                    <IconHouse />
                </template>
                {{ $t('goHome') }}
            </UiButton>
        </div>
    </div>
</template>

<script setup lang="ts">
const { withButton = true } = defineProps<{ withButton?: boolean }>();

const localePath = useLocalePath();
</script>

<style scoped lang="scss" src="./in-development.styles.scss" />
