<script setup>
import Select from 'primevue/select';
import { computed } from 'vue';

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});
</script>

<script>
export default {
  inheritAttrs: false
}
</script>

<template>
  <Select
    v-model="value"
    v-bind="$attrs"
    class="font-farro"
    :pt="{
      root: {
        class: '!h-[2rem] flex items-center !bg-white !text-black !border !border-gray-300 !rounded-md !h-10 !min-w-40 focus:!outline-none focus:!border-primary focus:!ring-2 focus:!ring-primary focus-within:!border-primary focus-within:!ring-2 focus-within:!ring-primary',
      },
      label: { class: value ? '!text-black !text-sm' : '!text-gray-400 !text-sm' },
      dropdown: { class: '!text-gray-400 !bg-white' },
      overlay: { class: '!bg-white !text-black !border !border-gray-200 !shadow-md' },
      listContainer: { class: 'bg-white' },
      list: { class: '!bg-white' },
      option: { class: '!text-black !font-farro !bg-white hover:!bg-surface-hover' },
      optionLabel: { class: '!text-black' },
      emptyMessage: { class: '!text-black !bg-white' },
    }"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
  </Select>
</template>

<style lang="scss">
/* Global styles untuk overlay PrimeVue yang di-append ke body */
.p-select-filter,
.p-dropdown-filter {
  border-radius: 0.375rem !important;
  border: 1px solid #d1d5db !important;
  padding: 0.25rem 0.5rem !important;
  font-family: 'Farro', sans-serif !important;
  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
  width: 100% !important;
}

.p-select-filter:focus,
.p-dropdown-filter:focus {
  outline: none !important;
  border-color: #0B6434 !important;
  box-shadow: 0 0 0 2px rgba(11, 100, 52, 0.5) !important;
}

/* Memastikan overlay tidak memotong focus ring */
.p-select-overlay,
.p-dropdown-panel {
  padding-top: 2px !important;
}
</style>

<style lang="scss" scoped>
:deep(.p-select.p-focus),
:deep(.p-dropdown.p-focus) {
  border-color: #0B6434 !important;
  box-shadow: 0 0 0 2px rgba(11, 100, 52, 0.5) !important;
  outline: none !important;
}
</style>
