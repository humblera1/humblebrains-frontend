<template>
    <div v-if="user.program" class="progress-program">
        <header class="progress-program__header">
            <h1 class="title">{{ $t('currentProgram') + ': ' + user.program.category.label }}</h1>
            <div class="progress-program__info">
                <span class="progress-program__text">
                    {{ $t('latestAssessment') + ': ' }}
                    <span class="progress-program__text_underlined">
                        {{ user.program.createdAt }}
                    </span>
                </span>
                <span class="progress-program__text">
                    {{ $t('sessionsToNextAssessment') + ': ' }}
                    <span class="progress-program__text_underlined">
                        {{ user.program.sessionsAmount - user.program.completedSessionsAmount }}
                    </span>
                </span>
            </div>
        </header>
        <div class="progress-program__body">
            <section class="progress-program__section">
                <h2 class="progress-program__subtitle">{{ $t('programProgress') }}</h2>
                <WidgetProgressLine />
            </section>
            <section class="progress-program__section">
                <h2 class="progress-program__subtitle">{{ $t('sessionProgress') }}</h2>
                <WidgetGameRow :games="user.games" />
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/modules/user/stores/userStore';

const user = useUserStore();
</script>

<style scoped lang="scss" src="./progress-program.styles.scss" />
