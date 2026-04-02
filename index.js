const express = require('express');
const session = require('express-session');

const app = express();

app.use(session({
  secret: 'your-secret-key-change-it',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 }
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const VALID_USER = {
  username: 'lianghonglang',
  password: '2013n12y30r'
};

function requireLogin(req, res, next) {
  if (req.session.loggedIn) {
    next();
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect('/login');
  }
}

const globalStyles = `
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
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
    .card:hover { transform: scale(1.01); }
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
    .input-group { margin-bottom: 1.2rem; }
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
    button:hover { opacity: 0.9; }
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
    a { color: #667eea; text-decoration: none; }
    .home-container { max-width: 600px; text-align: center; }
    .home-container h1 { font-size: 2rem; margin-bottom: 1rem; }
    .home-container p { margin: 0.8rem 0; font-size: 1rem; color: #2d2d2d; }
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
    .logout-btn:hover { background: #dc2626; }
    @media (max-width: 480px) {
      .card { padding: 1.5rem; }
      h2 { font-size: 1.5rem; }
    }
  </style>
`;

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

app.get('/', requireLogin, (req, res) => {
  const now = new Date();
  // 直接把 iframe 写在这里，不要用变量拼接
  const videoIframe = `
    <iframe src="//player.bilibili.com/player.html?bvid=BV1xx411c7mD&page=1" 
            scrolling="no" 
            border="0" 
            frameborder="no" 
            framespacing="0" 
            allowfullscreen="true" 
            style="width:100%; aspect-ratio:16/9; border-radius:16px;">
    </iframe>
  `;
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>我的视频主页</title>${globalStyles}</head>
    <body>
      <div class="card" style="max-width: 800px;">
        <h2>🎬 我的视频收藏</h2>
        <div style="margin: 20px 0;">
          ${BV1V3XtBPECf}
        </div>
        <p>当前用户：<strong>${req.session.username}</strong></p>
        <p>🕒 最后登录：${now.toLocaleString()}</p>
        <div style="margin-top: 20px;">
          <a href="/logout" class="logout-btn" style="background:#ef4444;">登出</a>
        </div>
        <div class="info-text" style="margin-top: 2rem;">视频来自 B站，仅供个人观看</div>
      </div>
    </body>
    </html>
  `);
});