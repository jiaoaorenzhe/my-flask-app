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

// 全局基础样式（复用于所有页面）
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

// ---------- 登录相关路由 ----------
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

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// ---------- 通用风格主页（无游戏/论坛特定内容） ----------
app.get('/', requireLogin, (req, res) => {
  const now = new Date();
  const username = req.session.username;
  
  // 模拟帖子数据（可替换为从 posts 文件夹读取）
  const posts = [
    { title: '如何快速搭建个人网站', date: '4月3日', words: 245 },
    { title: 'Markdown 写作指南', date: '4月2日', words: 189 },
    { title: 'Vercel 部署避坑笔记', date: '4月1日', words: 132 },
    { title: 'JavaScript 数组方法总结', date: '3月30日', words: 567 },
    { title: 'CSS Grid 布局完全指南', date: '3月28日', words: 98 }
  ];
  
  const forumStyles = `
    <style>
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
      .logout-link {
        background: #ef4444;
        color: white !important;
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
      .post-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .post-item {
        border-bottom: 1px solid #e5e7eb;
        padding: 1rem 0;
        transition: background 0.2s;
      }
      .post-item:hover {
        background: #f9fafb;
        padding-left: 0.5rem;
      }
      .post-title {
        font-size: 1.1rem;
        font-weight: 500;
        margin-bottom: 0.3rem;
      }
      .post-title a {
        color: #1f2937;
        text-decoration: none;
      }
      .post-title a:hover {
        color: #667eea;
      }
      .post-meta {
        font-size: 0.8rem;
        color: #9ca3af;
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
      .btn-sm {
        background: #667eea;
        color: white;
        padding: 0.25rem 0.8rem;
        border-radius: 40px;
        font-size: 0.8rem;
        display: inline-block;
      }
      .footer-nav {
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 1px solid #e5e7eb;
        text-align: center;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1.5rem;
      }
      .footer-nav a {
        color: #6b7280;
        font-size: 0.9rem;
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
    </style>
  `;
  
  let postsHtml = '<ul class="post-list">';
  posts.forEach(post => {
    postsHtml += `
      <li class="post-item">
        <div class="post-title"><a href="#">${post.title}</a></div>
        <div class="post-meta">${post.date} | ${post.words}字</div>
      </li>
    `;
  });
  postsHtml += '</ul>';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head><title>我的主页</title>${globalStyles}${forumStyles}</head>
    <body>
      <div class="forum-container">
        <div class="forum-nav">
          <a href="/">首页</a>
          <a href="/blog">博客</a>
          <a href="/logout" class="logout-link">登出</a>
        </div>
        
        <div class="welcome-card">
          <h2>✨ 欢迎回来，${username}！</h2>
          <p>🕒 当前时间：${now.toLocaleString()}</p>
        </div>
        
        <div class="grid-main">
          <div>
            <div class="sidebar-card" style="padding: 0 1.2rem 1.2rem 1.2rem;">
              <div class="sidebar-title" style="margin-top: 1.2rem;">📝 最新文章</div>
              ${postsHtml}
            </div>
          </div>
          
          <div>
            <div class="sidebar-card">
              <div class="sidebar-title">👤 关于我</div>
              <p>一个喜欢折腾代码的人，分享学习笔记和生活感悟。</p>
            </div>
            <div class="sidebar-card">
              <div class="sidebar-title">🏷️ 热门标签</div>
              <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                <span class="btn-sm" style="background:#e5e7eb; color:#4b5563;">JavaScript</span>
                <span class="btn-sm" style="background:#e5e7eb; color:#4b5563;">CSS</span>
                <span class="btn-sm" style="background:#e5e7eb; color:#4b5563;">Node.js</span>
                <span class="btn-sm" style="background:#e5e7eb; color:#4b5563;">Vercel</span>
              </div>
            </div>
            <div class="sidebar-card">
              <div class="sidebar-title">🔗 友情链接</div>
              <p><a href="#">我的GitHub</a> | <a href="#">个人博客</a></p>
            </div>
          </div>
        </div>
        
        <div class="footer-nav">
          <a href="/">首页</a>
          <a href="/blog">博客</a>
          <a href="#">关于</a>
          <a href="#">联系</a>
          <a href="/logout">登出</a>
        </div>
        
        <div class="info-text" style="margin-top: 1rem; text-align: center;">
          Powered by Vercel + Node.js
        </div>
      </div>
    </body>
    </html>
  `;
  
  res.send(html);
});

// ---------- 博客路由 ----------
app.get('/blog', requireLogin, (req, res) => {
  const postsDir = path.join(__dirname, 'posts');
  let files = [];
  try {
    files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
  } catch (err) {
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>博客</title>${globalStyles}</head>
      <body>
        <div class="card" style="max-width:800px;">
          <h2>📝 博客</h2>
          <p>暂无文章，请先创建 posts 文件夹并添加 .md 文件。</p>
          <a href="/">返回主页</a>
        </div>
      </body>
      </html>
    `);
  }
  
  if (files.length === 0) {
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>博客</title>${globalStyles}</head>
      <body>
        <div class="card" style="max-width:800px;">
          <h2>📝 博客</h2>
          <p>还没有文章，去写一篇吧！</p>
          <a href="/">返回主页</a>
        </div>
      </body>
      </html>
    `);
  }
  
  let listHtml = '<ul style="list-style:none; padding:0;">';
  files.forEach(file => {
    const name = file.replace('.md', '');
    listHtml += `<li style="margin: 10px 0;"><a href="/blog/${name}">📄 ${name}</a></li>`;
  });
  listHtml += '</ul>';
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>博客列表</title>${globalStyles}</head>
    <body>
      <div class="card" style="max-width:800px;">
        <h2>📝 博客列表</h2>
        ${listHtml}
        <div style="margin-top:20px;"><a href="/">← 回到主页</a></div>
      </div>
    </body>
    </html>
  `);
});

app.get('/blog/:slug', requireLogin, (req, res) => {
  const slug = req.params.slug;
  const filePath = path.join(__dirname, 'posts', `${slug}.md`);
  try {
    const markdown = fs.readFileSync(filePath, 'utf8');
    const htmlContent = marked(markdown);
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>${slug}</title>${globalStyles}</head>
      <body>
        <div class="card" style="max-width:800px;">
          <div class="blog-content">${htmlContent}</div>
          <div style="margin-top:30px;">
            <a href="/blog">← 返回博客列表</a> | 
            <a href="/">主页</a>
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    res.status(404).send(`
      <!DOCTYPE html>
      <html>
      <head><title>404</title>${globalStyles}</head>
      <body>
        <div class="card"><h2>文章不存在</h2><a href="/blog">返回列表</a></div>
      </body>
      </html>
    `);
  }
});

module.exports = app;