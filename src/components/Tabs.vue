<template>
    <div class="flex justify-center gap-5 mb-5">
        <button v-for="tab in tabs" :key="tab" :class="['tab', { active: currentTab === tab }]"
            @click="$emit('update:tab', tab)">
            {{ tab }}
        </button>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    tabs: {
        type: Array,
        required: true,
    },
    currentTab: {
        type: String,
        required: true,
    },
});
</script>

<style scoped>
.tab {
    padding: 0.5rem 1rem;
    cursor: pointer;
    background-color: #006eff;
    color: white;
    border: none;
    border-radius: 4px;
    transition: background-color 0.3s;
}

.tab.active {
    background-color: #333333;
}

.tab:hover {
    background-color: #0050ac;
}
</style>