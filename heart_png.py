from PIL import Image, ImageDraw, ImageFont
import random
import numpy as np

# 背景字体
bck_font = ImageFont.truetype("./ttf/Arial-BoldItalicMT.ttf", 12) # 需系统有对应字体，也可换其他字体路径
# 文本内容
text = "牛翊君"
# 文本字体
text_font = ImageFont.truetype("./ttf/FLyouzichati-Regular-2.ttf", 60)
# 保存路径
save_path = "heart.png"

# 创建黑色背景图像
width, height = 800, 600
img = Image.new("RGB", (width, height), "black")
draw = ImageDraw.Draw(img)

def heart_shape(t, scale=15, offset_x=width//2, offset_y=height//2):
    """生成爱心曲线上的点"""
    x = 16 * np.sin(t)**3
    y = 13 * np.cos(t) - 5 * np.cos(2*t) - 2 * np.cos(3*t) - np.cos(4*t)
    return offset_x + x * scale, offset_y - y * scale  # y轴反转


# 定义要使用的字符集，可自行调整
chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
# 定义粉色，可调整RGB值
pink = (255, 105, 180)

# 随机在背景绘制字符，模拟字符矩阵效果
for y in range(0, height, 12):
  for x in range(0, width, 12):
    char = random.choice(chars)
    draw.text((x, y), char, font=bck_font, fill=pink)
    
    # 绘制心形（这里用近似心形的多边形顶点模拟，也可用更精确的数学公式绘制）
    heart_points = []
    t_values = np.linspace(0, 2*np.pi, 300)
    for i, t in enumerate(t_values):
        heart_points.append(heart_shape(t))
    
    draw.polygon(heart_points, fill=pink)

# 在心形中间写文字，需调整字体大小和位置适配
# 使用textbbox获取边界框，然后计算宽度和高度
bbox = draw.textbbox((0, 0), text, font=text_font)
text_width = bbox[2] - bbox[0]  # right - left
text_height = bbox[3] - bbox[1]  # bottom - top
draw.text(((width - text_width) / 2, (height - text_height) / 2), text, font=text_font, fill='black')

# 保存图像
img.save(save_path)
