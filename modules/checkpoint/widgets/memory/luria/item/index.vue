<template>
    <div class="item">
        <span v-if="item.type === LuriaItemTypeEnum.word">{{ item.content }}</span>
        <img v-else :src="item.content.path" :alt="item.content.name" />
    </div>
</template>

<script setup lang="ts">
import type { LuriaItemProps } from '~/modules/checkpoint/widgets/memory/luria/item/luria-item.types';
import { LuriaItemTypeEnum } from '~/modules/checkpoint/entities/enums/luria/LuriaItemTypeEnum';

const { item } = defineProps<LuriaItemProps>();
</script>

<style scoped lang="scss"></style>
