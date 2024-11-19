<template>
    <div class="banner">
        <IconBlankWithPencil />
        <div class="banner__info">
            <p class="banner__title">
                {{ $t('welcomeToCheckpoint') }}
            </p>
            <p class="banner__text">
                {{ $t('checkpointBannerDescription') }}
            </p>
        </div>
        <div class="banner__progress"></div>
    </div>
</template>

<style scoped lang="scss" src="./checkpoint-ui-banner.styles.scss" />
