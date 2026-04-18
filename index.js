const express = require('express');
const app = express();

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
        .icon {
            font-size: 24px;      /* 统一图标大小 */
            cursor: pointer;
            color: #000000;       /* 统一黑色 */
            line-height: 1;
        }
        /* 人头图标单独确保黑色（已经是黑色，这里显式声明） */
        .icon.user {
            color: #000000;
        }
        .main{height:calc(100vh - 65px);background:#fff;}
    </style>
</head>
<body>
    <header>
        <div class="left">
            <span class="icon">☰</span>
        </div>
        <div class="right">
            <span class="icon">?</span>
            <span class="icon user">👤</span>
        </div>
    </header>
    <div class="main"></div>
</body>
</html>
  `);
});

app.get('*', (req, res) => {
  res.redirect('/');
});

module.exports = app;