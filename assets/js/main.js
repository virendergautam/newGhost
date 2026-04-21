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
    threads: ["threads.net","threads.com"],
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
        return `<svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <path d="M6.32715 2.90039L6.35742 2.94238L9.12402 6.88281L12.5957 2.93359L12.625 2.90039H13.8623L13.7158 3.06641L9.67285 7.66406L14.082 13.9424L14.1924 14.0996H10.6729L10.6426 14.0576L7.71582 9.88965L4.0459 14.0664L4.01562 14.0996H2.7793L2.9248 13.9336L7.16699 9.1084L2.91797 3.05762L2.80762 2.90039H6.32715ZM7.86328 8.50195L8.29883 9.11133L11.2314 13.2178H12.4766L8.95801 8.29297L8.52246 7.68359L5.75977 3.81543H4.51465L7.86328 8.50195Z" fill="currentColor" stroke="currentColor" stroke-width="0.2"/>
        </svg>`;
      case "facebook":
        return `<svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <path d="M10.124 15.1089V9.07811H12.3971L12.7381 6.72709H10.124V5.2263C10.124 4.54584 10.3354 4.08211 11.4328 4.08211L12.8302 4.0816V1.97877C12.5885 1.95081 11.759 1.88672 10.7935 1.88672C8.77744 1.88672 7.39721 2.98216 7.39721 4.99346V6.72709H5.11719V9.07811H7.39721V15.1089H10.124Z" fill="currentColor"/>
        </svg>`;
      case "instagram":
        return `<svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <path d="M14.967 5.82205C14.9365 5.13131 14.8248 4.65643 14.6647 4.24494C14.4996 3.80815 14.2456 3.4171 13.9128 3.09201C13.5877 2.76187 13.194 2.50533 12.7622 2.34284C12.3482 2.18283 11.8757 2.07113 11.1849 2.04067C10.4888 2.00764 10.2679 2 8.50253 2C6.73719 2 6.51623 2.00764 5.82278 2.03809C5.1319 2.06855 4.65693 2.18035 4.24546 2.34026C3.8085 2.50533 3.41737 2.75929 3.09222 3.09201C2.76202 3.4171 2.50553 3.81073 2.34291 4.24246C2.18286 4.65643 2.07114 5.12873 2.04068 5.81947C2.00764 6.51537 2 6.73629 2 8.50129C2 10.2663 2.00764 10.4872 2.0381 11.1805C2.06856 11.8713 2.18038 12.3462 2.34043 12.7576C2.50553 13.1944 2.76202 13.5855 3.09222 13.9106C3.41737 14.2407 3.81108 14.4972 4.24288 14.6597C4.65693 14.8198 5.12932 14.9315 5.8203 14.9619C6.51365 14.9925 6.73471 15 8.50005 15C10.2654 15 10.4863 14.9925 11.1798 14.9619C11.8707 14.9315 12.3456 14.8198 12.7571 14.6597C13.631 14.322 14.3218 13.6312 14.6597 12.7576C14.8196 12.3437 14.9314 11.8713 14.9619 11.1805C14.9924 10.4872 15 10.2663 15 8.50129C15 6.73629 14.9974 6.51537 14.967 5.82205ZM13.7961 11.1297C13.7681 11.7646 13.6614 12.1075 13.5725 12.336C13.354 12.9024 12.9045 13.3519 12.338 13.5703C12.1094 13.6592 11.764 13.7658 11.1315 13.7937C10.4457 13.8243 10.24 13.8318 8.50511 13.8318C6.77024 13.8318 6.56197 13.8243 5.87864 13.7937C5.24363 13.7658 4.90072 13.6592 4.67211 13.5703C4.39023 13.4661 4.13364 13.3011 3.92538 13.0852C3.70947 12.8744 3.54437 12.6204 3.44019 12.3386C3.35129 12.1101 3.24462 11.7646 3.21674 11.1323C3.18618 10.4466 3.17864 10.2409 3.17864 8.50635C3.17864 6.77181 3.18618 6.56358 3.21674 5.88048C3.24462 5.24559 3.35129 4.90274 3.44019 4.67418C3.54437 4.39225 3.70947 4.13581 3.92796 3.92749C4.1387 3.71163 4.39271 3.54656 4.67469 3.44249C4.9033 3.35361 5.24878 3.24697 5.88122 3.21899C6.56703 3.18854 6.77282 3.1809 8.50759 3.1809C10.245 3.1809 10.4507 3.18854 11.1341 3.21899C11.7691 3.24697 12.112 3.35361 12.3406 3.44249C12.6225 3.54656 12.8791 3.71163 13.0873 3.92749C13.3032 4.1383 13.4683 4.39225 13.5725 4.67418C13.6614 4.90274 13.7681 5.24807 13.7961 5.88048C13.8265 6.56616 13.8342 6.77181 13.8342 8.50635C13.8342 10.2409 13.8265 10.4441 13.7961 11.1297Z" fill="currentColor"/>
        <path d="M8.5 5C6.56774 5 5 6.56764 5 8.5C5 10.4324 6.56774 12 8.5 12C10.4324 12 12 10.4324 12 8.5C12 6.56764 10.4324 5 8.5 5ZM8.5 10.7704C7.24645 10.7704 6.22964 9.75365 6.22964 8.5C6.22964 7.24635 7.24645 6.22964 8.5 6.22964C9.75365 6.22964 10.7704 7.24635 10.7704 8.5C10.7704 9.75365 9.75365 10.7704 8.5 10.7704Z" fill="currentColor"/>
        <path d="M13 5C13 5.55223 12.5523 6 11.9999 6C11.4477 6 11 5.55223 11 5C11 4.44764 11.4477 4 11.9999 4C12.5523 4 13 4.44764 13 5Z" fill="currentColor"/>
        </svg>`;
      case "github":
        return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M1.50006 13.6678C1.95006 13.7218 2.28339 13.9278 2.50006 14.2858C2.82606 14.8228 4.03706 16.8118 5.41306 16.8118H7.50006M13.1721 13.2988C13.7207 14.0175 13.9951 14.6628 13.9951 15.2348V18.9998M8.37006 13.3908C7.79006 14.0268 7.50039 14.6312 7.50106 15.2038V18.9998" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M13.172 13.2991C14.374 13.0491 15.465 12.6171 16.312 11.9831C17.76 10.8991 18.5 9.22508 18.5 7.57209C18.5 6.41209 18.06 5.32909 17.296 4.41209C16.871 3.90109 18.115 0.540092 17.01 1.05309C15.905 1.56709 14.285 2.25109 13.436 2.00009C12.527 1.73209 11.536 1.58409 10.5 1.58409C9.59999 1.58409 8.73399 1.69509 7.92599 1.90109C6.752 2.19909 5.63 1.53809 4.5 1.05309C3.37 0.569092 3.987 4.06109 3.651 4.47509C2.921 5.38009 2.5 6.44009 2.5 7.57209C2.5 9.22508 3.395 10.8991 4.843 11.9821C5.808 12.7041 7.017 13.1651 8.36999 13.3921" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
      case "tiktok":
        return `<svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <path d="M14.2713 5.18474C13.5193 5.18474 12.8254 4.93562 12.2683 4.51537C11.6293 4.0336 11.1702 3.32691 11.008 2.51239C10.9679 2.31114 10.9463 2.10346 10.9442 1.89062H8.79607V7.76033L8.7935 10.9754C8.7935 11.835 8.23375 12.5638 7.45783 12.8201C7.23265 12.8945 6.98945 12.9298 6.73622 12.9159C6.41298 12.8981 6.11008 12.8006 5.84681 12.6431C5.28655 12.308 4.90669 11.7001 4.8964 11.0048C4.88019 9.91798 5.75879 9.03191 6.84482 9.03191C7.0592 9.03191 7.26508 9.06691 7.45783 9.13048V7.52614V6.94941C7.25453 6.9193 7.04761 6.9036 6.83839 6.9036C5.64967 6.9036 4.53791 7.39772 3.7432 8.2879C3.14254 8.96062 2.78225 9.8189 2.72666 10.7189C2.65383 11.9011 3.08644 13.025 3.92541 13.8542C4.04868 13.9759 4.17813 14.0889 4.3135 14.1931C5.0328 14.7467 5.91217 15.0468 6.83839 15.0468C7.04761 15.0468 7.25453 15.0313 7.45783 15.0012C8.32306 14.873 9.12136 14.477 9.75136 13.8542C10.5255 13.0891 10.9532 12.0733 10.9578 10.9922L10.9468 6.19099C11.3161 6.47588 11.7199 6.71162 12.1532 6.8946C12.8272 7.17897 13.5419 7.32309 14.2774 7.32283V5.76301V5.18423C14.2779 5.18474 14.2718 5.18474 14.2713 5.18474Z" fill="currentColor"/>
        </svg>
`;
      case "linkedin":
        return `<svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <path d="M14.51 14.9989V10.2383C14.51 7.8986 14.0064 6.11133 11.2767 6.11133C9.96062 6.11133 9.08324 6.82624 8.72578 7.50865H8.69329V6.32255H6.10986V14.9989H8.80702V10.6932C8.80702 9.55589 9.01824 8.46728 10.4156 8.46728C11.7966 8.46728 11.8129 9.75087 11.8129 10.7582V14.9827H14.51V14.9989Z" fill="currentColor"/>
        <path d="M2.21143 6.32031H4.90858V14.9967H2.21143V6.32031Z" fill="currentColor"/>
        <path d="M3.5598 2C2.69866 2 2 2.69866 2 3.5598C2 4.42094 2.69866 5.13585 3.5598 5.13585C4.42094 5.13585 5.1196 4.42094 5.1196 3.5598C5.1196 2.69866 4.42094 2 3.5598 2Z" fill="currentColor"/>
        </svg>`;
      case "dribbble":
        return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M18.3333 10.0003C18.3347 11.098 18.1185 12.185 17.6974 13.1986C17.2762 14.2122 16.6584 15.1323 15.8796 15.9057C15.1071 16.6768 14.1902 17.2881 13.1814 17.7047C12.1725 18.1213 11.0915 18.335 10 18.3337C5.3975 18.3337 1.66666 14.6028 1.66666 10.0003C1.66366 7.86355 2.48445 5.80785 3.95833 4.26075C4.73593 3.44011 5.67283 2.78679 6.71168 2.34081C7.75052 1.89482 8.86946 1.66554 10 1.667C11.0915 1.66565 12.1725 1.87938 13.1814 2.29597C14.1902 2.71257 15.1071 3.32386 15.8796 4.09492C16.6584 4.86837 17.2762 5.78848 17.6974 6.80209C18.1185 7.8157 18.3347 8.90271 18.3333 10.0003Z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M18.3333 9.99998C17.1175 9.99998 13.7633 9.54165 10.7613 10.8596C7.50001 12.2916 5.13876 14.5133 4.10959 15.8946" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M6.875 2.27246C8.17917 3.47621 11.025 6.54079 12.0833 9.58329C13.1417 12.6258 13.5333 16.3666 13.775 17.4312" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M1.73083 8.95879C3.305 9.05379 7.47209 9.13921 10.1388 8.00046C12.8054 6.86171 15.1 4.76712 15.8871 4.10254M2.29167 13.1725C3.02608 14.9499 4.35038 16.42 6.04167 17.3355" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M1.66666 10.0003C1.66366 7.86355 2.48445 5.80785 3.95833 4.26075C4.73593 3.44011 5.67283 2.78679 6.71168 2.34081C7.75052 1.89482 8.86946 1.66554 10 1.667M13.3333 2.36033C14.2825 2.77524 15.146 3.36349 15.8796 4.09492C16.6584 4.86837 17.2762 5.78848 17.6974 6.80209C18.1185 7.8157 18.3347 8.90271 18.3333 10.0003C18.3333 11.0262 18.1479 12.0091 17.8083 12.917M10 18.3337C11.0915 18.335 12.1725 18.1213 13.1814 17.7047C14.1902 17.2881 15.1071 16.6768 15.8796 15.9057" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
      case "whatsapp":
        return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M18.2955 6.17869C17.8405 5.16803 17.1875 4.26066 16.3583 3.47869C15.5291 2.7041 14.5679 2.0918 13.4965 1.66393C12.3885 1.22131 11.2144 1 10.0037 1C8.79293 1 7.61887 1.22131 6.51085 1.66393C5.43952 2.0918 4.47825 2.69672 3.64907 3.47869C2.81989 4.26066 2.16683 5.16803 1.71188 6.17869C1.24226 7.22623 1.00009 8.34754 1.00009 9.49836C1.00009 11.5123 1.74855 13.4451 3.12073 14.9795L2.50009 18.5L6.29071 17.2516C7.45743 17.7533 8.69753 18.0041 9.99634 18.0041C11.2071 18.0041 12.3812 17.7828 13.4892 17.3402C14.5605 16.9123 15.5218 16.3074 16.3509 15.5254C17.1801 14.7434 17.8332 13.8361 18.2881 12.8254C18.7578 11.7779 18.9999 10.6566 18.9999 9.50574C19.0073 8.34754 18.7651 7.23361 18.2955 6.17869Z" stroke="currentColor" stroke-width="1.3"/>
        <path d="M14.079 11.272C13.6989 11.0845 13.4211 10.9692 13.2237 10.897C13.0994 10.8538 12.807 10.724 12.7047 10.8033C12.383 11.0629 12.3145 11.6686 11.807 11.6686C10.7835 11.6686 10.5001 11.5 9.50012 10.5C8.50012 9.5 8.53908 9.38433 8.50012 9C8.47819 8.78367 8.69115 8.75535 8.77887 8.58949C9.23213 8.08471 8.88855 7.76743 8.83006 7.5583C8.72771 7.34197 8.55227 6.95257 8.39875 6.63528C8.26716 6.42616 8.23789 6.11608 8.00395 6.0007C7.00971 5.49593 6.43952 6.50548 6.20558 7.03189C4.79465 10.3851 13.2749 16.7669 15.0002 12.3681C15.0879 11.9859 15.0513 11.8417 14.9197 11.6686C14.6566 11.4884 14.3495 11.409 14.079 11.272Z" stroke="currentColor" stroke-width="1.3"/>
        </svg>`;
      case "pinterest":
        return `<svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <path d="M8.65039 2.9502C11.1152 2.9502 13.042 4.6146 13.0498 6.85059C13.0498 9.16884 11.5013 11.0498 9.3457 11.0498C8.98127 11.0498 8.62801 10.9607 8.33594 10.8184C8.08743 10.6972 7.88059 10.5357 7.74902 10.3545C7.74124 10.3826 7.73287 10.4162 7.72266 10.4531C7.68831 10.5773 7.64211 10.7462 7.59277 10.9248C7.49393 11.2826 7.38372 11.6799 7.34082 11.8369C7.22094 12.2747 6.94905 12.7932 6.7002 13.2109C6.45086 13.6294 6.22124 13.9525 6.18555 13.999C6.15241 14.0417 6.1021 14.0581 6.05566 14.0459C6.00997 14.0338 5.97391 13.9958 5.96387 13.9443V13.9434C5.95303 13.8812 5.88531 13.4907 5.84766 13.0049C5.81011 12.5204 5.80266 11.9353 5.91406 11.4854C5.97879 11.2244 6.18472 10.3955 6.375 9.63184C6.47012 9.25011 6.56159 8.88433 6.62891 8.61426C6.66257 8.47921 6.68969 8.36746 6.70898 8.29004C6.71863 8.25136 6.72632 8.22078 6.73145 8.2002C6.73283 8.19465 6.73335 8.18965 6.73438 8.18555V8.18457C6.72832 8.17187 6.71916 8.15294 6.70898 8.12891C6.68867 8.0809 6.66156 8.01119 6.63477 7.92285C6.58103 7.74566 6.52734 7.49259 6.52734 7.19141C6.52754 6.24579 7.11119 5.51982 7.85254 5.51953C8.16349 5.51953 8.4004 5.63117 8.55859 5.81348C8.71589 5.99504 8.79199 6.24299 8.79199 6.50879C8.79192 6.80386 8.69244 7.16732 8.57129 7.55078C8.47962 7.84094 8.37506 8.1435 8.28711 8.44336L8.20605 8.74121C8.12839 9.05839 8.21184 9.343 8.39551 9.54883C8.57998 9.75537 8.86824 9.88477 9.20117 9.88477C10.4102 9.88466 11.3623 8.67403 11.3623 6.88184C11.3623 6.09655 11.065 5.43174 10.5566 4.96289C10.048 4.49379 9.32532 4.2178 8.4707 4.21777C6.49636 4.21777 5.34277 5.62316 5.34277 7.06445C5.3429 7.62691 5.57111 8.22634 5.85449 8.55176L5.89355 8.60742C5.90394 8.62671 5.91139 8.64646 5.91602 8.66699C5.92514 8.70773 5.92207 8.74776 5.91211 8.78711V8.78809C5.85685 8.99744 5.74176 9.4421 5.71387 9.54199L5.71484 9.54297C5.69839 9.61097 5.66588 9.66854 5.60449 9.69141C5.57546 9.70214 5.54361 9.70346 5.51074 9.69824L5.40918 9.66602C4.95564 9.46674 4.59143 9.05519 4.34082 8.57422C4.08993 8.09259 3.9502 7.53516 3.9502 7.03809C3.95032 5.97207 4.35895 4.94949 5.15234 4.19336C5.94607 3.43696 7.12158 2.95024 8.65039 2.9502Z" fill="currentColor" stroke="currentColor" stroke-width="0.1"/>
        </svg>`;
      case "tumblr":
        return `<svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <path d="M6.90876 7.50772H6.00216C6.00216 7.44852 6.00216 6.51822 6.00216 6.07844C5.98965 5.99387 6.03342 5.92621 6.08344 5.9093C7.12759 5.49489 7.64029 3.38903 7.64029 3.13532C7.64029 3.04229 7.68406 3 7.75284 3H8.72196C8.80324 3 8.81575 3.04229 8.81575 3.13532V5.78244H10.7415V7.50772H8.82825C8.82825 7.53309 8.80949 11.2289 8.82825 11.3896C8.85951 11.6518 8.97831 11.8717 9.15338 11.9985C9.45975 12.2438 9.78487 12.2607 10.1225 12.1761C10.4101 12.1085 10.9666 11.7194 10.9978 11.6941V13.2925C11.0103 13.3771 10.9666 13.4447 10.9166 13.4616C10.2851 13.876 9.59105 14.0536 8.89078 13.986C8.29054 13.9268 7.74033 13.6984 7.29016 13.0895C7.06507 12.7766 6.89 12.4298 6.89 11.9562L6.90876 7.50772Z" fill="currentColor"/>
        </svg>`;
      case "discord":
        return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M15.5 17.5L16.5 19.5C16.5 19.5 20.67 18.17 22 16C22 15 22.53 7.85 19 5.5C17.5 4.5 15 4 15 4L14 6H12H9.99997L9.02997 4C9.02997 4 6.52997 4.5 5.02997 5.5C1.49997 7.85 2.02997 15 2.02997 16C3.35997 18.17 7.52997 19.5 7.52997 19.5L8.52997 17.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M5.5 16C10.5 18.5 13.5 18.5 18.5 16" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M9 13.5C9.82843 13.5 10.5 12.8284 10.5 12C10.5 11.1716 9.82843 10.5 9 10.5C8.17157 10.5 7.5 11.1716 7.5 12C7.5 12.8284 8.17157 13.5 9 13.5Z" fill="currentColor"/>
        <path d="M15 13.5C15.8284 13.5 16.5 12.8284 16.5 12C16.5 11.1716 15.8284 10.5 15 10.5C14.1716 10.5 13.5 11.1716 13.5 12C13.5 12.8284 14.1716 13.5 15 13.5Z" fill="currentColor"/>
        </svg>`;
      case "mastodon":
        return `<svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <path d="M2 7.88095C2 14.8143 5.5438 15 7.85 15C10.1562 15 10.5767 14.6218 11.1 14.415V13.4524C8.5 14.0467 5.575 13.8492 5.575 11.9048H8.825C10.45 11.9048 15 12.0286 15 7.88095C15 2.14052 11.6284 2 8.5 2C5.37155 2 2 2.16529 2 7.88095Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
        <path d="M5 10V5.83333C5 5.3471 5.18437 4.88079 5.51256 4.53697C5.84075 4.19315 6.28587 4 6.75 4C7.21413 4 7.65925 4.19315 7.98744 4.53697C8.31563 4.88079 8.5 5.3471 8.5 5.83333M8.5 5.83333V8.33333M8.5 5.83333C8.5 5.3471 8.68437 4.88079 9.01256 4.53697C9.34075 4.19315 9.78587 4 10.25 4C10.7141 4 11.1592 4.19315 11.4874 4.53697C11.8156 4.88079 12 5.3471 12 5.83333V10" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
        </svg>`;
      case "bluesky":
        return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M18.9959 3.68713C19.0621 2.70231 18.3198 1.79582 17.3401 2.04035C13.76 2.93156 10.8726 7.76872 10 9.44798C9.12833 7.76872 6.23995 2.93156 2.65988 2.04035C1.68023 1.79678 0.937946 2.70231 1.0041 3.68713L1.29595 7.95308C1.44285 10.1309 3.35449 11.7873 5.5862 11.6727L6.0629 11.6383C6.02495 11.645 3.23775 12.1331 2.76495 13.5305C2.12482 15.4247 4.01019 16.7859 4.01019 16.7859C4.03159 16.8088 5.85276 18.788 7.67295 17.6446C9.09623 16.9664 10.001 13.8142 10.001 13.8142C10.001 13.8142 10.9047 16.9664 12.328 17.6446C14.157 18.7937 15.9879 16.7887 15.9898 16.7849C16.0054 16.7754 17.8723 15.418 17.2351 13.5305C16.7584 12.1235 13.9361 11.6392 13.9361 11.6392L14.4157 11.6727C16.6465 11.7873 18.5581 10.13 18.706 7.95308L18.9959 3.68713Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
        </svg>`;
      case "threads":
        return `<svg class="icon" viewBox="0 0 24 24" fill="none">
        <path d="M17.5609 11.1236C17.4575 11.074 17.3526 11.0263 17.2462 10.9806C17.0611 7.56727 15.1967 5.61312 12.0661 5.59312C12.0519 5.59304 12.0379 5.59304 12.0237 5.59304C10.1512 5.59304 8.59388 6.39262 7.63537 7.84759L9.35708 9.0291C10.0732 7.94229 11.1969 7.7106 12.0245 7.7106C12.034 7.7106 12.0436 7.7106 12.0531 7.71068C13.0839 7.71726 13.8618 8.01708 14.3652 8.60175C14.7315 9.02742 14.9765 9.61563 15.0978 10.3579C14.1839 10.2026 13.1956 10.1548 12.139 10.2155C9.16261 10.387 7.24916 12.1235 7.37767 14.5365C7.44288 15.7605 8.05242 16.8135 9.09393 17.5014C9.97446 18.0829 11.1087 18.3673 12.2874 18.3029C13.844 18.2175 15.0652 17.6234 15.9171 16.5371C16.564 15.712 16.9732 14.6429 17.154 13.2958C17.8957 13.7436 18.4455 14.333 18.7492 15.0414C19.2655 16.2459 19.2956 18.225 17.6814 19.8385C16.267 21.2521 14.5669 21.8635 11.9976 21.8824C9.14756 21.8613 6.9921 20.9468 5.59068 19.1646C4.27836 17.4958 3.60015 15.0852 3.57484 12C3.60015 8.91472 4.27836 6.5042 5.59068 4.83533C6.9921 3.05312 9.14752 2.13875 11.9976 2.11756C14.8684 2.13891 17.0614 3.05767 18.5164 4.8485C19.2299 5.7267 19.7677 6.8311 20.1224 8.11879L22.14 7.58028C21.7102 5.99527 21.0338 4.62946 20.1135 3.49675C18.248 1.20083 15.5199 0.024398 12.0046 0H11.9906C8.48249 0.0243044 5.78485 1.20522 3.97257 3.50991C2.3599 5.5608 1.52804 8.41446 1.50008 11.9916L1.5 12L1.50008 12.0084C1.52804 15.5855 2.3599 18.4393 3.97257 20.4901C5.78485 22.7947 8.48249 23.9758 11.9906 24H12.0046C15.1235 23.9783 17.3219 23.1615 19.1329 21.3513C21.5024 18.9833 21.431 16.0149 20.6501 14.1927C20.0898 12.8859 19.0216 11.8245 17.5609 11.1236ZM12.1759 16.1884C10.8715 16.2619 9.51623 15.6761 9.44937 14.4215C9.39984 13.4913 10.1111 12.4533 12.256 12.3296C12.5016 12.3154 12.7427 12.3085 12.9794 12.3085C13.7585 12.3085 14.4874 12.3842 15.1499 12.5292C14.9028 15.6169 13.4532 16.1183 12.1759 16.1884Z" fill="currentColor"/>
        </svg>`;
      default:
        return `<svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <path d="M9.20147 5.92796L10.1368 6.86324C11.9447 8.6712 11.9447 11.6023 10.1368 13.4103L9.90295 13.644C8.09502 15.452 5.16383 15.452 3.35592 13.644C1.54803 11.8362 1.54803 8.90494 3.35592 7.09707L4.29122 8.03239C2.99986 9.32374 2.99986 11.4174 4.29122 12.7087C5.58257 14.0001 7.67625 14.0001 8.96767 12.7087L9.20147 12.475C10.4928 11.1836 10.4928 9.08987 9.20147 7.79853L8.26617 6.86324L9.20147 5.92796ZM13.644 9.90295L12.7087 8.96767C14.0001 7.67625 14.0001 5.58257 12.7087 4.29122C11.4174 2.99986 9.32374 2.99986 8.03239 4.29122L7.79853 4.52503C6.50718 5.81639 6.50718 7.9101 7.79853 9.20147L8.7338 10.1368L7.79853 11.072L6.86324 10.1368C5.05534 8.32885 5.05534 5.39766 6.86324 3.58976L7.09707 3.35592C8.90494 1.54803 11.8362 1.54803 13.644 3.35592C15.452 5.16383 15.452 8.09502 13.644 9.90295Z" fill="currentColor"/>
        </svg>`;
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
  const marquees = document.querySelectorAll('.animate-marquee-scroll');
  if (marquees.length) {
    console.warn('Marquee animation skipped: no marquee-items-scroll found.');

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