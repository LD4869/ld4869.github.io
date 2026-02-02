// src/main.ts
document.addEventListener("DOMContentLoaded", () => {
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const sidebar = document.getElementById("siteSidebar");
  const content = document.getElementById("siteContent");
  if (!hamburgerBtn || !sidebar || !content) {
    console.warn("\u6C49\u5821\u83DC\u5355/\u4FA7\u8FB9\u680F/\u4E3B\u5BB9\u5668\u5143\u7D20\u672A\u627E\u5230\uFF0C\u8DF3\u8FC7\u4EA4\u4E92\u521D\u59CB\u5316");
    return;
  }
  const toggleSidebar = () => {
    sidebar.classList.toggle("show");
    const isOpen = sidebar.classList.contains("show");
    hamburgerBtn.setAttribute("aria-expanded", isOpen.toString());
    hamburgerBtn.textContent = isOpen ? "\u2715" : "\u2630";
    content.classList.toggle("sidebar-open", isOpen);
    console.log("\u5BB9\u5668\u5C5E\u6027:", content.classList);
  };
  hamburgerBtn.addEventListener("click", toggleSidebar);
  if (content) {
    content.addEventListener("click", () => {
      if (self.innerWidth <= 768 && sidebar.classList.contains("show")) {
        toggleSidebar();
      }
    });
  }
  self.addEventListener("resize", () => {
    if (self.innerWidth > 768) {
      sidebar.classList.remove("show");
      content.classList.remove("sidebar-open");
      hamburgerBtn.setAttribute("aria-expanded", "false");
      hamburgerBtn.textContent = "\u2630";
    }
  });
});
