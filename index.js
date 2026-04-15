const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

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

// 全局样式
const globalStyles = `
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
      min-height: 100vh;
      padding: 20px;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
    }
    .nav {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
      margin-bottom: 2rem;
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
      border-radius: 60px;
      padding: 0.8rem 1.5rem;
    }
    .nav a {
      color: white;
      text-decoration: none;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 40px;
      transition: 0.2s;
    }
    .nav a:hover { background: rgba(255,255,255,0.2); }
    .logout-link { background: #ef4444; }
    .logout-link:hover { background: #dc2626; }
    .video-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
      margin-top: 1rem;
    }
    .video-card {
      background: rgba(255,255,255,0.95);
      border-radius: 24px;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
      box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
    }
    .video-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2);
    }
    .video-thumb {
      width: 100%;
      aspect-ratio: 16/9;
      background: #1f2937;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 3rem;
    }
    .video-info {
      padding: 1rem;
    }
    .video-title {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 0.3rem;
      color: #111827;
    }
    .video-desc {
      font-size: 0.85rem;
      color: #4b5563;
      margin-bottom: 0.5rem;
    }
    .modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.9);
      z-index: 1000;
      align-items: center;
      justify-content: center;
    }
    .modal-content {
      background: black;
      max-width: 90%;
      max-height: 90%;
      border-radius: 16px;
      overflow: hidden;
      position: relative;
    }
    .modal video {
      width: 100%;
      height: auto;
      max-height: 80vh;
    }
    .close-modal {
      position: absolute;
      top: 10px;
      right: 20px;
      color: white;
      font-size: 2rem;
      cursor: pointer;
      z-index: 1001;
    }
    .welcome-text {
      text-align: center;
      color: white;
      margin-bottom: 1rem;
    }
    @media (max-width: 640px) {
      .video-grid { grid-template-columns: 1fr; }
      .nav a { font-size: 0.9rem; }
    }
  </style>
`;

