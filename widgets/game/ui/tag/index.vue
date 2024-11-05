<template>
    <div :class="['tag', `tag_${size}`]">
        <div class="tag__text">
            {{ tag.label }}
        </div>
    </div>
</template>

<script setup lang="ts">
import type { GameUiTagProps } from '~/widgets/game/ui/tag/game-ui-tag.types';

withDefaults(defineProps<GameUiTagProps>(), {
    size: 'medium',
});
</script>

<style scoped lang="scss" src="./game-ui-tag.styles.scss" />
