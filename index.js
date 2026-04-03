const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const app = express();

// 配置 session
app.use(session({
  secret: 'your-secret-key-change-it',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 }
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 登录验证（可改为环境变量）
const VALID_USER = {
  username: 'lianghonglang',
  password: '2013n12y30r'
};

// 登录检查中间件
function requireLogin(req, res, next) {
  if (req.session.loggedIn) {
    next();
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect('/login');
  }
}

// 全局样式（复用于所有页面）
const globalStyles = `
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(10px);
      border-radius: 32px;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
      padding: 2rem;
      width: 100%;
      max-width: 420px;
      transition: transform 0.2s;
    }
    .card:hover {
      transform: scale(1.01);
    }
    h2 {
      font-size: 1.8rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      text-align: center;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .input-group {
      margin-bottom: 1.2rem;
    }
    label {
      display: block;
      font-size: 0.9rem;
      font-weight: 500;
      margin-bottom: 0.4rem;
      color: #333;
    }
    input {
      width: 100%;
      padding: 12px 16px;
      font-size: 1rem;
      border: 1px solid #ddd;
      border-radius: 28px;
      outline: none;
      transition: all 0.2s;
      background: #f9f9f9;
    }
    input:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102,126,234,0.2);
      background: white;
    }
    button {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border: none;
      border-radius: 28px;
      color: white;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s;
      margin-top: 0.5rem;
    }
    button:hover {
      opacity: 0.9;
    }
    .info-text {
      text-align: center;
      margin-top: 1.5rem;
      font-size: 0.8rem;
      color: #666;
    }
    .error-box {
      background: #fee2e2;
      border-left: 4px solid #ef4444;
      padding: 12px;
      border-radius: 16px;
      margin-bottom: 1rem;
      color: #b91c1c;
      font-size: 0.9rem;
    }
    a {
      color: #667eea;
      text-decoration: none;
    }
    .home-container {
      max-width: 600px;
      text-align: center;
    }
    .home-container h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    .home-container p {
      margin: 0.8rem 0;
      font-size: 1rem;
      color: #2d2d2d;
    }
    .logout-btn {
      display: inline-block;
      margin-top: 1.5rem;
      background: #ef4444;
      padding: 8px 24px;
      border-radius: 40px;
      color: white;
      font-weight: 500;
      transition: background 0.2s;
    }
    .logout-btn:hover {
      background: #dc2626;
    }
    /* 博客内容样式 */
    .blog-content {
      text-align: left;
      line-height: 1.6;
      color: #1f2937;
    }
    .blog-content h1, .blog-content h2, .blog-content h3 {
      margin: 1.2em 0 0.5em;
    }
    .blog-content p {
      margin: 0.8em 0;
    }
    .blog-content ul, .blog-content ol {
      margin: 0.5em 0 0.5em 1.5em;
    }
    .blog-content code {
      background: #f1f5f9;
      padding: 0.2em 0.4em;
      border-radius: 6px;
      font-family: monospace;
    }
    .blog-content pre {
      background: #0f172a;
      color: #e2e8f0;
      padding: 1rem;
      border-radius: 12px;
      overflow-x: auto;
    }
    .blog-content blockquote {
      border-left: 4px solid #667eea;
      margin: 1em 0;
      padding-left: 1em;
      color: #4b5563;
    }
    @media (max-width: 480px) {
      .card {
        padding: 1.5rem;
      }
      h2 {
        font-size: 1.5rem;
      }
    }
  </style>
`;

// 登录页面
app.get('/login', (req, res) => {
  if (req.session.loggedIn) return res.redirect('/');
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>登录 · 我的网站</title>${globalStyles}</head>
    <body>
      <div class="card">
        <h2>欢迎回来</h2>
        <form method="post" action="/login">
          <div class="input-group">
            <label>用户名</label>
            <input type="text" name="username" placeholder="用户名" required autofocus>
          </div>
          <div class="input-group">
            <label>密码</label>
            <input type="password" name="password" placeholder="密码" required>
          </div>
          <button type="submit">登 录</button>
        </form>
        <div class="info-text"></div>
      </div>
    </body>
    </html>
  `);
});

// 处理登录
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === VALID_USER.username && password === VALID_USER.password) {
    req.session.loggedIn = true;
    req.session.username = username;
    const returnTo = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(returnTo);
  } else {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>登录失败</title>${globalStyles}</head>
      <body>
        <div class="card">
          <h2>登录失败</h2>
          <div class="error-box">用户名或密码错误，请重试。</div>
          <a href="/login" style="display:block; text-align:center;">返回登录页</a>
        </div>
      </body>
      </html>
    `);
  }
});

