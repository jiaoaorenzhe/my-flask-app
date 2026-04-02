from flask import Flask
import datetime

app = Flask(__name__)

@app.route('/')
def home():
    now = datetime.datetime.now()
    return f"""
    <h1>我的动态网站 (Python + Flask)</h1>
    <p>当前时间: {now}</p>
    <p>这是一个运行在 Render 免费服务上的动态网页。</p>
    """

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)
