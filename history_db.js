// history_db.js —— SQLite 历史数据库模块
// 功能：创建历史数据库、建立 sensor_data 数据表、封装数据写入与历史查询接口
const path = require('path');
const Database = require('better-sqlite3');

// 数据库文件存放在项目根目录：iot_history.db
const db = new Database(path.join(__dirname, 'iot_history.db'));

// 建表：传感器历史数据表
db.exec(`
  CREATE TABLE IF NOT EXISTS sensor_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT NOT NULL,
    ts INTEGER NOT NULL,
    temperature REAL NOT NULL,
    humidity REAL NOT NULL,
    received_at INTEGER NOT NULL
  );
`);

// 插入一条传感器记录（由 server.js 收到 MQTT 消息时调用）
function insertSensorData(data) {
  const stmt = db.prepare(
    'INSERT INTO sensor_data (device_id, ts, temperature, humidity, received_at) VALUES (?, ?, ?, ?, ?)'
  );
  return stmt.run(data.deviceId, data.ts, data.temperature, data.humidity, data.receivedAt);
}

// 查询历史数据：支持条数限制、设备筛选、时间范围筛选
function queryHistory({ limit = 100, deviceId = null, from = null, to = null } = {}) {
  const conditions = [];
  const params = [];
  if (deviceId) {
    conditions.push('device_id = ?');
    params.push(deviceId);
  }
  if (from) {
    conditions.push('ts >= ?');
    params.push(from);
  }
  if (to) {
    conditions.push('ts <= ?');
    params.push(to);
  }
  let sql = 'SELECT * FROM sensor_data';
  if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
  sql += ' ORDER BY id DESC LIMIT ?';
  params.push(Number(limit));
  const rows = db.prepare(sql).all(...params);
  return rows.map((r) => ({
    id: r.id,
    deviceId: r.device_id,
    ts: r.ts,
    temperature: r.temperature,
    humidity: r.humidity,
    receivedAt: r.received_at,
  }));
}

// 统计总记录数
function count() {
  return db.prepare('SELECT COUNT(*) AS c FROM sensor_data').get().c;
}

module.exports = { db, insertSensorData, queryHistory, count };
