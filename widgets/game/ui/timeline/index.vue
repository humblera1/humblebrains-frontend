<template>
    <div class="game-timeline">
        <div class="game-timeline__container">
            <div class="game-timeline__line" :style="timelineStyle" />
        </div>
    </div>
</template>

<script setup lang="ts">
const time = ref<number>(90000);
const timeLeft = ref<number>(90000);

const timelineStyle = computed(() => {
    return `width: ${timeLeft.value / time.value * 100}%`;
});

onMounted(() => {
    const timerId = setTimeout(function decrease() {
        if (timeLeft.value <= 0) {
            clearTimeout(timerId);

            return;
        }

        timeLeft.value -= 1000;
        setTimeout(decrease, 1000);

    }, 1000)
})

</script>

<style scoped lang="scss" src="./game-ui-timeline.styles.scss"></style>