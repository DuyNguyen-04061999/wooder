window.addEventListener("load", function () {
  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);

  const slidesWrapper = $(".banner__slides-wrapper");

  const paginNum = $(".banner__pagination-num");
  const header = $(".header");
  const banner = $(".banner");
  const processLine = $(".header__process");
  const navTitles = $$(".header__menu li");
  const navSections = $$(".nav");
  const backTopBtn = $(".footer__btn");
  const backToTopBody = $(".back-to-top");

  // ================ banner ================
  const dotBox = $(".dot-box");
  let dots = $$(".dot");
  const prevBtn = $(".--prev");
  const nextBtn = $(".--next");
  function handleSetPaginNum() {
    const index = flkty.selectedIndex + 1;
    paginNum.innerText = index.toString().padStart(2, "0");
  }

  let flkty = new Flickity(".banner__slides-wrapper", {
    pageDots: false,
    draggable: true,
    prevNextButtons: false,
    wrapAround: true,
    on: {
      change: function (index) {
        dots.forEach((dot) => dot.classList.remove("active"));
        dots[index].classList.add("active");
        handleSetPaginNum();
      },
    },
  });
  handleSetPaginNum();

  dots = fizzyUIUtils.makeArray(dots);

  dotBox.addEventListener("click", function (event) {
    // filter for button clicks
    if (!matchesSelector(event.target, ".dot")) {
      return;
    }
    let index = dots.indexOf(event.target);
    flkty.select(index);
  });
  slidesWrapper.dataset.flickity = '{ "selectedAttraction": 0.02 }';
  prevBtn.addEventListener("click", function () {
    flkty.previous();
  });
  nextBtn.addEventListener("click", function () {
    flkty.next();
  });

  // ========================== end banner ===================
  // ================== slider =====================
  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";
  $(".progress-wrap").appendChild(progressBar);

  function handleLineLoading() {
    if (progressBar.offsetWidth === 0) {
      setTimeout(() => {
        $(".progress-loading").style.animation =
          "lineLoading 2s forwards infinite ease-in-out";
      }, 500);
    } else {
      $(".progress-loading").style.animation = "";
    }
  }
  let flktySlider = new Flickity(".slider__carousel", {
    prevNextButtons: false,
    pageDots: true,
    freeScroll: true,
    imagesLoaded: true,
    initialIndex: 0,
    cellAlign: "left",
    freeScroll: true,
    fullscreen: true,
  });
  flktySlider.on("scroll", function (progress) {
    progress = Math.max(0, Math.min(1, progress));
    progressBar.style.width = progress * 100 + "%";
    handleLineLoading();
  });
  handleLineLoading();
  const galleryImgs = $$(".gallery__libs-img");

  galleryImgs.forEach((imgWrap) => {
    imgWrap.dataset.fancybox = "gallery";
    const img = imgWrap.querySelector("img");
    imgWrap.dataset.src = img.src;
  });
  Fancybox.bind('[data-fancybox="gallery"]', {
    Thumbs: {
      Carousel: {
        fill: false,
        center: true,
      },
    },
  });
  // ======================scrollNav======================
  window.addEventListener("scroll", (e) => {
    const headerHeight = header.offsetHeight;
    const processLineHeight = window.innerHeight;
    const lengthToScroll = document.documentElement.scrollHeight;
    const lengthMustScroll = lengthToScroll - processLineHeight;

    const scrollY = window.scrollY;
    if (scrollY >= banner.offsetHeight - headerHeight) {
      header.classList.add("active");
    } else {
      header.classList.remove("active");
    }

    if (scrollY >= window.innerHeight) {
      backToTopBody.classList.add("active");
    } else {
      backToTopBody.classList.remove("active");
    }

    processLine.style.width = `${(scrollY / lengthMustScroll) * 100}%`;

    navTitles.forEach((title) => {
      title.classList.remove("active");
    });

    navSections.forEach((section, idSection) => {
      const sectionTop = section.offsetTop - headerHeight - 1;
      if (
        scrollY >= sectionTop &&
        scrollY < sectionTop + section.offsetHeight
      ) {
        navTitles.forEach((title, idTitle) => {
          title.classList.remove("active");
          idTitle === idSection && title.classList.add("active");
        });
      }
    });
  });

  navTitles.forEach((title, idTitle) => {
    const headerHeight = header.offsetHeight;
    title.onclick = (e) => {
      navSections.forEach((section, idSection) => {
        const sectionTop =
          window.scrollY + section.getBoundingClientRect().top - headerHeight;
        if (idTitle === idSection) {
          document.documentElement.scrollTo(0, sectionTop);
        }
      });
    };
  });

  function handleBackToTop() {
    document.documentElement.scrollTo(0, 0);
  }

  backTopBtn.onclick = handleBackToTop;
  function handleResetWindow() {
    // reset window
    history.scrollRestoration = "manual";
    document.documentElement.onbeforeunload = handleBackToTop;
  }
  handleResetWindow();
  backToTopBody.onclick = handleBackToTop;

  // responsive
  const hamburger = $(".hamburger");
  const headerMenu = $(".header__menu");

  function regulateMenuHeight(height) {
    headerMenu.style.height = `${height}px`;
  }

  function setInitialMenuHeight() {
    if (headerMenu.classList.contains("active")) {
      headerMenu.classList.remove("active");
      hamburger.classList.remove("active");
      regulateMenuHeight(0);
    }
  }
  window.addEventListener("resize", setInitialMenuHeight);
  document.addEventListener("click", (e) => {
    if (e.target.matches(".hamburger")) {
      e.target.classList.toggle("active");
      headerMenu.classList.toggle("active");
      if (headerMenu.classList.contains("active")) {
        regulateMenuHeight(window.innerHeight);
      } else {
        regulateMenuHeight(0);
      }
    } else if (e.target.matches(".header__menu")) {
      e.stopPropagation();
    } else {
      setInitialMenuHeight();
    }
  });

  // click lang
  const headerLang = $(".header__lang-main");
  const langMain = $(".header__lang-main .text");
  const langOptions = $$(".header__lang-sub li a");

  headerLang.onclick = function (e) {
    e.stopPropagation();
    this.classList.toggle("active");
  };

  langOptions.forEach((lang) => {
    lang.addEventListener("click", function (e) {
      e.preventDefault();
      let langText = this.innerText;
      this.innerText = langMain.innerText;
      langMain.innerText = langText;
    });
  });

  // category
  const categories = $$(".new__category li");
  const newsContent = $(".news__content");
  const data = {
    category_1: {
      img: ["./img/news-1.jpg", "./img/news-2.jpg", "./img/news-3.jpg"],
      title: [
        "WHERE DOES IT COME FROM?",
        "THERE ARE MANY VARIATIONS OF PASSAGES",
        "IT IS A LONG ESTABLISHED FACT THAT A READER",
      ],
      content: [
        "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature",
        "The loop will iterate over all enumerable properties of the object itself and those the object inherits from its prototype chain (properties of nearer prototypes take precedence over those of prototypes further away from the object in its prototype chain).",
        "If a property is modified in one iteration and then visited at a later time, its value in the loop is its value at that later time. A property that is deleted before it has been visited will not be visited later. Properties added to the object over which iteration is occurring may either be visited or omitted from iteration.",
      ],
    },
    category_2: {
      img: ["./img/news-4.jpg", "./img/news-5.jpg", "./img/news-6.jpg"],
      title: [
        "Introduction to HTML",
        "HTML text fundamentals",
        "Structuring a page of content",
      ],
      content: [
        "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature",
        "The traversal order, as of modern ECMAScript specification, is well-defined and consistent across implementations. Within each component of the prototype chain, all non-negative integer keys (those that can be array indices) will be traversed first in ascending order by value, then other string keys in ascending chronological order of property creation.",
        "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature",
      ],
    },
    category_3: {
      img: ["./img/news-7.jpg", "./img/news-8.jpg", "./img/news-9.jpg"],
      title: [
        "WHERE DOES IT COME FROM?",
        "What will your website look like?",
        "How the web works",
      ],
      content: [
        "Array indexes are just enumerable properties with integer names and are otherwise identical to general object properties.",
        "JavaScript is a programming language that adds interactivity to your website. This happens in games, in the behavior of responses when buttons are pressed or with data entry on forms; with dynamic styling; with animation, etc.",
        "JavaScript itself is relatively compact, yet very flexible. Developers have written a variety of tools on top of the core JavaScript language, unlocking a vast amount of functionality with minimum effort. ",
      ],
    },
  };
  function renderNewsContent(valueRender = data.category_1) {
    let html = valueRender.img.reduce(
      (acc, curr, index) =>
        (acc += /*html*/ `<div class="content-item">
        <div class="img">
          <a href="#" class="link">
              <img src=${curr} alt="">
          </a>
        </div>
      
        <div class="desc">
          <div class="line"></div>
          <h4 class="heading__content"><a href="#">${valueRender.title[index]}</a></h4>
          <p class="paragraph__content">${valueRender.content[index]}
          </p>
        </div>
      </div>`),
      ""
    );
    newsContent.innerHTML = html;
  }
  renderNewsContent();
  categories.forEach((item, id) => {
    item.dataset.category = `category_${id + 1}`;
    item.addEventListener("click", (e) => {
      categories.forEach((item) => item.classList.remove("active"));
      e.target.classList.add("active");
      const categoryList = e.target.dataset.category;
      renderNewsContent(data[categoryList]);
    });
  });

  // ============ pop up videos ===============

  // https://www.youtube.com/embed/
  const keys = {
    key_1: "SlGnZDI9HVg",
    key_2: "cnOIfm7imwQ",
    key_3: "8_d2f_LLjPo",
  };
  const endPoint = "https://www.youtube.com/embed/";
  const thumnails = $$(".quality .thumnail");

  thumnails.forEach((thumnail, id) => {
    thumnail.dataset.fancybox = "video-gallery";
    thumnail.dataset.src = `${endPoint}${Object.values(keys)[id]}`;
  });
  Fancybox.bind("[video-gallery]", {
    on: {
      ready: (fancybox) => {
        console.log("ready");
      },
    },
  });

  // ==================parallax=======================
  const parrallax = $(".parallax__background img");

  simpleParallax &&
    new simpleParallax(parrallax, {
      delay: 0.6,
      transition: "cubic-bezier(0,0,0,1)",
      maxTransition: 99,
      scale: 1.5,
    });
});
