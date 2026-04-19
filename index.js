const express = require('express');
const session = require('express-session');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session 配置
app.use(session({
  secret: 'your-secret-key-change-it',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 } // 1小时
}));

// 管理员验证
const ADMIN_USER = 'admin';
const ADMIN_PASS = '2013n12y30r@lang';

// 登录保护中间件（只检查是否有 session 标识，管理员或游客都允许访问主页）
function requireAccess(req, res, next) {
  if (req.session.isAdmin || req.session.isGuest) {
    next();
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect('/login');
  }
}

// ---------- 登录页面 ----------
app.get('/login', (req, res) => {
  if (req.session.isAdmin || req.session.isGuest) return res.redirect('/');
  res.send(`
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>登录</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        body {
            min-height: 100vh;
            background-color: #ffffff;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px 16px;
            color: #1d1d1f;
        }
        .login-container {
            width: 100%;
            max-width: 400px;
            margin-top: 120px;
        }
        .input-group {
            margin-bottom: 28px;
        }
        .label-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        .label {
            font-size: 17px;
            font-weight: 400;
            color: #1d1d1f;
        }
        input[type="text"], input[type="password"] {
            width: 100%;
            height: 48px;
            padding: 0 16px;
            border: 1px solid #e5e5e7;
            border-radius: 12px;
            font-size: 17px;
            background-color: #f2f2f7;
            outline: none;
        }
        input:focus {
            border-color: #007aff;
            background-color: #ffffff;
        }
        .password-wrapper {
            position: relative;
        }
        .eye-icon {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            font-size: 20px;
        }
        .login-btn {
            width: 100%;
            height: 56px;
            background-color: #007aff;
            color: white;
            border: none;
            border-radius: 14px;
            font-size: 18px;
            font-weight: 500;
            cursor: pointer;
            margin-top: 12px;
        }
        .guest-btn {
            width: 100%;
            height: 56px;
            background-color: #e5e5ea;
            color: #1d1d1f;
            border: none;
            border-radius: 14px;
            font-size: 18px;
            font-weight: 500;
            cursor: pointer;
            margin-top: 16px;
        }
        .error-msg {
            background: #fee2e2;
            border-left: 4px solid #ef4444;
            padding: 12px;
            border-radius: 12px;
            margin-bottom: 20px;
            color: #b91c1c;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <form method="post" action="/login">
            <div class="input-group">
                <div class="label-row">
                    <span class="label">用户名</span>
                </div>
                <input type="text" name="username" required autofocus>
            </div>
            <div class="input-group">
                <div class="label-row">
                    <span class="label">密码</span>
                </div>
                <div class="password-wrapper">
                    <input type="password" name="password" id="password-input" required>
                    <span class="eye-icon" onclick="togglePassword()">👁️</span>
                </div>
            </div>
            <button type="submit" class="login-btn">管理员登录</button>
        </form>
        <form method="post" action="/guest">
            <button type="submit" class="guest-btn">游客模式</button>
        </form>
    </div>
    <script>
        function togglePassword() {
            const input = document.getElementById('password-input');
            input.type = input.type === 'password' ? 'text' : 'password';
        }
    </script>
</body>
</html>
  `);
});

