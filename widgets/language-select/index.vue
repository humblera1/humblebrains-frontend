<template>
    <div class="language-select">
        <button class="language-select__display" @click="toggleOpen">
            <span>{{ locale }}</span>
            <span :class="['language-select__arrow', isOpen ? 'language-select__arrow_active' : '']">
                    <IconChevron />
            </span>
        </button>
        <UiPopover v-model="isOpen" :close-button="false" align="right">
            <div class="language-select__controls">
                <NuxtLink
                    v-for="lang in locales"
                    :key="lang"
                    class="language-select__locale"
                    @click="() => changeLanguage(lang)"
                >
                    {{ lang }}
                </NuxtLink>
            </div>
        </UiPopover>
    </div>
</template>

<script setup lang="ts">
const locales = ['ru', 'en'];

const isOpen = ref<boolean>(false);

const { locale, setLocale } = useI18n();

const toggleOpen = () => (isOpen.value = !isOpen.value);

const changeLanguage = (lang: string) => {
    setLocale(lang);
    toggleOpen();
};
</script>

<style scoped lang="scss" src="./language-select.styles.scss"></style>