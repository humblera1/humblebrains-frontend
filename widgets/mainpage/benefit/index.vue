<template>
    <li class="main-benefit">
        <span :class="`main-benefit__badge main-benefit__badge_${benefit.theme}`">
            <component :is="benefit.icon" class="main-benefit__icon" />
        </span>
        <span class="main-benefit__content">
            {{ $t(benefit.content) }}
        </span>
    </li>
</template>

<script setup lang="ts">
import type { MainBenefitProps } from '~/widgets/mainpage/benefit/main-benefit.props';

defineProps<MainBenefitProps>();
</script>

<style scoped lang="scss" src="./main-benefit.styles.scss" />
