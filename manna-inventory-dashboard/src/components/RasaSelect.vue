<script setup>
import CustomSelect from '@/components/CustomSelect.vue';
import { computed } from 'vue';

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue', 'change']);

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const rawFlavors = [
  'coklat', 'mangga', 'stroberi', 'taro', 'capucino', 'vanilla', 'bubble gum',
  'alpukat', 'leci', 'pisang', 'green tea', 'caramel', 'red velvet', 'plain',
  'keju', 'hazelnut', 'thai tea', 'jeruk', 'machiato', 'peach', 'durian',
  'kopi', 'tiramisu', 'moca', 'permen karet', 'anggur'
];

// Mengurutkan secara ascending dan memetakan ke format { label, value }
const rasaOptions = rawFlavors.sort().map(flavor => {
  // Title case untuk label
  const label = flavor.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  return {
    label: label,
    value: flavor
  };
});

function onChange(event) {
  emit('change', event);
}
</script>

<script>
export default {
  inheritAttrs: false
}
</script>

<template>
  <CustomSelect
    v-model="value"
    :options="rasaOptions"
    optionLabel="label"
    optionValue="value"
    @change="onChange"
    v-bind="$attrs"
  />
</template>
