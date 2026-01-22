/// <reference lib="dom" />
// 汉堡菜单交互逻辑（极简实现，符合项目规范）
document.addEventListener("DOMContentLoaded", () => {
  // 获取DOM元素，添加容错（元素不存在时不报错）
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const sidebar = document.getElementById("siteSidebar");

  if (!hamburgerBtn || !sidebar) {
    console.warn("汉堡菜单/侧边栏元素未找到，跳过交互初始化");
    return;
  }

  // 切换侧边栏显示/隐藏
  const toggleSidebar = () => {
    sidebar.classList.toggle("show");
    // 添加调试日志，查看类名变化
    console.log("侧边栏当前类名：", sidebar.className);
    // 更新按钮aria属性，适配无障碍访问
    const isOpen = sidebar.classList.contains("show");
    hamburgerBtn.setAttribute("aria-expanded", isOpen.toString());
    hamburgerBtn.textContent = isOpen ? "✕" : "☰";
  };

  // 绑定点击事件
  hamburgerBtn.addEventListener("click", toggleSidebar);

  // 移动端点击主内容区自动收起侧边栏
  const content = document.getElementById("siteContent");
  if (content) {
    content.addEventListener("click", () => {
      if (window.innerWidth <= 768 && sidebar.classList.contains("show")) {
        toggleSidebar();
      }
    });
  }

  // 窗口大小变化时重置侧边栏状态
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      sidebar.classList.remove("show");
      hamburgerBtn.setAttribute("aria-expanded", "false");
      hamburgerBtn.textContent = "☰";
    }
  });
});
