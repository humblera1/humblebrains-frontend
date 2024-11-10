<template>
    <div class="controls">
        <div class="controls__sections">
            <section class="controls__section">
                <header class="controls__header">
                    <p class="controls__title">{{ $t('level') }}</p>
                    <p class="controls__title">
                        <span class="controls__title_primary">{{ level }}</span>
                        <span>/45</span>
                    </p>
                </header>
                <div class="controls__body">
                    <WidgetGameUiSlider v-model="level" :min="1" :max="45" :max-available="42" />
                </div>
            </section>
            <section class="controls__section">
                <header class="controls__header">
                    <p class="controls__title">{{ $t('warmUp') }}</p>
                    <p class="controls__title">
                        <span class="controls__title_primary">{{ warmUpRounds }}</span>
                        <span>/3</span>
                    </p>
                </header>
                <div class="controls__body">
                    <WidgetGameUiSlider v-model="warmUpRounds" :min="0" :max="3" :max-available="3" />
                </div>
            </section>
            <div class="controls__toggles">
                <div class="controls__toggle">
                    <UiToggle v-model="infinityMode" />
                    <p class="controls__subtitle">
                        {{ $t('infinityMode') }}
                    </p>
                </div>
                <div class="controls__toggle">
                    <UiToggle v-model="withinSession" />
                    <p class="controls__subtitle">
                        {{ $t('withinSession') }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const level = ref<number>(10);
const warmUpRounds = ref<number>(1);

const infinityMode = ref<boolean>(false);
const withinSession = ref<boolean>(false);
</script>

<style scoped lang="scss" src="./game-controls.styles.scss" />
