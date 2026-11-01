require('dotenv').config();
const path = require('path');
const express = require('express');
const mqtt = require('mqtt');

const app = express();
const PORT = process.env.PORT || 3000;
const url = process.env.MQTT_URL || 'mqtt://localhost:1883';
const topic = process.env.TOPIC || 'iot/demo/temperature';

// 保存最近 60 条数据用于前端展示
const history = [];
const MAX_HISTORY = 60;

// 订阅 MQTT 主题，接收 publisher.js 发布的数据
const client = mqtt.connect(url, {
  username: process.env.MQTT_USERNAME || undefined,
  password: process.env.MQTT_PASSWORD || undefined,
});

client.on('connect', () => {
  console.log('[WEB] MQTT connected:', url);
  client.subscribe(topic, { qos: 0 }, (err) => {
    if (err) {
      console.error('[WEB] Subscribe error:', err.message);
    } else {
      console.log('[WEB] Subscribed to:', topic);
    }
  });
});

client.on('message', (t, payload) => {
  try {
    const data = JSON.parse(payload.toString());
    data.receivedAt = Date.now();
    history.push(data);
    if (history.length > MAX_HISTORY) history.shift();
  } catch (e) {
    console.error('[WEB] Bad payload:', payload.toString());
  }
});

client.on('error', (err) => console.error('[WEB] MQTT error:', err.message));

// 静态页面与数据接口
app.use(express.static(path.join(__dirname, 'public')));
app.get('/api/data', (req, res) => res.json(history));

app.listen(PORT, () => {
  console.log(`[WEB] 可视化页面: http://localhost:${PORT}`);
});
