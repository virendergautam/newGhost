document.addEventListener("DOMContentLoaded", function () {
  themeToggle();
});

const themeToggle = () => {
  const html = document.documentElement;
  let customValue = html.getAttribute("data-theme-value");
  if (customValue === "Dark") {
    html.setAttribute("data-theme", "dark");
  } else if (customValue === "Light") {
    html.setAttribute("data-theme", "light");
  } else {
    const toggleBtn = document.getElementById("theme-toggle");

    if (!toggleBtn) return;

    const darkIcon = toggleBtn.querySelector(".icon-dark");
    const lightIcon = toggleBtn.querySelector(".icon-light");

    // Get saved theme OR default to light
    let currentTheme = localStorage.getItem("theme") || "light";

    // Apply initial theme
    html.setAttribute("data-theme", currentTheme);

    if (currentTheme === "dark") {
      darkIcon.classList.add("hidden");
      lightIcon.classList.remove("hidden");
    } else {
      darkIcon.classList.remove("hidden");
      lightIcon.classList.add("hidden");
    }

    toggleBtn.addEventListener("click", () => {
      // Toggle theme
      currentTheme = currentTheme === "dark" ? "light" : "dark";

      // Apply
      html.setAttribute("data-theme", currentTheme);
      localStorage.setItem("theme", currentTheme);

      // Update icons
      if (currentTheme === "dark") {
        darkIcon.classList.add("hidden");
        lightIcon.classList.remove("hidden");
      } else {
        darkIcon.classList.remove("hidden");
        lightIcon.classList.add("hidden");
      }
    });
  }
};
