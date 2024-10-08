<template>
    <div class="checkpoint-layout">
        <div class="checkpoint-layout__inner">
            <section class="checkpoint-layout__header">
                <div class="checkpoint-layout__widgets">
                    <WidgetCheckpointUiProgress />
                </div>
            </section>
            <section class="checkpoint-layout__field">
                <slot />
            </section>
        </div>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss" src="./checkpoint-ui-layout.styles.scss" />
