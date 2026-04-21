document.addEventListener("DOMContentLoaded", function () {
  themeToggle();
  swiperJs();
  homePagePostLoadMore();
  addClassToHeaderOnScroll();
  allAuthorsPageLoadMore();
  socialLinks();
  lazyLoadImages()
  marqueeText()
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
// 🔹 CATEGORIES SWIPER
const categoriesEl = document.querySelector(".categories-swiper");

if (categoriesEl) {
  new Swiper(".categories-swiper", {
    slidesPerView: "5",
    spaceBetween: 12,
    grabCursor: true,
    speed: 500,

    // 🔥 Navigation (YOUR BUTTONS)
    navigation: {
      nextEl: ".categories-next",
      prevEl: ".categories-prev",
    },

    // Optional smooth feel
    freeMode: {
      enabled: true,
      momentum: true,
      momentumRatio: 0.8,
    },

    breakpoints: {
      640: {
        spaceBetween: 12,
      },
      1024: {
        spaceBetween: 16,
      },
    },
  });
}
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
        btn.style.display = "inline-flex";
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
      if (btn) btn.style.display = "inline-flex";
      showNext();
    }
  }

  // INIT ALL TABS ON LOAD
  document.querySelectorAll(".tab-grid").forEach((tab) => {
    initTab(tab);
  });
};
const addClassToHeaderOnScroll = () => {
  const header = document.getElementById("siteHeader");

  if (!header) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 120) {
      header.classList.add("is-sticky");
    } else {
      header.classList.remove("is-sticky");
    }
  });
};
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
};

