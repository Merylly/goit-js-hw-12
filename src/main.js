import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '41929630-0ce2e4f7023522073d7143cb8';

const refs = {
  form: document.getElementById('form'),
  resultContainer: document.getElementById('result-container'),
  loader: document.querySelector('.loader'),
};

refs.form.addEventListener('submit', handleSearch);

function handleSearch(event) {
  event.preventDefault();
  refs.loader.classList.remove('is-hidden');

  const form = event.currentTarget;
  const picture = form.elements.picture.value;

  searchPicturesByParams(picture)
    .then(data => {
      const pictures = data.hits;

      if (pictures.length === 0) {
        iziToast.error({
          position: 'topRight',
          message:
            'Sorry, there are no images matching your search query. Please try again!',
        });
      }

      createMarkup(pictures);
    })
    .catch(err => console.log(err))
    .finally(() => {
      form.reset();
      refs.loader.classList.add('is-hidden');
    });
}

function searchPicturesByParams(picture) {
  const urlParams = new URLSearchParams({
    key: API_KEY,
    q: picture,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 15,
  });

  return fetch(`${BASE_URL}?${urlParams}`).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
}

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

function createMarkup(hits) {
  const markUp = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<li class="gallery-item">
            <a href="${largeImageURL}">
  <img class="gallery-image" src="${webformatURL}" alt="${tags}" width="370" heigth="300"></a>
  <ul class="info-list">
    <li class="info-item">Likes: ${likes}</li>
    <li class="info-item">Views: ${views}</li>
    <li class="info-item">Comments: ${comments}</li>
    <li class="info-item">Downloads: ${downloads}</li>
  </ul>
</li>`
    )
    .join('');
  refs.resultContainer.innerHTML = markUp;
  lightbox.refresh();
}
