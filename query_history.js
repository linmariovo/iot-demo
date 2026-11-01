// query_history.js —— 历史数据库查询程序
// 用法：
//   node query_history.js              查看最近 20 条记录
//   node query_history.js -n 50        查看最近 50 条记录
//   node query_history.js -d sensor-001  按设备编号筛选
const { queryHistory, count } = require('./history_db');

function parseArgs(argv) {
  const opts = { limit: 20 };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '-n') opts.limit = Number(argv[++i]);
    else if (argv[i] === '-d') opts.deviceId = argv[++i];
  }
  return opts;
}

const opts = parseArgs(process.argv.slice(2));
const rows = queryHistory(opts);

console.log('========== IoT 历史数据库查询结果 ==========');
console.log(`数据库总记录数：${count()} 条，本次查询返回：${rows.length} 条`);
console.log('------------------------------------------------');
rows.forEach((r) => {
  const time = new Date(r.ts).toLocaleString('zh-CN', { hour12: false });
  console.log(`#${r.id}  ${time}  设备:${r.deviceId}  温度:${r.temperature}℃  湿度:${r.humidity}%`);
});
