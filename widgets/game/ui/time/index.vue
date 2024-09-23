<template>
    <div class="game-time">
        <div class="game-time__info">
            <p class="game-time__title">Время:</p>
            <p class="game-time__time">{{ formattedTime }}</p>
        </div>
        <div class="game-time__container" :class="containerClass">
            <div class="game-time__line" :class="lineClass" :style="lineStyle" />
        </div>
    </div>
</template>

<script setup lang="ts">
const time = ref<number>(90000);
const timeLeft = ref<number>(90000);

const timeToAnswer = ref<number>(20000);
const timeLeftToAnswer = ref<number>(20000);

const isInteractiveState = ref<boolean>(false);

const showTimeline = computed((): boolean => {
    return true;
});

const containerClass = computed(() => {
    return showTimeline.value ? '' : 'game-time__container_hidden';
});

const formattedTime = computed((): string => {
    const totalSeconds = Math.floor(timeLeft.value / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
});

const lineClass = computed((): string => {
    if (timeLeftToAnswer.value < timeToAnswer.value / 3) {
        return 'game-time__line_red';
    }

    if (timeLeftToAnswer.value < (timeToAnswer.value * 2) / 3) {
        return 'game-time__line_yellow';
    }

    return 'game-time__line_green';
});

const lineStyle = computed(() => {
    return [`transition: background-color 500ms linear, width ${timeToAnswer.value}ms linear`, isInteractiveState.value ? 'width:0' : ''];
});

onMounted(() => {
    let timerId = setTimeout(function decreaseTime() {
        if (timeLeft.value <= 0) {
            clearTimeout(timerId);

            return;
        }

        timeLeft.value -= 1000;
        timerId = setTimeout(decreaseTime, 1000);
    }, 1000);

    setTimeout(() => {
        isInteractiveState.value = true;
    }, 1000);

    let roundTimerId = setTimeout(function decreaseRoundTime() {
        if (timeLeftToAnswer.value <= 0) {
            clearTimeout(roundTimerId);

            return;
        }

        timeLeftToAnswer.value -= 1000;
        roundTimerId = setTimeout(decreaseRoundTime, 1000);
    }, 1000);
});
</script>

<style scoped lang="scss" src="./game-ui-time-styles.scss"></style>
