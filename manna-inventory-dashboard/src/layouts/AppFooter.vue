<script setup></script>

<template>
    <div class="layout-footer no-print">
        SAKAI by
        <a href="https://primevue.org" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">PrimeVue</a>
    </div>
</template>

<style>
@media print {
    .no-print {
        display: none !important;
    }
}
</style>
