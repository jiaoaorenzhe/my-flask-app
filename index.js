const express = require('express');
const session = require('express-session');

const app = express();

// 配置 session（内存存储，适合开发测试）
app.use(session({
  secret: 'your-secret-key-change-it', // 请换成随机字符串
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 } // 1小时过期
}));

// 解析 POST 请求的表单数据
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 简单的登录验证（硬编码账号密码，可自行修改）
const VALID_USER = {
  username: 'admin',
  password: '123456'
};

// 检查登录状态的中间件
function requireLogin(req, res, next) {
  if (req.session.loggedIn) {
    next(); // 已登录，继续访问
  } else {
    // 未登录，保存当前请求的地址，登录后跳转回来
    req.session.returnTo = req.originalUrl;
    res.redirect('/login');
  }
}

// 登录页面（GET）
app.get('/login', (req, res) => {
  // 如果已经登录，直接跳转主页
  if (req.session.loggedIn) {
    return res.redirect('/');
  }
  // 简单的 HTML 登录表单
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>登录</title>
      <style>
        body { font-family: Arial; margin: 50px; text-align: center; }
        input { padding: 8px; margin: 5px; width: 200px; }
        button { padding: 8px 20px; background: #0070f3; color: white; border: none; cursor: pointer; }
        .error { color: red; }
      </style>
    </head>
    <body>
      <h2>请登录</h2>
      <form method="post" action="/login">
        <div><input type="text" name="username" placeholder="用户名" required></div>
        <div><input type="password" name="password" placeholder="密码" required></div>
        <div><button type="submit">登录</button></div>
      </form>
      <p>测试账号: admin / 123456</p>
    </body>
    </html>
  `);
});

// 处理登录提交（POST）
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === VALID_USER.username && password === VALID_USER.password) {
    req.session.loggedIn = true;
    req.session.username = username;
    // 如果有之前保存的跳转地址，则跳回那里，否则去主页
    const returnTo = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(returnTo);
  } else {
    // 登录失败，返回登录页并显示错误
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>登录失败</title></head>
      <body>
        <h3>用户名或密码错误</h3>
        <a href="/login">重新登录</a>
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

// 受保护的主页（需要登录）
app.get('/', requireLogin, (req, res) => {
  const now = new Date();
  res.send(`
    <h1>我的动态网站 (带登录保护)</h1>
    <p>当前用户: ${req.session.username}</p>
    <p>当前时间: ${now}</p>
    <p><a href="/logout">登出</a></p>
    <p>部署在 Vercel 免费服务上。</p>
  `);
});

// 你可以添加更多受保护的路由，例如 /about，同样加上 requireLogin 中间件

// Vercel 需要导出 app
module.exports = app;