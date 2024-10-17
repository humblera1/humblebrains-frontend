<template>
    <div class="rule" :class="ruleClass">
        <div class="rule__outer">
            <div class="rule__inner">
                <IconArrow />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useGorbovSchulteStore } from '~/modules/checkpoint/stores/memory/gorbovSchulteStore';

const gorbovSchulte = useGorbovSchulteStore();

const ruleClass = computed((): string => {
    return gorbovSchulte.isSecondaryRuleActive() ? 'rule_secondary' : 'rule_primary';
});
</script>

<style scoped lang="scss" src="./gorbov-schulte-rule.scss" />