// 登出
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// 受保护的主页（论坛风格）
app.get('/', requireLogin, (req, res) => {
  const now = new Date();
  const username = req.session.username;
  
  // 额外补充论坛专用样式（在 globalStyles 基础上增加）
  const forumStyles = `
    <style>
      /* 论坛布局扩展 */
      .forum-container {
        max-width: 1200px;
        width: 100%;
        margin: 0 auto;
        background: rgba(255,255,255,0.95);
        border-radius: 32px;
        padding: 2rem;
        box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
      }
      .forum-nav {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
        margin-bottom: 2rem;
        border-bottom: 1px solid #e5e7eb;
        padding-bottom: 1rem;
      }
      .forum-nav a {
        color: #4b5563;
        font-weight: 500;
        padding: 0.5rem 1rem;
        border-radius: 40px;
        transition: all 0.2s;
      }
      .forum-nav a:hover {
        background: #f3f4f6;
        color: #667eea;
      }
      .grid-main {
        display: grid;
        grid-template-columns: 1fr 280px;
        gap: 2rem;
      }
      .welcome-card {
        background: linear-gradient(135deg, #667eea20, #764ba220);
        border-radius: 24px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        text-align: center;
      }
      .feature-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin: 2rem 0;
      }
      .feature-item {
        background: white;
        border-radius: 20px;
        padding: 1rem;
        text-align: center;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        transition: transform 0.2s;
      }
      .feature-item:hover {
        transform: translateY(-4px);
      }
      .feature-icon {
        font-size: 2rem;
        margin-bottom: 0.5rem;
      }
      .news-card {
        background: #f9fafb;
        border-radius: 20px;
        padding: 1.2rem;
        margin-bottom: 1rem;
      }
      .sidebar-card {
        background: white;
        border-radius: 20px;
        padding: 1.2rem;
        margin-bottom: 1.5rem;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
      }
      .sidebar-title {
        font-weight: 700;
        font-size: 1.2rem;
        margin-bottom: 1rem;
        border-left: 4px solid #667eea;
        padding-left: 0.75rem;
      }
      .post-list {
        list-style: none;
        padding: 0;
      }
      .post-list li {
        margin-bottom: 0.8rem;
        border-bottom: 1px solid #f0f0f0;
        padding-bottom: 0.5rem;
      }
      .post-list a {
        color: #1f2937;
      }
      .post-list a:hover {
        color: #667eea;
      }
      .btn-sm {
        background: #667eea;
        color: white;
        padding: 0.25rem 0.8rem;
        border-radius: 40px;
        font-size: 0.8rem;
        display: inline-block;
      }
      @media (max-width: 768px) {
        .forum-container {
          padding: 1rem;
        }
        .grid-main {
          grid-template-columns: 1fr;
        }
        .forum-nav a {
          font-size: 0.9rem;
          padding: 0.3rem 0.8rem;
        }
      }
      .logout-link {
        background: #ef4444;
        color: white !important;
        margin-left: auto;
      }
      .blog-link {
        background: #10b981;
        color: white !important;
      }
    </style>
  `;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head><title>我的社区 · 主页</title>${globalStyles}${forumStyles}</head>
    <body>
      <div class="forum-container">
        <!-- 导航栏 -->
        <div class="forum-nav">
          <a href="/">首页</a>
          <a href="/blog">博客</a>
          <a href="#">下载</a>
          <a href="#">打赏</a>
          <a href="#">教程</a>
          <a href="#">闲聊</a>
          <a href="#">地图</a>
          <a href="#">模组</a>
          <a href="/logout" class="logout-link">登出</a>
        </div>
        
        <!-- 欢迎横幅 -->
        <div class="welcome-card">
          <h2>🎮 欢迎回来，${username}！</h2>
          <p>今日已签到 · 铁粒 +5</p>
          <p>🕒 服务器时间：${now.toLocaleString()}</p>
        </div>
        
        <!-- 主内容区：两列布局 -->
        <div class="grid-main">
          <!-- 左侧：主要内容 -->
          <div>
            <!-- 特色推荐（类似苦力怕论坛的板块） -->
            <div class="feature-grid">
              <div class="feature-item">
                <div class="feature-icon">📦</div>
                <h3>冒险世界</h3>
                <p>筑梦之旅</p>
                <span class="btn-sm">[1.21.50+]</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon">🎨</div>
                <h3>材质分享</h3>
                <p>光影·纹理包</p>
              </div>
              <div class="feature-item">
                <div class="feature-icon">⚙️</div>
                <h3>模组讨论</h3>
                <p>Forge / Fabric</p>
              </div>
            </div>
            
            <!-- 最新资讯 -->
            <div class="news-card">
              <h3>📰 最新资讯</h3>
              <ul class="post-list">
                <li><a href="#">Minecraft Java版 26w14a 发布 —— Herdcraft 更新</a> <span style="color:#999; font-size:0.8rem;">2小时前</span></li>
                <li><a href="#">基岩版 Beta 1.21.50 新特性预览</a></li>
                <li><a href="#">社区建筑大赛报名开启</a></li>
              </ul>
            </div>
            
            <!-- 图文推荐 -->
            <div class="news-card">
              <h3>🖼️ 图文推荐</h3>
              <div style="display:flex; gap:1rem; flex-wrap:wrap;">
                <div style="background:#e5e7eb; border-radius:16px; padding:1rem; flex:1; text-align:center;">🏰 建筑展示</div>
                <div style="background:#e5e7eb; border-radius:16px; padding:1rem; flex:1; text-align:center;">⚔️ 生存日记</div>
                <div style="background:#e5e7eb; border-radius:16px; padding:1rem; flex:1; text-align:center;">🎮 红石科技</div>
              </div>
            </div>
          </div>
          
          <!-- 右侧边栏 -->
          <div>
            <div class="sidebar-card">
              <div class="sidebar-title">✅ 每日签到</div>
              <p>每日一签，赚铁粒</p>
              <a href="#" class="btn-sm">立即签到</a>
            </div>
            <div class="sidebar-card">
              <div class="sidebar-title">👥 多人游戏</div>
              <p>来多人运动吧</p>
              <ul class="post-list">
                <li><a href="#">服务器列表</a></li>
                <li><a href="#">联机交友</a></li>
              </ul>
            </div>
            <div class="sidebar-card">
              <div class="sidebar-title">❓ 悬赏问答</div>
              <ul class="post-list">
                <li><a href="#">如何安装模组？</a> <span style="color:#f59e0b;">10铁粒</span></li>
                <li><a href="#">光影报错求助</a> <span style="color:#f59e0b;">5铁粒</span></li>
              </ul>
              <a href="#">发布悬赏 →</a>
            </div>
            <div class="sidebar-card">
              <div class="sidebar-title">🎵 旋律云</div>
              <p>Forge / Fabric / BDS / LL / Bukkit</p>
              <a href="#">www.rhymc.com</a>
            </div>
            <div class="sidebar-card">
              <div class="sidebar-title">💾 免费不限速</div>
              <p>注册免费得1T存储</p>
            </div>
          </div>
        </div>
        
        <div class="info-text" style="margin-top: 2rem; text-align: center;">
          Powered by Vercel + Node.js | 我的个人社区
        </div>
      </div>
    </body>
    </html>
  `;
  
  res.send(html);
});