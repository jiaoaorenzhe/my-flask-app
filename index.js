const express = require('express');
const app = express();

// 主页：返回你想要的顶部导航栏 + 空白区域
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>页面</title>
    <style>
        *{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:sans-serif;background:#fff;}
        header{
            display:flex;
            justify-content:space-between;
            align-items:center;
            padding:16px 20px;
            border-bottom:1px solid #eee;
        }
        .left,.right{display:flex;gap:16px;align-items:center;}
        .main{height:calc(100vh - 65px);background:#fff;}
    </style>
</head>
<body>
    <header>
        <div class="left">
            <span>☰</span>
        </div>
        <div class="right">
            <span>?</span>
            <span>👤</span>
        </div>
    </header>
    <div class="main"></div>
</body>
</html>
  `);
});

// 其他所有路径都重定向到首页
app.get('*', (req, res) => {
  res.redirect('/');
});

module.exports = app;