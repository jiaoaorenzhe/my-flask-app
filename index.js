const http = require('http');

const server = http.createServer((req, res) => {
    // 统一设置响应头
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');

    if (req.url === '/') {
        res.statusCode = 200;
        // 顶部导航栏 + 空白页面，完全你要的效果
        res.end(`
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
    } else {
        res.statusCode = 302;
        res.setHeader('Location', '/');
        res.end();
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = server;