const socialLinks = () => {
  const container = document.getElementsByClassName("social-links");
  if (!container) return;

  const links = container[0].dataset.links;
  if (!links) return;

  const platforms = {
    twitter: ["x.com", "twitter.com"],
    facebook: "facebook.com",
    instagram: "instagram.com",
    github: "github.com",
    tiktok: "tiktok.com",
    linkedin: "linkedin.com",
    dribbble: "dribbble.com",
    whatsapp: ["wa.me", "whatsapp.com"],
    pinterest: "pinterest.com",
    tumblr: "tumblr.com",
    discord: ["discord.gg", "discord.com"],
    mastodon: ["mastodon.social", "mstdn.social", "mastodon.cloud"],
    bluesky: "bsky.app",
    threads: "threads.net",
  };

  links.split(",").forEach((raw) => {
    const url = raw.trim();
    if (!url) return;

    let type = "link";

    Object.entries(platforms).forEach(([key, domain]) => {
      if (Array.isArray(domain)) {
        if (domain.some((d) => url.includes(d))) type = key;
      } else {
        if (url.includes(domain)) type = key;
      }
    });

    Array.from(container).forEach((c) => {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.setAttribute("aria-label", type);
      a.classList.add("social-link");

      a.innerHTML = getSocialIcon(type); // function below
      c.appendChild(a);
    });
  });

  function getSocialIcon(type) {
    switch (type) {
      case "twitter":
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M11.1168 8.62171L17.445 1H15.9452L10.4518 7.61757L6.06213 1H1L7.63701 11.008L1 19H2.49989L8.30196 12.0109L12.9379 19H18L11.1168 8.62171ZM9.06316 11.0954L8.39071 10.099L3.03985 2.17H5.34343L9.66061 8.569L10.3331 9.56543L15.9464 17.884H13.6428L9.06316 11.0954Z" fill="currentColor"/>
        </svg>`;
      case "facebook":
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10.7956 12.0529V19H7.08371V12.0459H4V8.82064H7.08371V7.64719C7.08371 3.29068 8.93251 1 12.8443 1C14.0435 1 14.3433 1.18972 15 1.3443V4.53439C14.2648 4.40791 14.0578 4.33765 13.294 4.33765C12.3874 4.33765 11.902 4.59061 11.4594 5.0895C11.0169 5.58839 10.7956 6.45266 10.7956 7.68935V8.82766H15L13.8722 12.0529H10.1436H10.7956Z" stroke="currentColor" stroke-width="1.1"/>
        </svg>`;
      case "instagram":
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M15.1585 19H3.84148C2.27762 19 1 17.7224 1 16.1585V4.84148C1 3.27762 2.27762 2 3.84148 2H15.1585C16.7224 2 18 3.27762 18 4.84148V16.1585C18 17.7294 16.7294 19 15.1585 19Z" stroke="currentColor" stroke-width="1.3"/>
        <path d="M6.41763 13.5899C7.24145 14.4137 8.33755 14.8675 9.50346 14.8675C10.6694 14.8675 11.7585 14.4137 12.5893 13.5899C13.4131 12.7661 13.8669 11.67 13.8669 10.5041C13.8669 9.33816 13.4131 8.24206 12.5893 7.41824C11.7655 6.59442 10.6694 6.14062 9.50346 6.14062C8.33755 6.14062 7.24145 6.59442 6.41763 7.41824C5.59381 8.24206 5.14001 9.33816 5.14001 10.5041C5.14001 11.67 5.59381 12.7661 6.41763 13.5899Z" stroke="currentColor" stroke-width="1.3"/>
        <path d="M14.7174 5.99592C15.1801 5.99592 15.5552 5.62082 15.5552 5.15812C15.5552 4.69541 15.1801 4.32031 14.7174 4.32031C14.2547 4.32031 13.8796 4.69541 13.8796 5.15812C13.8796 5.62082 14.2547 5.99592 14.7174 5.99592Z" stroke="currentColor" stroke-width="1.1"/>
        </svg>`;
      case "github":
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M1.50006 13.6678C1.95006 13.7218 2.28339 13.9278 2.50006 14.2858C2.82606 14.8228 4.03706 16.8118 5.41306 16.8118H7.50006M13.1721 13.2988C13.7207 14.0175 13.9951 14.6628 13.9951 15.2348V18.9998M8.37006 13.3908C7.79006 14.0268 7.50039 14.6312 7.50106 15.2038V18.9998" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M13.172 13.2991C14.374 13.0491 15.465 12.6171 16.312 11.9831C17.76 10.8991 18.5 9.22508 18.5 7.57209C18.5 6.41209 18.06 5.32909 17.296 4.41209C16.871 3.90109 18.115 0.540092 17.01 1.05309C15.905 1.56709 14.285 2.25109 13.436 2.00009C12.527 1.73209 11.536 1.58409 10.5 1.58409C9.59999 1.58409 8.73399 1.69509 7.92599 1.90109C6.752 2.19909 5.63 1.53809 4.5 1.05309C3.37 0.569092 3.987 4.06109 3.651 4.47509C2.921 5.38009 2.5 6.44009 2.5 7.57209C2.5 9.22508 3.395 10.8991 4.843 11.9821C5.808 12.7041 7.017 13.1651 8.36999 13.3921" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
      case "tiktok":
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M13.795 1.68473L13.3483 1H10.6448V7.16708L10.6356 13.1909C10.6402 13.2357 10.6448 13.2849 10.6448 13.3297C10.6448 14.8379 9.38284 16.0686 7.82614 16.0686C6.26943 16.0686 5.00748 14.8424 5.00748 13.3297C5.00748 11.8215 6.26943 10.5908 7.82614 10.5908C8.14853 10.5908 8.46172 10.6489 8.75187 10.7474V7.73993C8.4525 7.6907 8.14393 7.66385 7.82614 7.66385C4.616 7.66832 2 10.2103 2 13.3342C2 16.458 4.616 19 7.83074 19C11.0455 19 13.6615 16.458 13.6615 13.3342V6.16907C14.8267 7.30134 16.3328 8.40676 18 8.76032V5.68573C16.19 4.90701 14.3892 2.60666 13.795 1.68473Z" stroke="currentColor" stroke-width="1.3"/>
        </svg>`;
      case "linkedin":
        return `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
        <path d="M14.51 14.9989V10.2383C14.51 7.8986 14.0064 6.11133 11.2767 6.11133C9.96062 6.11133 9.08324 6.82624 8.72578 7.50865H8.69329V6.32255H6.10986V14.9989H8.80702V10.6932C8.80702 9.55589 9.01824 8.46728 10.4156 8.46728C11.7966 8.46728 11.8129 9.75087 11.8129 10.7582V14.9827H14.51V14.9989Z" fill="currentColor"/>
        <path d="M2.21143 6.32031H4.90858V14.9967H2.21143V6.32031Z" fill="currentColor"/>
        <path d="M3.5598 2C2.69866 2 2 2.69866 2 3.5598C2 4.42094 2.69866 5.13585 3.5598 5.13585C4.42094 5.13585 5.1196 4.42094 5.1196 3.5598C5.1196 2.69866 4.42094 2 3.5598 2Z" fill="currentColor"/>
        </svg>`;
      case "dribbble":
        return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.3333 10.0003C18.3347 11.098 18.1185 12.185 17.6974 13.1986C17.2762 14.2122 16.6584 15.1323 15.8796 15.9057C15.1071 16.6768 14.1902 17.2881 13.1814 17.7047C12.1725 18.1213 11.0915 18.335 10 18.3337C5.3975 18.3337 1.66666 14.6028 1.66666 10.0003C1.66366 7.86355 2.48445 5.80785 3.95833 4.26075C4.73593 3.44011 5.67283 2.78679 6.71168 2.34081C7.75052 1.89482 8.86946 1.66554 10 1.667C11.0915 1.66565 12.1725 1.87938 13.1814 2.29597C14.1902 2.71257 15.1071 3.32386 15.8796 4.09492C16.6584 4.86837 17.2762 5.78848 17.6974 6.80209C18.1185 7.8157 18.3347 8.90271 18.3333 10.0003Z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M18.3333 9.99998C17.1175 9.99998 13.7633 9.54165 10.7613 10.8596C7.50001 12.2916 5.13876 14.5133 4.10959 15.8946" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M6.875 2.27246C8.17917 3.47621 11.025 6.54079 12.0833 9.58329C13.1417 12.6258 13.5333 16.3666 13.775 17.4312" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M1.73083 8.95879C3.305 9.05379 7.47209 9.13921 10.1388 8.00046C12.8054 6.86171 15.1 4.76712 15.8871 4.10254M2.29167 13.1725C3.02608 14.9499 4.35038 16.42 6.04167 17.3355" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M1.66666 10.0003C1.66366 7.86355 2.48445 5.80785 3.95833 4.26075C4.73593 3.44011 5.67283 2.78679 6.71168 2.34081C7.75052 1.89482 8.86946 1.66554 10 1.667M13.3333 2.36033C14.2825 2.77524 15.146 3.36349 15.8796 4.09492C16.6584 4.86837 17.2762 5.78848 17.6974 6.80209C18.1185 7.8157 18.3347 8.90271 18.3333 10.0003C18.3333 11.0262 18.1479 12.0091 17.8083 12.917M10 18.3337C11.0915 18.335 12.1725 18.1213 13.1814 17.7047C14.1902 17.2881 15.1071 16.6768 15.8796 15.9057" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
      case "whatsapp":
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M18.2955 6.17869C17.8405 5.16803 17.1875 4.26066 16.3583 3.47869C15.5291 2.7041 14.5679 2.0918 13.4965 1.66393C12.3885 1.22131 11.2144 1 10.0037 1C8.79293 1 7.61887 1.22131 6.51085 1.66393C5.43952 2.0918 4.47825 2.69672 3.64907 3.47869C2.81989 4.26066 2.16683 5.16803 1.71188 6.17869C1.24226 7.22623 1.00009 8.34754 1.00009 9.49836C1.00009 11.5123 1.74855 13.4451 3.12073 14.9795L2.50009 18.5L6.29071 17.2516C7.45743 17.7533 8.69753 18.0041 9.99634 18.0041C11.2071 18.0041 12.3812 17.7828 13.4892 17.3402C14.5605 16.9123 15.5218 16.3074 16.3509 15.5254C17.1801 14.7434 17.8332 13.8361 18.2881 12.8254C18.7578 11.7779 18.9999 10.6566 18.9999 9.50574C19.0073 8.34754 18.7651 7.23361 18.2955 6.17869Z" stroke="currentColor" stroke-width="1.3"/>
        <path d="M14.079 11.272C13.6989 11.0845 13.4211 10.9692 13.2237 10.897C13.0994 10.8538 12.807 10.724 12.7047 10.8033C12.383 11.0629 12.3145 11.6686 11.807 11.6686C10.7835 11.6686 10.5001 11.5 9.50012 10.5C8.50012 9.5 8.53908 9.38433 8.50012 9C8.47819 8.78367 8.69115 8.75535 8.77887 8.58949C9.23213 8.08471 8.88855 7.76743 8.83006 7.5583C8.72771 7.34197 8.55227 6.95257 8.39875 6.63528C8.26716 6.42616 8.23789 6.11608 8.00395 6.0007C7.00971 5.49593 6.43952 6.50548 6.20558 7.03189C4.79465 10.3851 13.2749 16.7669 15.0002 12.3681C15.0879 11.9859 15.0513 11.8417 14.9197 11.6686C14.6566 11.4884 14.3495 11.409 14.079 11.272Z" stroke="currentColor" stroke-width="1.3"/>
        </svg>`;
      case "pinterest":
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.8461 13.3018C9.41348 13.3202 9.92595 14.0738 11.4268 14.0738C14.2454 14.0922 16.1854 11.9233 16.7894 9.07417C18.8942 -0.796518 4.56331 -1.58691 3.09911 6.53757C2.75136 8.44921 3.31874 10.6549 4.80124 11.3718C5.936 11.9233 6.00921 10.3425 5.66146 9.66237C4.12405 6.64785 5.97261 3.92744 8.38854 3.15543C10.6581 2.42019 12.2687 3.02676 13.4949 4.29507C15.069 5.93099 14.3552 10.3792 12.4883 11.7946C11.8294 12.2909 10.6214 12.4012 9.99916 11.813C8.71799 10.6182 10.6947 8.08159 10.4018 6.22509C10.109 4.38697 7.21718 4.66269 7.07076 7.36472C6.99755 8.74331 7.4002 9.14769 7.08906 10.5263C6.59489 12.732 5.09408 17.2354 6.15563 19C7.71135 18.2648 8.48005 13.8533 8.8461 13.3018Z" stroke="currentColor" stroke-width="1.2"/>
        </svg>`;
      case "tumblr":
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M11.5098 0.900391V4.97559H14.3916V9.62305H11.0986V13.5654C11.0986 14.2173 11.5229 14.798 12.1553 15.0049C12.7877 15.2119 13.4837 14.9971 13.8828 14.4746L14.2842 13.9492L14.3809 13.8232L14.4531 13.9648L16.0889 17.1836L16.1162 17.2373L16.082 17.2871L15.9424 17.4824C14.9655 18.8871 13.347 19.7282 11.6162 19.7295H11.6152C8.72114 19.7266 6.37289 17.4226 6.37012 14.5762V9.62305H3.90039V6.51562L3.94141 6.48535L4.11133 6.36426L4.1123 6.36328C6.03887 5.00323 7.29992 3.49309 7.77148 1.29688L7.83887 0.979492L7.85547 0.900391H11.5098ZM8.67676 1.53809C8.10857 3.7366 6.81571 5.62161 4.92285 7.03027V8.61426H7.39355V14.5762C7.39343 16.35 8.54327 17.9282 10.2559 18.5C11.949 19.0653 13.8159 18.5202 14.9229 17.1484L14.1416 15.6143C13.3796 16.1517 12.3775 16.2413 11.5273 15.8379C10.6406 15.4171 10.0757 14.5348 10.0752 13.5654V8.61426H13.3682V5.98438H10.4863V1.53809H8.67676Z" fill="currentColor" stroke="currentColor" stroke-width="0.2"/>
        </svg>`;
      case "discord":
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M15.5 17.5L16.5 19.5C16.5 19.5 20.67 18.17 22 16C22 15 22.53 7.85 19 5.5C17.5 4.5 15 4 15 4L14 6H12H9.99997L9.02997 4C9.02997 4 6.52997 4.5 5.02997 5.5C1.49997 7.85 2.02997 15 2.02997 16C3.35997 18.17 7.52997 19.5 7.52997 19.5L8.52997 17.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M5.5 16C10.5 18.5 13.5 18.5 18.5 16" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M9 13.5C9.82843 13.5 10.5 12.8284 10.5 12C10.5 11.1716 9.82843 10.5 9 10.5C8.17157 10.5 7.5 11.1716 7.5 12C7.5 12.8284 8.17157 13.5 9 13.5Z" fill="currentColor"/>
        <path d="M15 13.5C15.8284 13.5 16.5 12.8284 16.5 12C16.5 11.1716 15.8284 10.5 15 10.5C14.1716 10.5 13.5 11.1716 13.5 12C13.5 12.8284 14.1716 13.5 15 13.5Z" fill="currentColor"/>
        </svg>`;
      case "mastadon":
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M1.66666 9.16667C1.66666 18.5 6.20999 18.75 9.16666 18.75C12.1233 18.75 12.6625 18.2408 13.3333 17.9625V16.6667C9.99999 17.4667 6.24999 17.2008 6.24999 14.5833H10.4167C12.5 14.5833 18.3333 14.75 18.3333 9.16667C18.3333 1.43917 14.0108 1.25 9.99999 1.25C5.98916 1.25 1.66666 1.4725 1.66666 9.16667Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
        <path d="M5.41666 12.083V6.87467C5.41666 6.26689 5.6581 5.68399 6.08787 5.25422C6.51764 4.82445 7.10054 4.58301 7.70832 4.58301C8.31611 4.58301 8.89901 4.82445 9.32878 5.25422C9.75855 5.68399 9.99999 6.26689 9.99999 6.87467M9.99999 6.87467V9.99967M9.99999 6.87467C9.99999 6.26689 10.2414 5.68399 10.6712 5.25422C11.101 4.82445 11.6839 4.58301 12.2917 4.58301C12.8994 4.58301 13.4823 4.82445 13.9121 5.25422C14.3419 5.68399 14.5833 6.26689 14.5833 6.87467V12.083" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
        </svg>`;
      case "bluesky":
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M18.9959 3.68713C19.0621 2.70231 18.3198 1.79582 17.3401 2.04035C13.76 2.93156 10.8726 7.76872 10 9.44798C9.12833 7.76872 6.23995 2.93156 2.65988 2.04035C1.68023 1.79678 0.937946 2.70231 1.0041 3.68713L1.29595 7.95308C1.44285 10.1309 3.35449 11.7873 5.5862 11.6727L6.0629 11.6383C6.02495 11.645 3.23775 12.1331 2.76495 13.5305C2.12482 15.4247 4.01019 16.7859 4.01019 16.7859C4.03159 16.8088 5.85276 18.788 7.67295 17.6446C9.09623 16.9664 10.001 13.8142 10.001 13.8142C10.001 13.8142 10.9047 16.9664 12.328 17.6446C14.157 18.7937 15.9879 16.7887 15.9898 16.7849C16.0054 16.7754 17.8723 15.418 17.2351 13.5305C16.7584 12.1235 13.9361 11.6392 13.9361 11.6392L14.4157 11.6727C16.6465 11.7873 18.5581 10.13 18.706 7.95308L18.9959 3.68713Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
        </svg>`;
      case "threads":
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M8.26168 6.77366C10.3492 5.09533 13.3533 5.99033 13.7083 8.75033C14.085 11.6787 13.3333 14.0003 10.4167 14.0003C7.70834 14.0003 7.79168 11.667 7.79168 11.667C7.79168 9.16699 12.0833 8.83366 14.5833 10.0837C19.1667 13.0003 15.8333 18.3337 10.8333 18.3337C6.69168 18.3337 3.33334 16.2503 3.33334 10.0003C3.33334 3.75033 6.69168 1.66699 10.8333 1.66699C13.7567 1.66699 16.3933 3.17283 17.3625 6.18366" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
      default:
        return `🔗`;
    }
  }
};
const copyToClipboard = (url) => {
  navigator.clipboard
    .writeText(url)
    .then(function () {
      alert("Link copied to clipboard!");
    })
    .catch(function (err) {
      console.error("Failed to copy: ", err);
    });
};
const lazyLoadImages = () => {
  //   const lazyImages = document.querySelectorAll('img.lazyload');

  //   const observer = new IntersectionObserver((entries, observer) => {
  //       entries.forEach(entry => {
  //           if (entry.isIntersecting) {
  //               const img = entry.target;
  //               // Swap the tiny src for the real data-src
  //               img.src = img.dataset.src;
  //               img.onload = () => img.classList.add('lazyloaded');
  //               observer.unobserve(img);
  //           }
  //       });
  //   });

  // lazyImages.forEach(img => observer.observe(img));.

  const images = document.querySelectorAll(".progressive-load");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  }, { threshold: 0.2 });

  images.forEach(img => {

    // ✅ Wait for image load FIRST
    if (img.complete) {
      img.classList.remove("lazyload");
      img.classList.add("lazyloaded");
      observer.observe(img);
    } else {
      img.addEventListener("load", () => {
        img.classList.remove("lazyload");
        img.classList.add("lazyloaded");
        observer.observe(img);
      });
    }

  });


  


}

