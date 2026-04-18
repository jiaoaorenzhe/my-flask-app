const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>我的网站</title>
    <!-- Font Awesome 6 -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
            background: #fff;
            overflow-x: hidden;
        }
        /* 顶部导航栏 */
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            border-bottom: 1px solid #eee;
            background: white;
            position: relative;
            z-index: 10;
        }
        .left, .right {
            display: flex;
            gap: 20px;
            align-items: center;
        }
        .icon {
            font-size: 24px;
            color: #000000;
            cursor: pointer;
            transition: opacity 0.2s;
        }
        .icon:hover {
            opacity: 0.7;
        }
        /* 侧边栏 */
        .sidebar {
            position: fixed;
            top: 0;
            left: -280px;
            width: 280px;
            height: 100%;
            background: white;
            box-shadow: 2px 0 12px rgba(0,0,0,0.1);
            z-index: 20;
            transition: left 0.3s ease;
            display: flex;
            flex-direction: column;
            padding: 20px 0;
        }
        .sidebar.open {
            left: 0;
        }
        .sidebar-header {
            display: flex;
            justify-content: flex-end;
            padding: 0 20px 20px;
            border-bottom: 1px solid #f0f0f0;
        }
        .close-icon {
            font-size: 24px;
            color: #000;
            cursor: pointer;
        }
        .sidebar-menu {
            list-style: none;
            margin-top: 20px;
        }
        .sidebar-menu li {
            padding: 12px 24px;
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 18px;
            cursor: pointer;
            transition: background 0.2s;
        }
        .sidebar-menu li:hover {
            background: #f5f5f5;
        }
        .sidebar-menu li i {
            width: 24px;
            font-size: 20px;
            color: #000;
        }
        .sidebar-menu li span {
            color: #1c1c1e;
        }
        /* 遮罩层 */
        .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.4);
            z-index: 15;
            display: none;
        }
        .overlay.active {
            display: block;
        }
        /* 主内容区域 */
        .main {
            height: calc(100vh - 65px);
            background: #fff;
            padding: 24px;
            overflow-y: auto;
        }
        .content-page {
            max-width: 800px;
            margin: 0 auto;
        }
        .content-page h2 {
            font-size: 28px;
            margin-bottom: 20px;
            font-weight: 600;
        }
        .content-page p {
            line-height: 1.6;
            color: #333;
            margin-bottom: 16px;
        }
        @media (max-width: 640px) {
            .sidebar { width: 260px; }
            .sidebar-menu li { padding: 10px 20px; }
            .content-page h2 { font-size: 24px; }
        }
    </style>
</head>
<body>
    <header>
        <div class="left">
            <i class="fas fa-bars icon" id="menuBtn"></i>
        </div>
        <div class="right">
            <i class="fas fa-question-circle icon"></i>
            <i class="fas fa-user-circle icon"></i>
        </div>
    </header>

    <!-- 侧边栏 -->
    <div class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <i class="fas fa-times close-icon" id="closeSidebar"></i>
        </div>
        <ul class="sidebar-menu">
            <li data-page="home">
                <i class="fas fa-home"></i>
                <span>首页</span>
            </li>
            <li data-page="articles">
                <i class="fas fa-newspaper"></i>
                <span>文章</span>
            </li>
            <li data-page="profile">
                <i class="fas fa-user"></i>
                <span>个人中心</span>
            </li>
            <li data-page="settings">
                <i class="fas fa-cog"></i>
                <span>设置</span>
            </li>
        </ul>
    </div>
    <div class="overlay" id="overlay"></div>

    <!-- 主内容区域：不同页面的内容会动态替换 -->
    <div class="main" id="mainContent">
        <div class="content-page" id="homePage">
            <h2>🏠 首页</h2>
            <p>欢迎来到我的个人网站。这里将展示一些精选内容。</p>
            <p>你可以通过左侧菜单浏览文章、管理个人资料或修改设置。</p>
        </div>
        <div class="content-page" id="articlesPage" style="display:none;">
            <h2>📄 文章</h2>
            <p>这里会列出所有文章。你可以点击阅读。</p>
            <ul>
                <li>如何搭建个人网站</li>
                <li>JavaScript 基础教程</li>
                <li>CSS Grid 布局入门</li>
            </ul>
        </div>
        <div class="content-page" id="profilePage" style="display:none;">
            <h2>👤 个人中心</h2>
            <p>用户名: lianghonglang</p>
            <p>邮箱: example@domain.com</p>
            <p>注册时间: 2026-04-01</p>
            <button id="logoutBtn" style="margin-top:20px; padding:8px 20px; background:#ef4444; color:white; border:none; border-radius:40px; cursor:pointer;">登出</button>
        </div>
        <div class="content-page" id="settingsPage" style="display:none;">
            <h2>⚙️ 设置</h2>
            <p>主题切换（暂未实现）</p>
            <p>通知设置（暂未实现）</p>
            <p>隐私设置（暂未实现）</p>
        </div>
    </div>

    <script>
        // 侧边栏控制
        const menuBtn = document.getElementById('menuBtn');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        const closeSidebar = document.getElementById('closeSidebar');

        function openSidebar() {
            sidebar.classList.add('open');
            overlay.classList.add('active');
        }
        function closeSidebarFunc() {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        }
        menuBtn.addEventListener('click', openSidebar);
        closeSidebar.addEventListener('click', closeSidebarFunc);
        overlay.addEventListener('click', closeSidebarFunc);

        // 页面切换逻辑
        const pages = {
            home: document.getElementById('homePage'),
            articles: document.getElementById('articlesPage'),
            profile: document.getElementById('profilePage'),
            settings: document.getElementById('settingsPage')
        };

        function showPage(pageId) {
            // 隐藏所有页面
            Object.values(pages).forEach(page => {
                if (page) page.style.display = 'none';
            });
            // 显示选中页面
            if (pages[pageId]) {
                pages[pageId].style.display = 'block';
            }
            // 关闭侧边栏
            closeSidebarFunc();
        }

        // 为侧边栏菜单添加点击事件
        const menuItems = document.querySelectorAll('.sidebar-menu li');
        menuItems.forEach(item => {
            const page = item.getAttribute('data-page');
            if (page) {
                item.addEventListener('click', () => {
                    showPage(page);
                });
            }
        });

        // 个人中心的登出按钮（仅演示，实际需要后端处理）
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                alert('登出功能尚未对接后端，实际应跳转到 /logout');
                // 可以后续改为 window.location.href = '/logout';
            });
        }

        // 默认显示首页（已显示，无需额外操作）
    </script>
</body>
</html>
  `);
});

app.get('*', (req, res) => {
  res.redirect('/');
});

module.exports = app;