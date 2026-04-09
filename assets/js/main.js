document.addEventListener("DOMContentLoaded", function () {
  themeToggle();
  swiperJs();
  homePagePostLoadMore();
  addClassToHeaderOnScroll()
  allAuthorsPageLoadMore()
});

const themeToggle = () => {
  const html = document.documentElement;
  let customValue = html.getAttribute("data-theme-value");
  if (customValue === "Dark") {
    localStorage.setItem("theme", "dark");
    html.setAttribute("data-theme", "dark");
  } else if (customValue === "Light") {
    localStorage.setItem("theme", "light");
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
const swiperJs = () => {
  const thumbsSwiper = new Swiper(".thumbs-swiper", {
    slidesPerView: "auto",
    freeMode: true,
    watchSlidesVisibility: true,
    watchSlidesProgress: true,
  });

  const mainSwiper = new Swiper(".main-swiper", {
    slidesPerView: "1",
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    thumbs: {
      swiper: thumbsSwiper,
    },
    navigation: {
      nextEl: ".swiper-button-next-custom",
      prevEl: ".swiper-button-prev-custom",
    },
    on: {
      slideChange: function () {
        const activeIndex = this.realIndex + 1;
        document.querySelector(".active-index").textContent = activeIndex;
      },
    },
  });

  // Tab Switching Logic
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabGrids = document.querySelectorAll(".tab-grid");
  const viewAllLink = document.getElementById("view-all-link");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");

      // Update buttons
      tabBtns.forEach((b) => {
        b.classList.remove("active");
      });
      btn.classList.add("active");

      // Update grids
      tabGrids.forEach((grid) => grid.classList.add("hidden"));
      document.getElementById(`tab-${tabId}`).classList.remove("hidden");

      // Update View All link if needed
      if (tabId === "all") {
        viewAllLink.href = "/archive";
      } else {
        viewAllLink.href = `/tag/${tabId}`;
      }
    });
  });
};

const homePagePostLoadMore = () => {
  const POSTS_PER_LOAD = 8;

  // TAB SWITCHING
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabGrids = document.querySelectorAll(".tab-grid");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.dataset.tab;

      tabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      tabGrids.forEach((grid) => grid.classList.add("hidden"));
      const activeTab = document.getElementById(`tab-${tabId}`);
      activeTab.classList.remove("hidden");

      // Reset show more when switching tab
      initTab(activeTab, true);
    });
  });

  // INIT EACH TAB
  function initTab(tab, reset = false) {
    const posts = tab.querySelectorAll(".post-item");
    const btn = tab.querySelector(".show-more-btn");

    if (!posts.length) return;

    if (reset) {
      posts.forEach((p) => p.classList.add("hidden"));
      tab.dataset.visible = 0;
    }

    let visible = parseInt(tab.dataset.visible || 0);

    function showNext() {
      for (let i = visible; i < visible + POSTS_PER_LOAD; i++) {
        if (posts[i]) {
          posts[i].classList.remove("hidden");
        }
      }

      visible += POSTS_PER_LOAD;
      tab.dataset.visible = visible;

      if (btn && visible >= posts.length) {
        btn.style.display = "none";
      } else if (btn) {
        btn.style.display = "inline-block";
      }
    }

    // Prevent multiple bindings
    if (!tab.dataset.initialized) {
      showNext();

      if (btn) {
        btn.addEventListener("click", showNext);
      }

      tab.dataset.initialized = "true";
    } else if (reset) {
      if (btn) btn.style.display = "inline-block";
      showNext();
    }
  }

  // INIT ALL TABS ON LOAD
  document.querySelectorAll(".tab-grid").forEach((tab) => {
    initTab(tab);
  });
};
const addClassToHeaderOnScroll=()=>{
   const header = document.getElementById("siteHeader");

  if (!header) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("is-sticky");
    } else {
      header.classList.remove("is-sticky");
    }
  });
}
const allAuthorsPageLoadMore = () => {
    const items = document.querySelectorAll(".author-item");
  const btn = document.getElementById("loadMoreAuthors");

  if (!items.length || !btn) return;

  let visible = 12; // 👈 show only 12 initially

  function update() {
    items.forEach((item, index) => {
      item.style.display = index < visible ? "block" : "none";
    });

    // Hide button if all items already visible
    if (visible >= items.length) {
      btn.style.display = "none";
    } else {
      btn.style.display = "block";
    }
  }

  btn.addEventListener("click", () => {
    visible += 12; // 👈 load 12 more each click
    update();
  });

  update();

}