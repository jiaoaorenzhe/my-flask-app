from flask import Flask
import datetime

app = Flask(__name__)

@app.route('/')
def home():
    now = datetime.datetime.now()
    return f"""
    <h1>我的动态网站 (Python + Flask on Vercel)</h1>
    <p>当前时间: {now}</p>
    <p>部署在 Vercel 免费服务上。</p>
    """

# Vercel 需要这个 handler
from mangum import Mangum
handler = Mangum(app)
