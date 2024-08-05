<template>
  <component :is="isLink()" :class="classObject" :disabled="disabled" :to="to">
    <slot name="leading" />
    <slot name="default" />
    <slot name="trailing" />
  </component>
</template>

<script setup lang="ts">
import type { Button } from "~/shared/ui/button/button.types";
import { NuxtLink } from "#components";

const props = withDefaults(defineProps<Button>(), {
  theme: "blue",
});

const classObject = computed(() => ({
  button: true,
  untouchable: true,
  [`button_${props.theme}`]: true,
  [`button_${props.full}`]: props.full,
}));

const isLink = () => {
  if (props.to) {
    return NuxtLink;
  }

  return "button";
};
</script>

<style scoped lang="scss" src="./button.styles.scss"></style>