// index.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // 只处理根路径请求
  if (req.url === '/') {
    // 设置响应头，返回HTML
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

    // 生成和你截图一样的极简界面
    const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>我的极简网站</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background-color: #ffffff;
        }
        /* 顶部导航栏 */
        header {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 16px;
            padding: 16px 24px;
            border-bottom: 1px solid #e5e7eb;
            background-color: #fafafa;
        }
        /* 汉堡菜单按钮 */
        .menu-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 8px;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .menu-btn .line {
            width: 24px;
            height: 3px;
            background-color: #666;
            border-radius: 2px;
        }
        /* 占位弹性空间 */
        .spacer {
            flex-grow: 1;
        }
        /* 图标按钮 */
        .icon-btn {
            background: none;
            border: none;
            cursor: pointer;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            color: #666;
        }
        /* 用户图标SVG */
        .user-icon {
            width: 20px;
            height: 20px;
            fill: currentColor;
        }
        /* 主体空白区域 */
        main {
            min-height: calc(100vh - 73px);
            background-color: #ffffff;
        }
    </style>
</head>
<body>
    <header>
        <button class="menu-btn">
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
        </button>
        <div class="spacer"></div>
        <button class="icon-btn">?</button>
        <button class="icon-btn">
            <svg class="user-icon" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
        </button>
    </header>
    <main></main>
</body>
</html>
    `;

    res.end(html);
  } else {
    // 其他路径返回404
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
  }
});

// Vercel会自动分配端口，本地运行用3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
