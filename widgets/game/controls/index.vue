<template>
    <div class="controls">
        <div class="controls__sections">
            <section class="controls__section">
                <header class="controls__header">
                    <p class="controls__title">{{ $t('level') }}</p>
                    <p class="controls__title">
                        <span class="controls__title_primary">{{ game.currentUserLevel }}</span>
                        <span>/{{ game.maxLevelNumber }}</span>
                    </p>
                </header>
                <div class="controls__body">
                    <WidgetGameUiSlider
                        v-model="game.currentUserLevel"
                        :min="1"
                        :max="game.maxLevelNumber"
                        :max-available="game.maxUserLevel"
                    />
                </div>
            </section>
            <section class="controls__section">
                <header class="controls__header">
                    <p class="controls__title">{{ $t('warmUp') }}</p>
                    <p class="controls__title">
                        <span class="controls__title_primary">{{ game.warmUpLevelsAmount }}</span>
                        <span>/{{ game.maxWarmUpLevelsAmount }}</span>
                    </p>
                </header>
                <div class="controls__body">
                    <WidgetGameUiSlider
                        v-model="game.warmUpLevelsAmount"
                        :min="0"
                        :max="game.maxWarmUpLevelsAmount"
                        :max-available="game.maxWarmUpLevelsAmount"
                    />
                </div>
            </section>
            <div class="controls__toggles">
                <div class="controls__toggle">
                    <UiToggle v-model="game.infinityGame" />
                    <p class="controls__subtitle">
                        {{ $t('infinityMode') }}
                    </p>
                </div>
                <div class="controls__toggle">
                    <UiToggle v-model="game.withinSession" />
                    <p class="controls__subtitle">
                        {{ $t('withinSession') }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const game = useGameStore();
</script>

<style scoped lang="scss" src="./game-controls.styles.scss" />
