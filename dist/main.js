// src/main.ts
document.addEventListener("DOMContentLoaded", () => {
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const sidebar = document.getElementById("siteSidebar");
  if (!hamburgerBtn || !sidebar) {
    console.warn("\u6C49\u5821\u83DC\u5355/\u4FA7\u8FB9\u680F\u5143\u7D20\u672A\u627E\u5230\uFF0C\u8DF3\u8FC7\u4EA4\u4E92\u521D\u59CB\u5316");
    return;
  }
  const toggleSidebar = () => {
    sidebar.classList.toggle("show");
    console.log("\u4FA7\u8FB9\u680F\u5F53\u524D\u7C7B\u540D\uFF1A", sidebar.className);
    const isOpen = sidebar.classList.contains("show");
    hamburgerBtn.setAttribute("aria-expanded", isOpen.toString());
    hamburgerBtn.textContent = isOpen ? "\u2715" : "\u2630";
  };
  hamburgerBtn.addEventListener("click", toggleSidebar);
  const content = document.getElementById("siteContent");
  if (content) {
    content.addEventListener("click", () => {
      if (window.innerWidth <= 768 && sidebar.classList.contains("show")) {
        toggleSidebar();
      }
    });
  }
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      sidebar.classList.remove("show");
      hamburgerBtn.setAttribute("aria-expanded", "false");
      hamburgerBtn.textContent = "\u2630";
    }
  });
});
