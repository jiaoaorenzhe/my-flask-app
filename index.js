const http = require('http');

const server = http.createServer((req, res) => {
    // 统一设置响应头
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');

    if (req.url === '/') {
        res.statusCode = 200;
        // 还原你截图里的页面结构：顶部导航栏 + 空白主体
        res.end(`
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>我的网站</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            background-color: #ffffff;
            font-family: system-ui, -apple-system, sans-serif;
        }
        /* 顶部导航栏，和截图完全匹配 */
        .navbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 24px;
            border-bottom: 1px solid #e0e0e0;
            background-color: #ffffff;
        }
        .nav-left .menu-btn {
            border: none;
            background: none;
            font-size: 20px;
            color: #666;
            cursor: pointer;
        }
        .nav-right {
            display: flex;
            gap: 24px;
        }
        .icon-btn {
            width: 24px;
            height: 24px;
            border: none;
            background: none;
            color: #666;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        /* 主体部分完全空白，和截图效果一致 */
        .main-content {
            min-height: calc(100vh - 65px);
            background-color: #ffffff;
        }
    </style>
</head>
<body>
    <!-- 顶部导航栏（和截图完全对应） -->
    <nav class="navbar">
        <div class="nav-left">
            <button class="menu-btn">☰</button>
        </div>
        <div class="nav-right">
            <button class="icon-btn">❔</button>
            <button class="icon-btn">👤</button>
        </div>
    </nav>

    <!-- 主体空白区域，实现你要的“空白效果” -->
    <div class="main-content"></div>
</body>
</html>
        `);
    } else {
        // 其他路由也跳转到首页，避免出现 404
        res.statusCode = 302;
        res.setHeader('Location', '/');
        res.end();
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// 适配 Vercel 部署
module.exports = server;