const marqueeText = () => {
    const track = document.getElementById("marquee-track");
  if (!track) return;

  // ✅ STEP 1: Convert comma text → elements
  let rawText = track.innerText.trim();

  let items = rawText
    .split(",")
    .map(i => i.trim())
    .filter(Boolean);

  track.innerHTML = items.map(text => `
    <span class="marquee-item text-3xl lg:text-4xl xl:text-5xl text-heading font-heading font-bold">
      ${text}
    </span>

    <svg class="marquee-item w-8 h-8 lg:w-12 lg:h-12 text-accent shrink-0"  viewBox="0 0 20 20" fill="none">
          <path d="M9.98438 1.49219C10.4404 1.49236 10.8499 1.74634 11.0518 2.15527L12.6699 5.43457C12.6871 5.46944 12.7204 5.49342 12.7588 5.49902L16.3779 6.02539C16.8292 6.09106 17.1978 6.40134 17.3389 6.83496C17.4798 7.26888 17.3638 7.73718 17.0371 8.05566L14.4189 10.6084C14.3912 10.6355 14.3783 10.6746 14.3848 10.7129L15.0029 14.3174C15.08 14.767 14.8983 15.2133 14.5293 15.4814C14.3211 15.6328 14.0771 15.7099 13.8311 15.71C13.6415 15.71 13.4508 15.6645 13.2754 15.5723L10.0391 13.8711C10.0046 13.853 9.96313 13.853 9.92871 13.8711L6.69238 15.5723C6.28859 15.7845 5.80761 15.7497 5.43848 15.4814C5.06942 15.2133 4.88784 14.767 4.96484 14.3174L5.58301 10.7129C5.58627 10.6937 5.58496 10.6742 5.5791 10.6562L5.54883 10.6084L2.93066 8.05566C2.6039 7.73718 2.48787 7.2689 2.62891 6.83496C2.76998 6.40136 3.13862 6.09109 3.58984 6.02539L7.20898 5.49902C7.24741 5.49339 7.28061 5.46945 7.29785 5.43457L8.91602 2.15527C9.11794 1.74619 9.52815 1.49219 9.98438 1.49219ZM9.98438 2.56445C9.95863 2.56445 9.90704 2.57111 9.87793 2.62988L8.25977 5.90918C8.08629 6.26068 7.75109 6.50417 7.36328 6.56055L3.74414 7.08691C3.67943 7.09649 3.6573 7.14264 3.64941 7.16699C3.64148 7.19134 3.63178 7.24218 3.67871 7.28809L6.29785 9.84082C6.57835 10.1144 6.70588 10.5084 6.63965 10.8945L6.02148 14.498C6.01039 14.5627 6.04755 14.5991 6.06836 14.6143C6.08922 14.6294 6.13515 14.6536 6.19336 14.623L9.42969 12.9209C9.60309 12.8298 9.79406 12.7842 9.98438 12.7842C10.1745 12.7842 10.3648 12.8299 10.5381 12.9209L13.7744 14.623C13.8324 14.6536 13.8783 14.6295 13.8994 14.6143C13.9202 14.5992 13.9574 14.5628 13.9463 14.498L13.3281 10.8945C13.2619 10.5084 13.3895 10.1144 13.6699 9.84082L16.2891 7.28809C16.3361 7.24225 16.3263 7.19155 16.3184 7.16699C16.3104 7.14249 16.2884 7.09641 16.2236 7.08691L12.6045 6.56055C12.2167 6.50413 11.8814 6.26064 11.708 5.90918L10.0898 2.62988C10.0608 2.57144 10.0102 2.56452 9.98438 2.56445Z" fill="currentColor" stroke="currentColor" stroke-width="0.2"/>
          <path d="M14.3906 2.23633C14.5647 1.99685 14.9 1.94321 15.1396 2.11719C15.3793 2.29127 15.4319 2.62758 15.2578 2.86719L14.7949 3.50391C14.69 3.64835 14.5259 3.72559 14.3604 3.72559C14.2786 3.72552 14.1962 3.70634 14.1201 3.66797L14.0459 3.62305C13.8063 3.44897 13.7537 3.11361 13.9277 2.87402L14.3906 2.23633Z" fill="currentColor" stroke="currentColor" stroke-width="0.2"/>
          <path d="M4.9209 2.06055C5.14798 1.95749 5.42389 2.02481 5.57617 2.23438L6.03906 2.87207C6.21304 3.11168 6.16046 3.44708 5.9209 3.62109C5.82585 3.69018 5.71478 3.72363 5.60547 3.72363C5.44004 3.72352 5.27679 3.64637 5.17188 3.50195L4.70801 2.86426C4.5344 2.6247 4.58774 2.28918 4.82715 2.11523L4.9209 2.06055Z" fill="currentColor" stroke="currentColor" stroke-width="0.2"/>
          <path d="M2.73438 11.0049C3.016 10.9134 3.31854 11.0672 3.41016 11.3486C3.50166 11.6303 3.34798 11.9328 3.06641 12.0244L2.31738 12.2676C2.26258 12.2854 2.20637 12.2939 2.15137 12.2939C1.92551 12.2939 1.71533 12.1505 1.6416 11.9238C1.5501 11.6423 1.70373 11.3396 1.98535 11.248L2.73438 11.0049Z" fill="currentColor" stroke="currentColor" stroke-width="0.2"/>
          <path d="M9.98438 16.123C10.2805 16.1232 10.5205 16.3631 10.5205 16.6592V17.4473C10.5203 17.7431 10.2803 17.9833 9.98438 17.9834C9.68836 17.9834 9.44848 17.7432 9.44824 17.4473V16.6592C9.44824 16.363 9.68821 16.123 9.98438 16.123Z" fill="currentColor" stroke="currentColor" stroke-width="0.2"/>
          <path d="M16.5576 11.3486C16.6492 11.0671 16.9519 10.9135 17.2334 11.0049L17.9824 11.248C18.264 11.3396 18.4177 11.6422 18.3262 11.9238C18.2524 12.1505 18.0423 12.2939 17.8164 12.2939C17.7614 12.2939 17.7052 12.2854 17.6504 12.2676L16.9014 12.0244C16.6198 11.9328 16.4661 11.6303 16.5576 11.3486Z" fill="currentColor" stroke="currentColor" stroke-width="0.2"/>
        </svg>
  `).join("");

  // ✅ STEP 2: Call your existing duplication logic
  marqueeTextDuplicate();
}

const marqueeTextDuplicate = () => {
  const marquees = document.querySelectorAll('.animate-marquee-scroll');
  if (marquees.length) {
    marquees.forEach((marquee) => {
      if (!marquee) return;
      if (marquee.dataset.duplicated === "true") return;
      const originalContent = marquee.innerHTML;
      const viewportWidth = window.innerWidth;
      let contentWidth = marquee.scrollWidth;
      let count = 0;
      const MAX_DUPLICATE = 3;
      while (contentWidth < viewportWidth * 1.5 && count < MAX_DUPLICATE) {
        marquee.insertAdjacentHTML('beforeend', originalContent);
        contentWidth = marquee.scrollWidth;
        count++;
      }
      marquee.dataset.duplicated = "true";
    });
  }
}