<template>
  <div class="app">
    <div class="container">
      <h1>💡 LIFX Light Control</h1>
      <div class="subtitle">{{ apiHost }}</div>

      <div class="link-checkbox">
        <label>
          <input type="checkbox" v-model="lightsLinked" />
          Link lights
        </label>
      </div>

      <div class="lights-grid">
        <div v-for="(light, i) in lights" :key="i" class="light-control">
          <div class="light-title">Light {{ i + 1 }}</div>
          <div class="light-info">{{ light.address.ip }}</div>
          <div class="light-info">{{ light.address.mac }}</div>

          <ColorWheel
            :modelValue="lightColors[i]"
            @update:modelValue="updateLight(i, $event)"
            :size="220"
          />
        </div>
      </div>

      <div class="controls">
        <button class="btn-on" @click="turnOn">Turn On</button>
        <button class="btn-off" @click="turnOff">Turn Off</button>
        <button class="btn-reset" @click="resetColors">Reset</button>
      </div>

      <div
        class="status"
        :class="{ show: status.show, success: status.success, error: status.error }"
      >
        {{ status.message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ColorWheel from './components/ColorWheel.vue';
import config from '../config.json';

const lights = config.lights;
const apiHost = window.location.host;

const lightColors = ref(lights.map((l) => `#${l.color}`));
const lightsLinked = ref(false);

const status = ref({
  show: false,
  message: '',
  success: false,
  error: false,
});

function showStatus(message, isError = false) {
  status.value = {
    show: true,
    message,
    success: !isError,
    error: isError,
  };
  setTimeout(() => {
    status.value.show = false;
  }, 2000);
}

async function setColor(index, color) {
  const hexColor = color.replace('#', '');
  try {
    await fetch(`/api/set/${index}/${hexColor}`);
  } catch (error) {
    console.error('Error updating light:', error);
  }
}

function updateLight(index, hex) {
  if (lightsLinked.value) {
    lights.forEach((_, i) => {
      lightColors.value[i] = hex;
      setColor(i, hex);
    });
  } else {
    lightColors.value[index] = hex;
    setColor(index, hex);
  }
}

async function apiCall(path, successMsg, errorMsg, onSuccess) {
  try {
    await fetch(path);
    onSuccess?.();
    showStatus(successMsg);
  } catch {
    showStatus(errorMsg, true);
  }
}

const turnOn = () => apiCall('/api/on', 'Lights turned on', 'Failed to turn on lights');

const turnOff = () => apiCall('/api/off', 'Lights turned off', 'Failed to turn off lights');

const resetColors = () =>
  apiCall('/api/reset', 'Colors reset to default', 'Failed to reset colors', () => {
    lightColors.value = lights.map((l) => `#${l.color}`);
    lightsLinked.value = false;
  });
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>

<style scoped>
.app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 900px;
  width: 100%;
}

h1 {
  text-align: center;
  color: #333;
  margin: 0 0 10px 0;
}

.subtitle {
  text-align: center;
  color: #888;
  margin-bottom: 20px;
  font-size: 14px;
}

.link-checkbox {
  text-align: center;
  margin-bottom: 20px;
}

.link-checkbox label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: #333;
  cursor: pointer;
  user-select: none;
}

.link-checkbox input[type='checkbox'] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.lights-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
}

.light-control {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.light-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
  text-align: center;
}

.light-info {
  font-size: 12px;
  color: #666;
  text-align: center;
  font-family: 'Courier New', monospace;
  margin-bottom: 3px;
}

.light-info:last-of-type {
  margin-bottom: 15px;
}

.controls {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

button {
  flex: 1;
  min-width: 120px;
  padding: 15px 25px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  color: white;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

button:active {
  transform: translateY(0);
}

.btn-on {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.btn-off {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.btn-reset {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.status {
  text-align: center;
  margin-top: 20px;
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.3s;
}

.status.show {
  opacity: 1;
}

.status.success {
  background: #d4edda;
  color: #155724;
}

.status.error {
  background: #f8d7da;
  color: #721c24;
}

@media (max-width: 768px) {
  .lights-grid {
    grid-template-columns: 1fr;
  }
}
</style>