// 登录页
app.get('/login', (req, res) => {
  if (req.session.loggedIn) return res.redirect('/');
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>登录</title>${globalStyles}</head>
    <body style="display:flex; align-items:center; justify-content:center;">
      <div style="background:white; border-radius:32px; padding:2rem; width:100%; max-width:400px;">
        <h2 style="text-align:center; margin-bottom:1.5rem;">登录</h2>
        <form method="post" action="/login">
          <input type="text" name="username" placeholder="用户名" required style="width:100%; padding:10px; margin-bottom:1rem; border-radius:28px; border:1px solid #ddd;">
          <input type="password" name="password" placeholder="密码" required style="width:100%; padding:10px; margin-bottom:1rem; border-radius:28px; border:1px solid #ddd;">
          <button type="submit" style="width:100%; padding:10px; background:#667eea; color:white; border:none; border-radius:28px;">登录</button>
        </form>
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
      <body style="display:flex; align-items:center; justify-content:center;">
        <div style="background:white; border-radius:32px; padding:2rem; text-align:center;">
          <h3>用户名或密码错误</h3>
          <a href="/login">返回登录页</a>
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

// ---------- 视频数据（请替换成你自己的 Google Drive 文件ID） ----------
const videoList = [
  {
    id: '1',
    title: '我的视频',
    desc: '通过 Google Drive 托管的视频',
    fileId: '1A0QIEpbyzRWSh-A4jUog3vrucFkpYAuH'  // 你提供的真实ID
  }
  // 可以继续添加更多视频
];

// 辅助函数：根据 fileId 获取 Google Drive 直链
function getDriveUrl(fileId) {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

// ---------- 视频网站主页 ----------
app.get('/', requireLogin, (req, res) => {
  const username = req.session.username;
  
  // 生成视频卡片 HTML
  let cardsHtml = '';
  for (const video of videoList) {
    cardsHtml += `
      <div class="video-card" data-fileid="${video.fileId}" data-title="${video.title}">
        <div class="video-thumb">🎬</div>
        <div class="video-info">
          <div class="video-title">${video.title}</div>
          <div class="video-desc">${video.desc}</div>
        </div>
      </div>
    `;
  }
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head><title>我的视频站</title>${globalStyles}</head>
    <body>
      <div class="container">
        <div class="nav">
          <a href="/">首页</a>
          <a href="/blog">博客</a>
          <a href="/logout" class="logout-link">登出</a>
        </div>
        <div class="welcome-text">
          <h2>📹 欢迎，${username}</h2>
          <p>点击卡片播放视频</p>
        </div>
        <div class="video-grid" id="videoGrid">
          ${cardsHtml}
        </div>
      </div>
      
      <!-- 弹窗播放器 -->
      <div id="videoModal" class="modal">
        <div class="modal-content">
          <span class="close-modal">&times;</span>
          <video id="modalVideo" controls autoplay>
            <source id="videoSource" src="" type="video/mp4">
          </video>
        </div>
      </div>
      
      <script>
        const modal = document.getElementById('videoModal');
        const modalVideo = document.getElementById('modalVideo');
        const videoSource = document.getElementById('videoSource');
        const closeBtn = document.querySelector('.close-modal');
        
        function openVideo(fileId, title) {
          const url = \`https://drive.google.com/uc?export=download&id=\${fileId}\`;
          videoSource.src = url;
          modalVideo.load();
          modal.style.display = 'flex';
          modalVideo.play();
        }
        
        document.querySelectorAll('.video-card').forEach(card => {
          card.addEventListener('click', () => {
            const fileId = card.dataset.fileid;
            const title = card.dataset.title;
            openVideo(fileId, title);
          });
        });
        
        closeBtn.onclick = () => {
          modal.style.display = 'none';
          modalVideo.pause();
          videoSource.src = '';
        };
        window.onclick = (e) => {
          if (e.target === modal) {
            modal.style.display = 'none';
            modalVideo.pause();
            videoSource.src = '';
          }
        };
      </script>
    </body>
    </html>
  `;
  res.send(html);
});

// ---------- 博客路由（保留原有功能） ----------
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
      <body style="display:flex; justify-content:center; padding:2rem;">
        <div style="background:white; border-radius:32px; padding:2rem; max-width:800px;">
          <h2>📝 博客</h2>
          <p>暂无文章，请创建 posts 文件夹并添加 .md 文件。</p>
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
      <body style="display:flex; justify-content:center; padding:2rem;">
        <div style="background:white; border-radius:32px; padding:2rem;">
          <h2>📝 博客</h2>
          <p>还没有文章，去写一篇吧！</p>
          <a href="/">返回主页</a>
        </div>
      </body>
      </html>
    `);
  }
  let listHtml = '<ul>';
  files.forEach(file => {
    const name = file.replace('.md', '');
    listHtml += `<li><a href="/blog/${name}">${name}</a></li>`;
  });
  listHtml += '</ul>';
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>博客列表</title>${globalStyles}</head>
    <body style="display:flex; justify-content:center; padding:2rem;">
      <div style="background:white; border-radius:32px; padding:2rem; max-width:800px;">
        <h2>📝 博客列表</h2>
        ${listHtml}
        <a href="/">← 主页</a>
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
      <body style="display:flex; justify-content:center; padding:2rem;">
        <div style="background:white; border-radius:32px; padding:2rem; max-width:800px;">
          <div class="blog-content">${htmlContent}</div>
          <a href="/blog">← 返回列表</a> | <a href="/">主页</a>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    res.status(404).send(`
      <!DOCTYPE html>
      <html>
      <head><title>404</title>${globalStyles}</head>
      <body style="display:flex; justify-content:center;">
        <div><h2>文章不存在</h2><a href="/blog">返回列表</a></div>
      </body>
      </html>
    `);
  }
});

module.exports = app;