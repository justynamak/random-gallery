//  <img src="http://unsplash.it/400/400">
const gallery = document.querySelector(".gallery");
const options = [...document.querySelectorAll(".gallery__item")];
const btn = document.querySelector(".gallery__btn-random");
const limit = 200;
let amount = 6;
let photosApi;
let photos = [];
let wrapper;
let zoom;

const isInPage = function(element) {
  return document.body.contains(document.querySelector(element)) ? true : false;
};

const effect = function(element, show, time) {
  if (show) {
    setTimeout(() => {
      document.querySelector(element).classList.add("active");
    }, 300);
  } else {
    setTimeout(() => {
      document.querySelector(element).classList.remove("active");
      setTimeout(() => {
        gallery.removeChild(document.querySelector(element));
      }, 600);
    }, time);
  }
};
const randomPhoto = function() {
  let index = Math.floor(Math.random() * (photosApi.length - 1));

  if (photos.includes(photosApi[index])) {
    return randomPhoto();
  } else {
    return index;
  }
};

const chooseOption = function() {
  photos = [];
  amount = parseInt(this.dataset.amount);
  const index = options.findIndex(option =>
    option.classList.contains("gallery__item--active")
  );
  options[index].classList.remove("gallery__item--active");
  this.classList.add("gallery__item--active");
};
const generateHtml = function(photos) {
  const html = `
    <ul class="wrapper">
    ${photos
      .map(
        photo =>
          `<li class="wrapper__photo">
          <img class="gallery__img" src="${photo.download_url}" data-id="${
            photo.id
          }"/>
          </li>`
      )
      .join("")}
      </ul>`;

  if (!wrapper) {
    const ul = document.createElement("ul");
    gallery.appendChild(ul);
    ul.classList.add("wrapper");
    wrapper = document.querySelector(".wrapper");
  }
  document.querySelector(".wrapper").outerHTML = html;
  effect(".wrapper", true);
};

const createGallery = function() {
  photos = [];
  fetch(`https://picsum.photos/v2/list?page=2&limit=${limit}`)
    .then(response => response.json())
    .then(json => {
      photosApi = [...json];
      for (let i = 0; i < amount; i++) {
        let index = randomPhoto();
        photos.push(photosApi[index]);
      }
      return photos;
    })
    .then(photos => generateHtml(photos));
};
const zoomPhoto = function(e) {
  const datasetId = e.target.dataset.id;
  const photoZoom = photos.find(photo => photo.id === datasetId);

  if (isInPage(".wrapper") && !isInPage(".zoom")) {
    if (e.target.classList.contains("gallery__img")) {
      const html = `
      <div class="zoom">
        <img class="zoom__photo" src="${photoZoom.download_url}" data-id="${
        photoZoom.id
      }"/>
      </div>
      `;
      const div = document.createElement("div");
      div.className = "zoom";
      gallery.appendChild(div);
      document.querySelector(".zoom").outerHTML = html;
      effect(".zoom", true);
    }
  } else if (isInPage(".wrapper") && isInPage(".zoom")) {
    if (
      !e.target.classList.contains("zoom__photo") &&
      !e.target.classList.contains("zoom")
    ) {
      effect(".zoom", false, 100);
    }
  }
};

const slidePhotos = function(e) {
  if (isInPage(".wrapper") && isInPage(".zoom")) {
    const zoom = document.querySelector(".zoom");
    const currentPhoto = document.querySelector(".zoom__photo").dataset.id;
    let currentIndex = photos.findIndex(photo => photo.id === currentPhoto);

    if (e.keyCode === 39) {
      let nextIndex = ++currentIndex;
      if (nextIndex >= photos.length - 1) nextIndex = 0;
      const nextPhoto = photos[nextIndex];
      const html = `
      <div class="zoom active">
        <img class="zoom__photo" src="${nextPhoto.download_url}" data-id="${
        nextPhoto.id
      }"/>
      </div>`;
      zoom.outerHTML = html;
      effect(".zoom__photo", true);
    } else if (e.keyCode === 37) {
      let prevIndex = --currentIndex;
      if (prevIndex < 0) prevIndex = photos.length - 1;
      const prevPhoto = photos[prevIndex];
      const html = `
      <div class="zoom active">
        <img class="zoom__photo" src="${prevPhoto.download_url}" data-id="${
        prevPhoto.id
      }"/>
      </div>`;
      zoom.outerHTML = html;
      effect(".zoom__photo", true);
    }
  }
};
options.forEach(option => option.addEventListener("click", chooseOption));
btn.addEventListener("click", createGallery);
window.addEventListener("click", zoomPhoto);
window.addEventListener("keydown", slidePhotos);