// 处理管理员登录
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    req.session.isAdmin = true;
    req.session.username = '管理员';
    const returnTo = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(returnTo);
  } else {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>登录失败</title><style>body{font-family:sans-serif;padding:2rem;}</style></head>
      <body><div class="error-msg">用户名或密码错误</div><a href="/login">返回登录</a></body></html>
    `);
  }
});

// 处理游客模式
app.post('/guest', (req, res) => {
  req.session.isGuest = true;
  req.session.username = '游客';
  const returnTo = req.session.returnTo || '/';
  delete req.session.returnTo;
  res.redirect(returnTo);
});

// 登出
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// ---------- 主页（需要登录或游客模式）----------
app.get('/', requireAccess, (req, res) => {
  const username = req.session.username || (req.session.isAdmin ? '管理员' : '游客');
  const isAdmin = req.session.isAdmin || false;
  const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>我的网站</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
            --bg-body: #ffffff;
            --bg-header: #ffffff;
            --text-primary: #1c1c1e;
            --text-secondary: #6c6c70;
            --border-color: #e9e9ef;
            --sidebar-bg: #ffffff;
            --sidebar-hover: #f5f5f5;
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
        .left, .right { display: flex; gap: 20px; align-items: center; }
        .icon {
            font-size: 24px;
            color: var(--text-primary);
            cursor: pointer;
            transition: opacity 0.2s;
        }
        .icon:hover { opacity: 0.7; }
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
        .sidebar.open { left: 0; }
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
        .sidebar-menu li:hover { background: var(--sidebar-hover); }
        .sidebar-menu li i { width: 24px; font-size: 20px; color: var(--text-primary); }
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
        .overlay.active { display: block; }
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
        .content-page ul { padding-left: 20px; }
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
        .setting-item label { font-size: 16px; cursor: pointer; }
        input[type="checkbox"], select {
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
        <div class="left"><i class="fas fa-bars icon" id="menuBtn"></i></div>
        <div class="right">
            <i class="fas fa-question-circle icon"></i>
            <i class="fas fa-user-circle icon"></i>
        </div>
    </header>

    <div class="sidebar" id="sidebar">
        <div class="sidebar-header"><i class="fas fa-times close-icon" id="closeSidebar"></i></div>
        <ul class="sidebar-menu">
            <li data-page="home"><i class="fas fa-home"></i><span data-i18n="nav_home">首页</span></li>
            <li data-page="articles"><i class="fas fa-newspaper"></i><span data-i18n="nav_articles">文章</span></li>
            <li data-page="profile"><i class="fas fa-user"></i><span data-i18n="nav_profile">个人中心</span></li>
            <li data-page="settings"><i class="fas fa-cog"></i><span data-i18n="nav_settings">设置</span></li>
        </ul>
    </div>
    <div class="overlay" id="overlay"></div>

    <div class="main" id="mainContent">
        <div class="content-page" id="homePage">
            <h2 data-i18n="home_title">🏠 首页</h2>
            <p data-i18n="home_welcome">欢迎来到我的个人网站。这里将展示一些精选内容。</p>
            <p data-i18n="home_hint">你可以通过左侧菜单浏览文章、管理个人资料或修改设置。</p>
        </div>
        <div class="content-page" id="articlesPage" style="display:none;">
            <h2 data-i18n="articles_title">📄 文章</h2>
            <p data-i18n="articles_desc">这里会列出所有文章。你可以点击阅读。</p>
            <ul>
                <li data-i18n="article1">如何搭建个人网站</li>
                <li data-i18n="article2">JavaScript 基础教程</li>
                <li data-i18n="article3">CSS Grid 布局入门</li>
            </ul>
        </div>
        <div class="content-page" id="profilePage" style="display:none;">
            <h2 data-i18n="profile_title">👤 个人中心</h2>
            <p><span data-i18n="profile_username">身份</span>: ${username}</p>
            <p><span data-i18n="profile_email">邮箱</span>: ${isAdmin ? 'admin@mysite.com' : 'guest@example.com'}</p>
            <p><span data-i18n="profile_regdate">注册时间</span>: 2026-04-19</p>
            <button id="logoutBtn" data-i18n="logout">登出</button>
        </div>
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
        const translations = {
            zh: {
                nav_home: "首页", nav_articles: "文章", nav_profile: "个人中心", nav_settings: "设置",
                home_title: "🏠 首页", home_welcome: "欢迎来到我的个人网站。这里将展示一些精选内容。", home_hint: "你可以通过左侧菜单浏览文章、管理个人资料或修改设置。",
                articles_title: "📄 文章", articles_desc: "这里会列出所有文章。你可以点击阅读。",
                article1: "如何搭建个人网站", article2: "JavaScript 基础教程", article3: "CSS Grid 布局入门",
                profile_title: "👤 个人中心", profile_username: "身份", profile_email: "邮箱", profile_regdate: "注册时间",
                logout: "登出",
                settings_title: "⚙️ 设置", dark_mode: "🌙 暗色模式", language: "🌐 语言", settings_more: "更多设置项即将推出..."
            },
            en: {
                nav_home: "Home", nav_articles: "Articles", nav_profile: "Profile", nav_settings: "Settings",
                home_title: "🏠 Home", home_welcome: "Welcome to my personal website.", home_hint: "Use the left menu to browse articles, manage your profile, or change settings.",
                articles_title: "📄 Articles", articles_desc: "Here is the list of articles.",
                article1: "How to build a personal website", article2: "JavaScript Basics", article3: "CSS Grid Layout Guide",
                profile_title: "👤 Profile", profile_username: "Role", profile_email: "Email", profile_regdate: "Registered",
                logout: "Logout",
                settings_title: "⚙️ Settings", dark_mode: "🌙 Dark Mode", language: "🌐 Language", settings_more: "More settings coming soon..."
            }
        };
        let currentLang = localStorage.getItem('language') || 'zh';
        function applyLanguage(lang) {
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (translations[lang] && translations[lang][key]) {
                    if (el.tagName !== 'INPUT' && el.tagName !== 'SELECT') el.innerText = translations[lang][key];
                }
            });
        }
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
        // 侧边栏
        const menuBtn = document.getElementById('menuBtn');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        const closeSidebar = document.getElementById('closeSidebar');
        function openSidebar() { sidebar.classList.add('open'); overlay.classList.add('active'); }
        function closeSidebarFunc() { sidebar.classList.remove('open'); overlay.classList.remove('active'); }
        menuBtn.addEventListener('click', openSidebar);
        closeSidebar.addEventListener('click', closeSidebarFunc);
        overlay.addEventListener('click', closeSidebarFunc);
        // 页面切换
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
        // 暗色模式
        const darkModeToggle = document.getElementById('darkModeToggle');
        const isDark = localStorage.getItem('darkMode') === 'true';
        if (isDark) { document.body.classList.add('dark'); darkModeToggle.checked = true; }
        darkModeToggle.addEventListener('change', (e) => {
            if (e.target.checked) { document.body.classList.add('dark'); localStorage.setItem('darkMode', 'true'); }
            else { document.body.classList.remove('dark'); localStorage.setItem('darkMode', 'false'); }
        });
        // 登出按钮
        const logoutBtn = document.getElementById('logoutBtn');
        if(logoutBtn) logoutBtn.addEventListener('click', () => { window.location.href = '/logout'; });
        initLanguage();
    </script>
</body>
</html>
  `;
  res.send(html);
});

// 其他所有未匹配路由重定向到主页
app.get('*', (req, res) => {
  res.redirect('/');
});

module.exports = app;