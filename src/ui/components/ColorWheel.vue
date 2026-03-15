<template>
  <div ref="wheelEl"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import iro from '@jaames/iro';

const props = defineProps({
  modelValue: {
    type: String,
    default: '#ff0000',
  },
  size: {
    type: Number,
    default: 200,
  },
});

const emit = defineEmits(['update:modelValue']);

const wheelEl = ref(null);
let colorPicker = null;

onMounted(() => {
  colorPicker = new iro.ColorPicker(wheelEl.value, {
    width: props.size,
    color: props.modelValue,
    borderWidth: 2,
    borderColor: '#fff',
    layout: [
      { component: iro.ui.Slider, options: { sliderType: 'hue' } },
      { component: iro.ui.Slider, options: { sliderType: 'saturation' } },
      { component: iro.ui.Slider, options: { sliderType: 'value' } },
    ],
  });

  colorPicker.on('color:change', (color) => emit('update:modelValue', color.hexString));
});

watch(
  () => props.modelValue,
  (newColor) => {
    if (colorPicker && colorPicker.color.hexString !== newColor) {
      colorPicker.color.hexString = newColor;
    }
  },
);
</script>
