import Lifx from 'node-lifx-lan';
import express from 'express';
import config from '../config.json';

const { lights, duration } = config;

export function createApp() {
  const app = express();

  let state = false;

  let devices = [];

  const turnOn = async () => {
    for (const device of devices) await device.turnOn();
  };

  const turnOff = async () => {
    for (const device of devices) await device.turnOff();
  };

  const resetColors = async () => {
    for (const [index, device] of devices.entries())
      await device.setColor({ color: { css: `#${lights[index].color}` }, duration });
  };

  const setColor = async (index, color) =>
    devices[index].setColor({ color: { css: `#${color}` }, duration });

  const randomHex = () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0');

  const setRandomRgbColor = async (index) => {
    const r = randomHex(),
      g = randomHex(),
      b = randomHex();
    await devices[index].setColor({ color: { css: `#${r}${g}${b}` }, duration });
  };

  const flip = async () => {
    state = !state;
    if (state) turnOn();
    else turnOff();
  };

  const handle = (fn, message) => {
    console.log(message);
    fn().catch((err) => console.error('LIFX error:', err.message));
  };

  app.get('/api/flip', (req, res) => {
    handle(flip, `flip -> ${state ? 'off' : 'on'}`);
    res.end();
  });

  app.get('/api/on', (req, res) => {
    handle(turnOn, 'turn on');
    res.end();
  });

  app.get('/api/off', (req, res) => {
    handle(turnOff, 'turn off');
    res.end();
  });

  app.get('/api/reset', (req, res) => {
    handle(resetColors, 'reset colors');
    res.end();
  });

  app.get('/api/set/:index/:color', (req, res) => {
    const { index, color } = req.params;
    handle(() => setColor(index, color), `set light ${index} to #${color}`);
    res.end();
  });

  app.get('/api/random/:index', (req, res) => {
    const { index } = req.params;
    handle(() => setRandomRgbColor(index), `set light ${index} to random color`);
    res.end();
  });

  (async () => {
    try {
      for (const light of lights) {
        const device = await Lifx.createDevice(light.address);
        devices.push(device);
        console.log(`${device.mac} @ ${device.ip} ready`);
      }
      await turnOff();
    } catch (err) {
      console.error('Failed to initialize LIFX devices:', err);
    }
  })();

  return app;
}
