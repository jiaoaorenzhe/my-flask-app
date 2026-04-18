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
        input[type="checkbox"], select {
            width: auto;
            padding: 6px 12px;
            border-radius: 8px;
            border: 1px solid var(--border-color);
            background: var(--bg-body);
            color: var(--text-primary);
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

    <div class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <i class="fas fa-times close-icon" id="closeSidebar"></i>
        </div>
        <ul class="sidebar-menu">
            <li data-page="home"><i class="fas fa-home"></i><span data-i18n="nav_home">首页</span></li>
            <li data-page="articles"><i class="fas fa-newspaper"></i><span data-i18n="nav_articles">文章</span></li>
            <li data-page="profile"><i class="fas fa-user"></i><span data-i18n="nav_profile">个人中心</span></li>
            <li data-page="settings"><i class="fas fa-cog"></i><span data-i18n="nav_settings">设置</span></li>
        </ul>
    </div>
    <div class="overlay" id="overlay"></div>

    <div class="main" id="mainContent">
        <!-- 首页 -->
        <div class="content-page" id="homePage">
            <h2 data-i18n="home_title">🏠 首页</h2>
            <p data-i18n="home_welcome">欢迎来到我的个人网站。这里将展示一些精选内容。</p>
            <p data-i18n="home_hint">你可以通过左侧菜单浏览文章、管理个人资料或修改设置。</p>
        </div>
        <!-- 文章页 -->
        <div class="content-page" id="articlesPage" style="display:none;">
            <h2 data-i18n="articles_title">📄 文章</h2>
            <p data-i18n="articles_desc">这里会列出所有文章。你可以点击阅读。</p>
            <ul>
                <li data-i18n="article1">如何搭建个人网站</li>
                <li data-i18n="article2">JavaScript 基础教程</li>
                <li data-i18n="article3">CSS Grid 布局入门</li>
            </ul>
        </div>
        <!-- 个人中心 -->
        <div class="content-page" id="profilePage" style="display:none;">
            <h2 data-i18n="profile_title">👤 个人中心</h2>
            <p><span data-i18n="profile_username">用户名</span>: lianghonglang</p>
            <p><span data-i18n="profile_email">邮箱</span>: example@domain.com</p>
            <p><span data-i18n="profile_regdate">注册时间</span>: 2026-04-01</p>
            <button id="logoutBtn" data-i18n="logout">登出</button>
        </div>
        <!-- 设置页 -->
        <div class="content-page" id="settingsPage" style="display:none;">
            <h2 data-i18n="settings_title">⚙️ 设置</h2>
            <div class="setting-item">
                <label for="darkModeToggle" data-i18n="dark_mode">🌙 暗色模式</label>
                <input type="checkbox" id="darkModeToggle">
            </div>
            <div class="setting-item">
                <label for="languageSelect" data-i18n="language">🌐 语言</label>
                <select id="languageSelect">
                    <option value="zh">中文</option>
                    <option value="en">English</option>
                </select>
            </div>
            <p style="margin-top:20px; font-size:0.85rem;" data-i18n="settings_more">更多设置项即将推出...</p>
        </div>
    </div>

    <script>
        // ---------- 多语言文本映射 ----------
        const translations = {
            zh: {
                nav_home: "首页", nav_articles: "文章", nav_profile: "个人中心", nav_settings: "设置",
                home_title: "🏠 首页", home_welcome: "欢迎来到我的个人网站。这里将展示一些精选内容。", home_hint: "你可以通过左侧菜单浏览文章、管理个人资料或修改设置。",
                articles_title: "📄 文章", articles_desc: "这里会列出所有文章。你可以点击阅读。",
                article1: "如何搭建个人网站", article2: "JavaScript 基础教程", article3: "CSS Grid 布局入门",
                profile_title: "👤 个人中心", profile_username: "用户名", profile_email: "邮箱", profile_regdate: "注册时间",
                logout: "登出",
                settings_title: "⚙️ 设置", dark_mode: "🌙 暗色模式", language: "🌐 语言", settings_more: "更多设置项即将推出..."
            },
            en: {
                nav_home: "Home", nav_articles: "Articles", nav_profile: "Profile", nav_settings: "Settings",
                home_title: "🏠 Home", home_welcome: "Welcome to my personal website. Here you'll find some selected content.", home_hint: "Use the left menu to browse articles, manage your profile, or change settings.",
                articles_title: "📄 Articles", articles_desc: "Here is the list of articles. Click to read.",
                article1: "How to build a personal website", article2: "JavaScript Basics", article3: "CSS Grid Layout Guide",
                profile_title: "👤 Profile", profile_username: "Username", profile_email: "Email", profile_regdate: "Registered",
                logout: "Logout",
                settings_title: "⚙️ Settings", dark_mode: "🌙 Dark Mode", language: "🌐 Language", settings_more: "More settings coming soon..."
            }
        };

        let currentLang = localStorage.getItem('language') || 'zh';

        function applyLanguage(lang) {
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (translations[lang] && translations[lang][key]) {
                    if (el.tagName === 'INPUT' || el.tagName === 'SELECT') {
                        // 对于输入框或下拉框，可能需要处理 placeholder 或 value，但这里只处理文本内容
                        // 暂时跳过复杂控件
                    } else {
                        el.innerText = translations[lang][key];
                    }
                }
            });
            // 单独处理 select 选项的文本（选项的文本也需要国际化？简单起见不处理选项内容，因为选项值本身固定）
            // 也可以重新设置 select 的选中状态，但不需要。
        }

        // 初始化语言
        function initLanguage() {
            const select = document.getElementById('languageSelect');
            if (select) {
                select.value = currentLang;
                applyLanguage(currentLang);
                select.addEventListener('change', (e) => {
                    currentLang = e.target.value;
                    localStorage.setItem('language', currentLang);
                    applyLanguage(currentLang);
                });
            }
        }

        // ---------- 侧边栏控制 ----------
        const menuBtn = document.getElementById('menuBtn');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        const closeSidebar = document.getElementById('closeSidebar');

        function openSidebar() { sidebar.classList.add('open'); overlay.classList.add('active'); }
        function closeSidebarFunc() { sidebar.classList.remove('open'); overlay.classList.remove('active'); }
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

        // ---------- 个人中心登出 ----------
        const logoutBtn = document.getElementById('logoutBtn');
        if(logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                alert('登出功能尚未对接后端，实际应跳转到 /logout');
            });
        }

        // 初始化语言设置
        initLanguage();
    </script>
</body>
</html>
  `);
});

app.get('*', (req, res) => {
  res.redirect('/');
});

module.exports = app;