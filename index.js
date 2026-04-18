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

// 全局样式（略，和之前一样）
const globalStyles = `
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, sans-serif;
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
      min-height: 100vh;
      padding: 20px;
    }
    .container { max-width: 1400px; margin: 0 auto; }
    .nav {
      display: flex;
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
      padding: 0.5rem 1rem;
      border-radius: 40px;
    }
    .nav a:hover { background: rgba(255,255,255,0.2); }
    .logout-link { background: #ef4444; }
    .video-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }
    .video-card {
      background: white;
      border-radius: 24px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .video-card:hover { transform: translateY(-5px); }
    .video-thumb {
      aspect-ratio: 16/9;
      background: #1f2937;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      color: white;
    }
    .video-info { padding: 1rem; }
    .video-title { font-weight: 600; margin-bottom: 0.3rem; }
    .video-desc { font-size: 0.85rem; color: #4b5563; }
    .modal {
      display: none;
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0,0,0,0.9);
      z-index: 1000;
      align-items: center;
      justify-content: center;
    }
    .modal-content {
      background: black;
      max-width: 90%;
      border-radius: 16px;
      position: relative;
    }
    .modal video { width: 100%; max-height: 80vh; }
    .close-modal {
      position: absolute;
      top: 10px; right: 20px;
      color: white;
      font-size: 2rem;
      cursor: pointer;
    }
    .welcome-text { text-align: center; color: white; margin-bottom: 1rem; }
  </style>
`;

app.get('/login', (req, res) => {
  if (req.session.loggedIn) return res.redirect('/');
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>登录</title>${globalStyles}</head>
    <body style="display:flex; align-items:center; justify-content:center;">
      <div style="background:white; border-radius:32px; padding:2rem; width:100%; max-width:400px;">
        <h2 style="text-align:center;">登录</h2>
        <form method="post" action="/login">
          <input type="text" name="username" placeholder="用户名" required style="width:100%; padding:10px; margin:10px 0; border-radius:28px; border:1px solid #ddd;">
          <input type="password" name="password" placeholder="密码" required style="width:100%; padding:10px; margin:10px 0; border-radius:28px; border:1px solid #ddd;">
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
    res.send('<h3>用户名或密码错误</h3><a href="/login">返回</a>');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

const videoList = [
  {
    title: '我的视频',
    desc: 'Google Drive 视频',
    fileId: '1A0QIEpbyzRWSh-A4jUog3vrucFkpYAuH'  // 你的真实ID
  }
];

app.get('/', requireLogin, (req, res) => {
  const username = req.session.username;
  let cardsHtml = '';
  for (const v of videoList) {
    cardsHtml += `
      <div class="video-card" data-fileid="${v.fileId}">
        <div class="video-thumb">🎬</div>
        <div class="video-info">
          <div class="video-title">${v.title}</div>
          <div class="video-desc">${v.desc}</div>
        </div>
      </div>
    `;
  }
  const html = `
    <!DOCTYPE html>
    <html>
    <head><title>视频站</title>${globalStyles}</head>
    <body>
      <div class="container">
        <div class="nav">
          <a href="/">首页</a>
          <a href="/logout" class="logout-link">登出</a>
        </div>
        <div class="welcome-text">
          <h2>📹 欢迎，${username}</h2>
          <p>点击卡片播放视频</p>
        </div>
        <div class="video-grid">${cardsHtml}</div>
      </div>
      <div id="modal" class="modal">
        <div class="modal-content">
          <span class="close-modal">&times;</span>
          <video id="videoPlayer" controls autoplay>
            <source id="videoSource" src="" type="video/mp4">
          </video>
        </div>
      </div>
      <script>
        const modal = document.getElementById('modal');
        const videoPlayer = document.getElementById('videoPlayer');
        const videoSource = document.getElementById('videoSource');
        const closeBtn = document.querySelector('.close-modal');
        function openVideo(fileId) {
          const url = 'https://drive.google.com/uc?export=download&id=' + fileId;
          videoSource.src = url;
          videoPlayer.load();
          modal.style.display = 'flex';
          videoPlayer.play();
        }
        document.querySelectorAll('.video-card').forEach(card => {
          card.addEventListener('click', () => {
            const fileId = card.dataset.fileid;
            openVideo(fileId);
          });
        });
        closeBtn.onclick = () => {
          modal.style.display = 'none';
          videoPlayer.pause();
          videoSource.src = '';
        };
        window.onclick = (e) => {
          if (e.target === modal) {
            modal.style.display = 'none';
            videoPlayer.pause();
            videoSource.src = '';
          }
        };
      </script>
    </body>
    </html>
  `;
  res.send(html);
});

module.exports = app;