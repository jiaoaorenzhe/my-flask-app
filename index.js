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
    <!-- Font Awesome 6 (免费图标库) -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
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
        .left,.right{display:flex;gap:20px;align-items:center;}
        .icon {
            font-size: 24px;      /* 统一大小 */
            color: #000000;       /* 纯黑色 */
            cursor: pointer;
            transition: opacity 0.2s;
        }
        .icon:hover {
            opacity: 0.7;
        }
        .main{height:calc(100vh - 65px);background:#fff;}
    </style>
</head>
<body>
    <header>
        <div class="left">
            <i class="fas fa-bars icon"></i>      <!-- ☰ 菜单图标 -->
        </div>
        <div class="right">
            <i class="fas fa-question-circle icon"></i>   <!-- ? 帮助图标 -->
            <i class="fas fa-user-circle icon"></i>       <!-- 人头图标（黑色） -->
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