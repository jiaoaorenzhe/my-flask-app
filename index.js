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
            height: 73px;
        }

        /* 统一所有按钮大小 */
        .icon-btn, .menu-btn {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: none;
            background: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #666;
            transition: background-color 0.2s;
        }
        .icon-btn:hover, .menu-btn:hover {
            background-color: #e5e7eb;
        }

        /* 修复后的汉堡菜单线条 */
        .menu-btn .hamburger {
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

        /* 侧边栏遮罩 */
        .sidebar-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.3);
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s;
            z-index: 99;
        }
        .sidebar-overlay.active {
            opacity: 1;
            visibility: visible;
        }

        /* 侧边栏本体 */
        .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            width: 280px;
            height: 100%;
            background-color: #fafafa;
            border-right: 1px solid #e5e7eb;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            z-index: 100;
            padding: 24px;
        }
        .sidebar.active {
            transform: translateX(0);
        }

        /* 侧边栏内容 */
        .sidebar-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 32px;
        }
        .sidebar-title {
            font-size: 18px;
            font-weight: 600;
            color: #333;
        }
        .sidebar-close {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: none;
            background: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #666;
            font-size: 20px;
        }
        .sidebar-menu {
            list-style: none;
        }
        .sidebar-menu li {
            margin-bottom: 12px;
        }
        .sidebar-menu a {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            border-radius: 8px;
            color: #333;
            text-decoration: none;
            transition: background-color 0.2s;
        }
        .sidebar-menu a:hover {
            background-color: #e5e7eb;
        }
        .sidebar-icon {
            width: 20px;
            height: 20px;
            fill: currentColor;
        }
    </style>
</head>
<body>
    <!-- 侧边栏遮罩 -->
    <div class="sidebar-overlay" id="sidebarOverlay"></div>

    <!-- 侧边栏 -->
    <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <span class="sidebar-title">菜单</span>
            <button class="sidebar-close" id="sidebarClose">×</button>
        </div>
        <ul class="sidebar-menu">
            <li>
                <a href="#">
                    <svg class="sidebar-icon" viewBox="0 0 24 24">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                    </svg>
                    首页
                </a>
            </li>
            <li>
                <a href="#">
                    <svg class="sidebar-icon" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                    </svg>
                    文章
                </a>
            </li>
            <li>
                <a href="#">
                    <svg class="sidebar-icon" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    个人中心
                </a>
            </li>
            <li>
                <a href="#">
                    <svg class="sidebar-icon" viewBox="0 0 24 24">
                        <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                    </svg>
                    设置
                </a>
            </li>
        </ul>
    </aside>

    <!-- 顶部导航栏 -->
    <header>
        <button class="menu-btn" id="menuBtn">
            <div class="hamburger">
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
            </div>
        </button>
        <div class="spacer"></div>
        <button class="icon-btn">?</button>
        <button class="icon-btn">
            <svg class="user-icon" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
        </button>
    </header>

    <!-- 主体空白区域 -->
    <main></main>

    <script>
        // 获取元素
        const menuBtn = document.getElementById('menuBtn');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        const sidebarClose = document.getElementById('sidebarClose');

        // 打开侧边栏
        function openSidebar() {
            sidebar.classList.add('active');
            sidebarOverlay.classList.add('active');
        }

        // 关闭侧边栏
        function closeSidebar() {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        }

        // 绑定事件
        menuBtn.addEventListener('click', openSidebar);
        sidebarClose.addEventListener('click', closeSidebar);
        sidebarOverlay.addEventListener('click', closeSidebar);
    </script>
</body>
</html>
