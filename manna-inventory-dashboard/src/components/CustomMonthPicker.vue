<script setup>
import DatePicker from 'primevue/datepicker';
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [Date, String, null],
    default: null
  }
});
const emit = defineEmits(['update:modelValue', 'change']);

const value = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val);
    emit('change', val);
  }
});
</script>

<script>
export default {
  inheritAttrs: false
}
</script>

<template>
  <DatePicker
    v-model="value"
    view="month"
    dateFormat="mm/yy"
    class="font-farro custom-month-picker"
    :manualInput="false"
    showClear
    v-bind="$attrs"
    :pt="{
      root: { class: 'w-full relative' },
      panel: { class: '!bg-white !border !border-gray-200 !shadow-md !rounded-md font-farro' },
      header: { class: '!bg-white !border-b !border-gray-200 !text-gray-800 p-2' },
      title: { class: '!text-gray-800 !font-semibold' },
    }"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
  </DatePicker>
</template>

<style lang="scss">
/* Override Input Field untuk CustomMonthPicker */
.custom-month-picker .p-datepicker-input {
  box-sizing: border-box !important;
  height: 40px !important;
  min-height: 40px !important;
  padding: 0.5rem 2.5rem 0.5rem 0.75rem !important; /* Tambahkan right padding untuk clear icon dan dropdown icon jika ada */
  font-size: 0.875rem !important;     
  line-height: 1.25rem !important;    
  border: 1px solid #d1d5db !important; 
  border-radius: 0.375rem !important;   
  width: 100% !important;
  font-family: 'Farro', sans-serif !important;
  color: black !important;
  background-color: white !important;
  box-shadow: none !important;
  outline: none !important;
  transition: all 0.2s !important;
  cursor: pointer !important;
}

.custom-month-picker .p-datepicker-input:focus {
  border-color: #0B6434 !important;
  box-shadow: 0 0 0 2px rgba(11, 100, 52, 0.5) !important;
}

.custom-month-picker .p-datepicker-input::placeholder {
  color: #9ca3af !important;
}

/* Memastikan warna hijau utama PrimeVue menimpa kalender jika perlu */
.custom-month-picker-panel .p-datepicker-month.p-highlight,
.custom-month-picker-panel .p-datepicker-year.p-highlight {
  background-color: #0B6434 !important;
  color: white !important;
}
</style>

<style lang="scss" scoped>
:deep(.p-datepicker-clear-icon) {
  right: 0.75rem !important;
  color: #9ca3af !important;
  position: absolute !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  margin: 0 !important;
}
</style>
