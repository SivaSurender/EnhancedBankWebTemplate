'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (event) {
   event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
 
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach((btn)=> btn.addEventListener("click", openModal))


btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


//implementing sooth scroll

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener("click", function (e) {
  const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords);


//1 old way
  // raw scroll
  // scrollto takes arguments from left ,top
  // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);

  // to make it smooth
  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior : "smooth",
  });


//2 new way - supports only new browsers
  
  // section1.scrollIntoView({ behavior: "smooth" });
})

// random color generator

// const randomInt = (max, min) => Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () => `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`
// console.log(randomColor(0, 255));


// Event delegation on nav links

document.querySelector(".nav__links").addEventListener("click", function (event) {
  event.preventDefault();

  // matching strategy for event delegation
  if (event.target.classList.contains("nav__link")) {
    const id = event.target.getAttribute("href")
    document.querySelector(id).scrollIntoView({
      behavior : "smooth"
    })
  }
})



// without eventy delegation 
// document.querySelectorAll(".nav__link").forEach(function (element) {
//   element.addEventListener("click", function (event) {
//     const id = event.target.getAttribute("href")
//     document.querySelector(id).scrollIntoView({behavior : "smooth"})
//   })
// })

// tabbed contents
//without event delegation
const tabs = document.querySelectorAll(".operations__tab");
const operations = document.querySelectorAll(".operations__content");
// document.querySelectorAll(".operations").forEach(function (bt) {
//   bt.addEventListener("click", function (e) {
//     // console.log("I'm clicked");
//     const clicked = e.target.closest(".operations__tab");

//     // if no click return nothing
//     // guard clause
//     if (!clicked) return;

//     // remove hover function by default
//     tabs.forEach(function (btt) {
//       btt.classList.remove("operations__tab--active");
//     })

//     operations.forEach(op =>
//       op.classList.remove('operations__content--active')
//     );

//     // adding the classes for only clicked elements
//     clicked.classList.add('operations__tab--active');
//     // console.log(clicked.dataset.tab);
    
//     document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add("operations__content--active");


//   })
// })

// with event delegation attaching event listener to the entire parent class
document.querySelector('.operations__tab-container').addEventListener("click", function (e) {
    // console.log("I'm clicked");
    const clicked = e.target.closest(".operations__tab");

    // if no click return nothing
    // guard clause
    if (!clicked) return;

    // remove hover function by default
    tabs.forEach(function (btt) {
      btt.classList.remove("operations__tab--active");
    })

    operations.forEach(op =>
      op.classList.remove('operations__content--active')
    );

    // adding the classes for only clicked elements
    clicked.classList.add('operations__tab--active');
    // console.log(clicked.dataset.tab);
    
    document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add("operations__content--active");


})
  
// fade menu animation

const nav = document.querySelector(".nav");

const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    // console.log(link, siblings, logo);

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }

};

nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

// sticky navigation

// 1. scroll event
// scroll event is available only in window object

// const scrolllInto = section1.getBoundingClientRect()

// window.addEventListener("scroll", function () {
//   if (window.scrollY > scrolllInto.top) nav.classList.add("sticky");
//   else nav.classList.remove("sticky");
// })


// 2. sticky navigation with intersection api

// intersectionobserver takes in a callback and object propert

// creating callback
const stickyNav = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  // console.log(entries);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}

// property
const stickyNavProperty = {
  root: null,
  threshold: 0,
  rootMargin : `${nav.getBoundingClientRect().height}px`
}
const headerObserver = new IntersectionObserver(stickyNav, stickyNavProperty)
headerObserver.observe(document.querySelector(".header"));


// reveal section using intersectionobserver

const allSections = document.querySelectorAll(".section");

const allSectionCallback = function (entries, observer) {
  
  // only one threshold so only one entry

  const [entry] = entries;
  // console.log(entry.target);

  // remove hidden
  if (!entry.isIntersecting) return;
  else entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);

}
const sectionObserver = new IntersectionObserver(allSectionCallback, {
  root: null,
  threshold : 0.15
});
  
allSections.forEach(function (section) {
  section.classList.add("section--hidden");
  sectionObserver.observe(section);
})


// Lazy loading of images functionality

const allImages = document.querySelectorAll("img[data-src]");


const imageObserverCallback = function (entries, observer) {
  
  const [entry] = entries;
  
  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img")
  });

  observer.unobserve(entry.target);
}

const imageObserver = new IntersectionObserver(imageObserverCallback, {
  root: null,
  threshold: 0,

  // we dont want the user know we are lazy loading the image , if we add root margin it will load even before the user scrolls to that section
  rootMargin: '200px'
});

allImages.forEach(image => imageObserver.observe(image));


// slider component
///////////////////////////////////////
// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
