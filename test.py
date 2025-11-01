import time
import pygame
import sys
import math
import random
import numpy as np

# 初始化pygame
pygame.init()

# 屏幕设置
WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("浪漫粒子爱心")

# 颜色定义
WHITE = (255, 255, 255)
PINK = (255, 105, 180)
RED = (255, 0, 0)
BACKGROUND = (0, 0, 30)  # 深色背景

class Particle:
    """ 粒子类 """

    x: float
    """ 粒子的x坐标 """
    y: float
    """ 粒子的y坐标 """
    vx: float
    """ 粒子的x轴速度 """
    vy: float
    """ 粒子的y轴速度 """
    size: float
    """ 粒子的大小 """
    color: tuple[int, int, int]
    """ 粒子的颜色 """
    target_x: float 
    """ 粒子的目标x坐标 """
    target_y: float  
    """ 粒子的目标y坐标 """
    active: bool
    """ 粒子是否活跃 """
    float_offset: float
    """ 粒子的浮动偏移 """

    

    def __init__(self):
        """ 初始化粒子 """

        # 初始位置设为屏幕中心，避免随机到屏幕外
        self.x = WIDTH // 2
        self.y = HEIGHT // 2

        # 随机初始速度（轻微扩散，后续后汇聚）
        self.vx = 1 # random.uniform(-1, 1)
        self.vy = 1 #random.uniform(-1, 1)
        self.size = 1 #random.uniform(1, 3)
        
        # 颜色随机粉色系
        self.color = (
            255,
            random.randint(50, 150),
            random.randint(100, 200)
        )
        
        self.target_x = -1 # 初始目标点设为无效值
        self.target_y = -1 # 初始目标点设为无效值
        
        # 增加活跃状态标记，避免证粒子始终被绘制
        self.active = True

        self.float_offset = 1 #random.uniform(0, 1*math.pi)

 
    def move_to_target(self):
        """ 粒子 向 目标点 移动 """

        if not self.active or self.target_x is None or self.target_y is None:
            """ 粒子不活跃 或 无目标点 时, 不移动 """
            return
        
        # 计算粒子到目标点的向量
        dx = self.target_x - self.x
        dy = self.target_y - self.y
        distance = math.sqrt(dx**2 + dy**2)
        """ 粒子到目标点的距离 """

        # 移动速度调整：前期快速汇聚，后期稳定
        speed_factor = 0.03 if distance > 50 else 0.01
        self.x += dx * speed_factor
        self.y += dy * speed_factor
        
        # 限制粒子在屏幕内（避免移出视野）
        self.x = max(0, min(self.x, WIDTH))
        self.y = max(0, min(self.y, HEIGHT))

    def draw(self):
        if self.active:
            pygame.draw.circle(
                screen, 
                self.color, 
                (int(self.x), int(self.y)), 
                int(self.size)
            )


def heart_shape(t, scale=10, offset_x=WIDTH//2, offset_y=HEIGHT//2 + 50):
    """生成爱心曲线上的点"""
    x = 16 * np.sin(t)**3
    y = 13 * np.cos(t) - 5 * np.cos(2*t) - 2 * np.cos(3*t) - np.cos(4*t)
    return offset_x + x * scale, offset_y - y * scale  # y轴反转


def main():
    clock = pygame.time.Clock()  

    particles = [Particle() for _ in range(1000)]  # 减少粒子数量，提升稳定性
    
    # 为粒子分配爱心目标点
    # np.linspace 生成等间距的t值，确保每个粒子都有一个目标点
    t_values = np.linspace(0, 2*np.pi, len(particles))
    for i, p in enumerate(particles):
        p.target_x, p.target_y = heart_shape(t_values[i])

    running = True
    while running:
        # 事件处理
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYUP and event.key == pygame.K_SPACE:
                """ 按空格退出 """
                running = False

        # 填充背景（全黑会导致拖影消失，用半透明保留轻微拖影）
        screen.fill(BACKGROUND)
        
        # 粒子移动并绘制
        for p in particles:
            p.move_to_target()
            p.draw()
        
        # 刷新屏幕
        pygame.display.flip()
        clock.tick(60)

    pygame.quit()
    sys.exit()


# 主程序入口
if __name__ == "__main__":
    main()