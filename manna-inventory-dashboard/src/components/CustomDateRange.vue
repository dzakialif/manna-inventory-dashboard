<script setup>
import DatePicker from 'primevue/datepicker';
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [Array, Date, String, null],
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

const hasValue = computed(() => {
  if (!value.value) return false;
  if (Array.isArray(value.value)) return value.value[0] != null;
  return value.value !== null && value.value !== '';
});
</script>

<script>
export default {
  inheritAttrs: false
}
</script>

<template>
  <div class="relative w-full flex items-center custom-date-wrapper">
    <i 
      v-if="!hasValue"
      class="pi pi-calendar absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none"
      style="color: #9ca3af;"
    ></i>
    <DatePicker
      v-model="value"
      selectionMode="range"
      dateFormat="yy-mm-dd"
      :class="['font-farro custom-date-range w-full', { 'has-value': hasValue }]"
      :manualInput="false"
      showClear
      v-bind="$attrs"
      :pt="{
        root: {
          class: 'w-full !flex !relative !items-center !h-[30px]',
        },
        panel: { class: '!bg-white !border !border-gray-200 !shadow-md !rounded-md font-farro p-datepicker-panel-custom' },
        header: { class: '!bg-white !border-b !border-gray-200 !text-gray-800 p-2' },
        title: { class: '!text-gray-800 !font-semibold' },
        tableHeaderCell: { class: '!text-gray-500 !font-semibold !text-xs !p-2' },
        day: { class: '!text-black hover:!bg-gray-100 !rounded-full !w-8 !h-8 !flex !items-center !justify-center transition-colors' },
        daySelected: { class: '!bg-primary !text-white !font-bold hover:!bg-primary-dark !rounded-full' },
      }"
    >
      <template v-for="(_, name) in $slots" #[name]="slotProps">
        <slot :name="name" v-bind="slotProps || {}"></slot>
      </template>
    </DatePicker>
  </div>
</template>

<style lang="scss">
/* Global styles untuk override p-datepicker PrimeVue */
.p-datepicker-panel-custom {
  .p-datepicker-header {
    padding: 0.5rem;
    border-bottom: 1px solid #e5e7eb;
    background-color: white;
  }
  .p-datepicker-title {
    font-weight: 600;
    color: #1f2937;
  }
  .p-datepicker-prev,
  .p-datepicker-next {
    color: #6b7280;
    &:hover {
      background-color: #f3f4f6;
      color: #1f2937;
    }
  }
  .p-datepicker-calendar {
    th {
      color: #6b7280;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.5rem;
    }
    td {
      padding: 0.125rem;
      > span {
        width: 2rem;
        height: 2rem;
        border-radius: 9999px;
        transition: all 0.2s;
        &.p-highlight {
          background-color: #0B6434 !important;
          color: white !important;
        }
        &:not(.p-highlight):not(.p-disabled):hover {
          background-color: #f3f4f6;
        }
      }
    }
  }
}

/* Aggressive Override for Input Field to match native inputs */
.custom-date-range .p-datepicker-input {
  box-sizing: border-box !important;
  height: 30px !important;
  min-height: 30px !important;
  padding: 0.25rem 2rem 0.25rem 2rem !important; /* padding right for clear, left for calendar */
  font-size: 0.875rem !important;     /* text-sm */
  line-height: 1.25rem !important;    /* text-sm */
  border: 1px solid #d1d5db !important; /* border-gray-300 */
  border-radius: 0.375rem !important;   /* rounded-md */
  width: 100% !important;
  font-family: 'Farro', sans-serif !important;
  color: black !important;
  background-color: transparent !important;
  box-shadow: none !important;
  outline: none !important;
  transition: all 0.2s !important;
}

.custom-date-range.has-value .p-datepicker-input {
  padding-left: 0.5rem !important; /* Restore normal left padding when calendar icon is hidden */
}

.custom-date-range .p-datepicker-input:focus {
  border-color: #0B6434 !important;
  box-shadow: 0 0 0 2px rgba(11, 100, 52, 0.5) !important;
}

.custom-date-range .p-datepicker-input::placeholder {
  color: #9ca3af !important;
}
</style>

<style lang="scss" scoped>
:deep(.p-datepicker-clear-icon) {
  right: 0.5rem !important;
  color: #9ca3af !important;
  position: absolute !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  margin: 0 !important;
  width: 1rem !important;
  height: 1rem !important;
}

</style>
