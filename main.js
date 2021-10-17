// target is the element that triggered the event (e.g., the user clicked on).
// currentTarget is the element that the event listener is attached to.

const imageContainer = document.getElementById("image-container");
const switchGridBtn = document.getElementById("switchGridBtn");
const modal = document.getElementById("modal");
const leftArrow = document.getElementById("leva-strelica");
const rightArrow = document.getElementById("desna-strelica");
const modalImg = document.getElementById("modalImg");
const closeBtn = document.getElementById("close-btn");

const allPhotos = [];
let currentPhotoIndex = 0;
let dataFetching = false;

// WHEN CLICKED SWITCH GRID BUTTON
switchGridBtn.addEventListener("click", () => {
  switchGridBtn.classList.toggle("grid-column");
  imageContainer.classList.toggle("grid-column");
});

// WHEN CLICKED INSIDE MAIN IMAGES CONAINER
imageContainer.addEventListener("click", (e) => {
  // WHEN CLICKED ON ANY IMAGE FOOTER (prevents image click)
  if (e.target.closest(".img-footer")) {
    e.stopPropagation;
    return;
  }

  // WHEN CLICKED ON ANY IMAGE:

  // GET CLICKED PHOTO ID
  const photoId = e.target.closest(".single-image").getAttribute("data-id");
  console.log(photoId);

  // EXTRACT OBJECT FROM allPhotos ARRAY USING CLICKED PHOTO ID
  const currentPhoto = allPhotos.find((photo, index) => {
    currentPhotoIndex = index;
    return photo.id === photoId;
  });
  console.log(currentPhoto);
  console.log(currentPhotoIndex);

  // SET IMAGE IN MODAL
  modalImg.src = currentPhoto.urls.regular;

  // SHOW MODAL
  modal.classList.add("show");
});

// LEFT ARROW IN MODAL CLICKED
leftArrow.addEventListener("click", (e) => {
  let newPhotoIndex = 0;
  const currentPhoto = allPhotos.find((photo, index) => {
    newPhotoIndex = index;
    return index === currentPhotoIndex - 1;
  });
  currentPhotoIndex = newPhotoIndex;
  // SET IMAGE IN MODAL
  modalImg.src = currentPhoto.urls.regular;
});

// RIGHT ARROW IN MODAL CLICKED
rightArrow.addEventListener("click", (e) => {
  let newPhotoIndex = 0;
  const currentPhoto = allPhotos.find((photo, index) => {
    newPhotoIndex = index;
    return index === currentPhotoIndex + 1;
  });
  currentPhotoIndex = newPhotoIndex;
  // SET IMAGE IN MODAL
  modalImg.src = currentPhoto.urls.regular;
});

//CLOSE-BTN IN MODAL CLICKED
closeBtn.addEventListener("click", function (e) {
  modal.classList.remove("show");
});

// WHEN CLICKED INSIDE MODAL
modal.addEventListener("click", (e) => {
  // hide modal if clicked outside modal-body
  if (e.target === e.currentTarget) {
    modal.classList.remove("show");
  }
});

let page = 0;
const API_URL =
  "https://api.unsplash.com/photos/random?count=20&client_id=JzU2DW3K8L57kEetZfDjm5jtYFBhjJrSj3SvvfZHjQw";

getPhotos();

// FUNCTION FOR GETING PHOTOS FROM API AND ADDING THEM TO DOM
async function getPhotos() {
  // show loader
  const loader = document.querySelector(".loader");
  loader.classList.remove("hidden");

  // increment page variable by 1
  page++;

  dataFetching = true;
  // fetch from API
  const response = await fetch(`${API_URL}&page=${page}`);

  // response to json
  const photos = await response.json();

  // hide loader
  loader.classList.add("hidden");

  // push new images that we got from API to allPhotos array
  allPhotos.push(...photos);
  console.log(allPhotos);

  // add new images to DOM
  photos.forEach((photo, i) => {
    const content = document.createElement("div");
    content.className = "single-image-wrapper";

    const linkPortfolio = photo.user?.portfolio_url
      ? `<a href="${photo.user.portfolio_url}" target="_blank">Portfolio</a>`
      : "<span>This user has no portfoio</span>";

    const insta = photo.user?.social?.instagram_username
      ? `<a href="https://instagram.com/${photo.user.social?.instagram_username}" target="_blank"><i class="fab fa-instagram"></i> ${photo.user.social?.instagram_username}</a>`
      : "";

    const twitter = photo.user?.social?.twitter_username
      ? `<a href="https://twitter.com/${photo.user.social?.twitter_username}" target="_blank"><i class="fab fa-twitter"></i> ${photo.user.social?.twitter_username}</a>`
      : "";

    const paypal = photo.user?.social?.paypal_email
      ? `<span><i class="fab fa-paypal"></i> ${photo.user.social?.paypal_email}</span>`
      : "";

    content.innerHTML = `<div class="single-image" data-id="${photo.id}">
    <figure class="img-figure">
        <img src="${photo.urls.small}" alt="${
      photo.alt_description ? photo.alt_description : "this photo has no alt"
    }" class="images" />
    </figure>
    <div class="img-footer">
        <div class="footer-wrapper">
            <div  class="profile"> 
                <img src="${
                  photo.user.profile_image.small
                }" alt="profile-image">
                <span class="username">${photo.user.username}</span>
            </div>
            <div class="info">
                <a href="${
                  photo.links.download
                }" class="fas fa-link photo-link" target="_blank"></a>
                <span>${photo.downloads}</span>
                <i class="fas fa-arrow-down"></i>
                <span>${photo.likes}</span>
                <i class="far fa-thumbs-up"></i>
            </div>
        </div>
        <div class="profile-extra">
        <hr/>
            <div class="profile-extra__portfolio">
            ${linkPortfolio}
            </div>
            <div class="profile-extra__social">
            ${insta} <br>
            ${twitter} ${paypal}
            </div>
        </div>
    </div>
    </div>`;

    imageContainer.appendChild(content);
  });

  dataFetching = false;
}

// ADD NEW DATA ON SCROLL BOTTOM
window.onscroll = function () {
  if (
    window.innerHeight + Math.ceil(window.pageYOffset) >=
    document.body.offsetHeight
  ) {
    if (!dataFetching) {
      dataFetching = true;
      getPhotos();
    }
  }
};
