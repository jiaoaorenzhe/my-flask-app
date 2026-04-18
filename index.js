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
        /* 亮色模式变量（默认） */
        :root {
            --bg-body: #ffffff;
            --bg-header: #ffffff;
            --text-primary: #1c1c1e;
            --text-secondary: #6c6c70;
            --border-color: #e9e9ef;
            --sidebar-bg: #ffffff;
            --sidebar-hover: #f5f5f5;
            --card-bg: #ffffff;
            --shadow: rgba(0,0,0,0.1);
            --overlay: rgba(0,0,0,0.4);
        }
        /* 暗色模式变量 */
        body.dark {
            --bg-body: #121212;
            --bg-header: #1e1e1e;
            --text-primary: #e5e5e7;
            --text-secondary: #a1a1a6;
            --border-color: #2c2c2e;
            --sidebar-bg: #1e1e1e;
            --sidebar-hover: #2c2c2e;
            --card-bg: #1e1e1e;
            --shadow: rgba(0,0,0,0.3);
            --overlay: rgba(0,0,0,0.7);
        }
        body {
            font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
            background: var(--bg-body);
            color: var(--text-primary);
            overflow-x: hidden;
            transition: background 0.2s, color 0.2s;
        }
        /* 顶部导航栏 */
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            border-bottom: 1px solid var(--border-color);
            background: var(--bg-header);
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
            color: var(--text-primary);
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
            background: var(--sidebar-bg);
            box-shadow: 2px 0 12px var(--shadow);
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
            border-bottom: 1px solid var(--border-color);
        }
        .close-icon {
            font-size: 24px;
            color: var(--text-primary);
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
            color: var(--text-primary);
        }
        .sidebar-menu li:hover {
            background: var(--sidebar-hover);
        }
        .sidebar-menu li i {
            width: 24px;
            font-size: 20px;
            color: var(--text-primary);
        }
        /* 遮罩层 */
        .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--overlay);
            z-index: 15;
            display: none;
        }
        .overlay.active {
            display: block;
        }
        /* 主内容区域 */
        .main {
            height: calc(100vh - 65px);
            background: var(--bg-body);
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
            color: var(--text-primary);
        }
        .content-page p, .content-page li {
            line-height: 1.6;
            color: var(--text-secondary);
            margin-bottom: 12px;
        }
        .content-page ul {
            padding-left: 20px;
        }
        button {
            padding: 8px 20px;
            background: #ef4444;
            color: white;
            border: none;
            border-radius: 40px;
            cursor: pointer;
        }
        /* 设置页面的开关样式 */
        .setting-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid var(--border-color);
        }
        .setting-item label {
            font-size: 16px;
            cursor: pointer;
        }
        input[type="checkbox"] {
            width: 20px;
            height: 20px;
            cursor: pointer;
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
            <li data-page="home"><i class="fas fa-home"></i><span>首页</span></li>
            <li data-page="articles"><i class="fas fa-newspaper"></i><span>文章</span></li>
            <li data-page="profile"><i class="fas fa-user"></i><span>个人中心</span></li>
            <li data-page="settings"><i class="fas fa-cog"></i><span>设置</span></li>
        </ul>
    </div>
    <div class="overlay" id="overlay"></div>

    <!-- 主内容区域 -->
    <div class="main" id="mainContent">
        <!-- 首页 -->
        <div class="content-page" id="homePage">
            <h2>🏠 首页</h2>
            <p>欢迎来到我的个人网站。这里将展示一些精选内容。</p>
            <p>你可以通过左侧菜单浏览文章、管理个人资料或修改设置。</p>
        </div>
        <!-- 文章页 -->
        <div class="content-page" id="articlesPage" style="display:none;">
            <h2>📄 文章</h2>
            <p>这里会列出所有文章。你可以点击阅读。</p>
            <ul>
                <li>如何搭建个人网站</li>
                <li>JavaScript 基础教程</li>
                <li>CSS Grid 布局入门</li>
            </ul>
        </div>
        <!-- 个人中心 -->
        <div class="content-page" id="profilePage" style="display:none;">
            <h2>👤 个人中心</h2>
            <p>用户名: lianghonglang</p>
            <p>邮箱: example@domain.com</p>
            <p>注册时间: 2026-04-01</p>
            <button id="logoutBtn">登出</button>
        </div>
        <!-- 设置页 -->
        <div class="content-page" id="settingsPage" style="display:none;">
            <h2>⚙️ 设置</h2>
            <div class="setting-item">
                <label for="darkModeToggle">🌙 暗色模式</label>
                <input type="checkbox" id="darkModeToggle">
            </div>
            <p style="margin-top:20px; font-size:0.85rem;">更多设置项即将推出...</p>
        </div>
    </div>

    <script>
        // ---------- 侧边栏控制 ----------
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

        // ---------- 页面切换 ----------
        const pages = {
            home: document.getElementById('homePage'),
            articles: document.getElementById('articlesPage'),
            profile: document.getElementById('profilePage'),
            settings: document.getElementById('settingsPage')
        };
        function showPage(pageId) {
            Object.values(pages).forEach(p => { if(p) p.style.display = 'none'; });
            if(pages[pageId]) pages[pageId].style.display = 'block';
            closeSidebarFunc();
        }
        document.querySelectorAll('.sidebar-menu li').forEach(item => {
            const page = item.getAttribute('data-page');
            if(page) item.addEventListener('click', () => showPage(page));
        });

        // ---------- 暗色模式 ----------
        const darkModeToggle = document.getElementById('darkModeToggle');
        // 检查本地存储的偏好
        const isDark = localStorage.getItem('darkMode') === 'true';
        if (isDark) {
            document.body.classList.add('dark');
            darkModeToggle.checked = true;
        }
        darkModeToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.add('dark');
                localStorage.setItem('darkMode', 'true');
            } else {
                document.body.classList.remove('dark');
                localStorage.setItem('darkMode', 'false');
            }
        });

        // ---------- 个人中心登出按钮（演示） ----------
        const logoutBtn = document.getElementById('logoutBtn');
        if(logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                alert('登出功能尚未对接后端，实际应跳转到 /logout');
                // window.location.href = '/logout';
            });
        }
    </script>
</body>
</html>
  `);
});

app.get('*', (req, res) => {
  res.redirect('/');
});

module.exports = app;