const express = require('express');
const app = express();

app.get('/', (req, res) => {
  const now = new Date();
  res.send(`
    <h1>我的动态网站 (Node.js + Express on Vercel)</h1>
    <p>当前时间: ${now}</p>
    <p>部署在 Vercel 免费服务上。</p>
  `);
});

// Vercel 需要导出 app
module.exports = app;