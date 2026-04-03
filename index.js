// 受保护的主页（论坛风格，无空壳链接）
app.get('/', requireLogin, (req, res) => {
  const now = new Date();
  const username = req.session.username;
  
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
      /* 顶部导航 */
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
      /* 两列布局 */
      .grid-main {
        display: grid;
        grid-template-columns: 1fr 280px;
        gap: 2rem;
      }
      /* 欢迎卡片 */
      .welcome-card {
        background: linear-gradient(135deg, #667eea20, #764ba220);
        border-radius: 24px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        text-align: center;
      }
      /* 特色板块网格 */
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
      /* 资讯卡片 */
      .news-card {
        background: #f9fafb;
        border-radius: 20px;
        padding: 1.2rem;
        margin-bottom: 1rem;
      }
      /* 侧边栏卡片 */
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
      /* 底部导航 */
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
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head><title>我的社区 · 主页</title>${globalStyles}${forumStyles}</head>
    <body>
      <div class="forum-container">
        <!-- 顶部导航：只保留真实可用的链接 -->
        <div class="forum-nav">
          <a href="/">首页</a>
          <a href="/blog">博客</a>
          <a href="/logout" class="logout-link">登出</a>
        </div>
        
        <!-- 欢迎横幅 -->
        <div class="welcome-card">
          <h2>🎮 欢迎回来，${username}！</h2>
          <p>🕒 服务器时间：${now.toLocaleString()}</p>
        </div>
        
        <!-- 主内容：两列布局 -->
        <div class="grid-main">
          <!-- 左侧主内容区 -->
          <div>
            <!-- 特色板块（你可以替换成自己的内容） -->
            <div class="feature-grid">
              <div class="feature-item">
                <div class="feature-icon">📦</div>
                <h3>冒险世界</h3>
                <p>筑梦之旅</p>
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
                <li><a href="#">Minecraft Java版 26w14a 发布 —— Herdcraft 更新</a></li>
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
              <p>签到可获得积分</p>
              <a href="#" class="btn-sm">签到（演示）</a>
            </div>
            <div class="sidebar-card">
              <div class="sidebar-title">👥 热门帖子</div>
              <ul class="post-list">
                <li><a href="#">如何开始你的第一个模组？</a></li>
                <li><a href="#">建筑大赛作品展示</a></li>
                <li><a href="#">服务器宣传集中贴</a></li>
              </ul>
            </div>
            <div class="sidebar-card">
              <div class="sidebar-title">🎵 友情链接</div>
              <p>旋律云 · 免费不限速存储</p>
            </div>
          </div>
        </div>
        
        <!-- 底部导航栏 -->
        <div class="footer-nav">
          <a href="/">首页</a>
          <a href="/blog">博客</a>
          <a href="#">关于本站</a>
          <a href="#">联系我们</a>
          <a href="/logout">登出</a>
        </div>
        
        <div class="info-text" style="margin-top: 1rem; text-align: center;">
          Powered by Vercel + Node.js | 我的个人社区
        </div>
      </div>
    </body>
    </html>
  `;
  
  res.send(html);
});