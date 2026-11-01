# iot-demo

物联网设计与创新课程实践项目。

## 项目简介

- `publisher.js`：MQTT 发布端，模拟传感器每 2 秒上报一次温度、湿度数据（主题 `iot/demo/temperature`）。
- `subscriber.js`：MQTT 订阅端，在终端打印收到的数据。
- `server.js`：Express 服务，订阅同一 MQTT 主题，并通过网页实时可视化展示温湿度数据。

## 运行方式

1. 确保本机 MQTT Broker（如 Mosquitto）在 `localhost:1883` 运行。
2. 安装依赖：`npm install`
3. 启动发布端：`npm run pub`
4. 启动可视化服务：`npm start`，浏览器访问 `http://localhost:3000`。

## 验证记录

- 2026-11-01：完成 Git 仓库初始化与首次提交（林世珍 2307335115）；
- 2026-11-01：采用 Express 为 publisher 添加数据可视化网页（`server.js` + `public/index.html`），浏览器验证通过。