import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '41929630-0ce2e4f7023522073d7143cb8';

const refs = {
  form: document.getElementById('form'),
  resultContainer: document.getElementById('result-container'),
  loader: document.querySelector('.loader'),
  loadMoreBtn: document.getElementById('load-more'),
};

const queryParams = {
  query: '',
  page: 1,
  pageSize: 40,
  maxPage: 0,
};

refs.form.addEventListener('submit', handleSearch);

async function handleSearch(event) {
  event.preventDefault();

  refs.resultContainer.innerHTML = '';
  queryParams.page = 1;

  refs.loader.classList.remove('is-hidden');
  refs.loadMoreBtn.classList.add('is-hidden');

  const form = event.currentTarget;
  queryParams.query = form.elements.picture.value.trim();

  if (!queryParams.query) {
    refs.loader.classList.add('is-hidden');
    return;
  }

  try {
    const { hits, totalHits } = await searchPicturesByParam(queryParams);

    if (hits.length === 0) {
      iziToast.error({
        position: 'topRight',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
    }

    queryParams.maxPage = Math.ceil(totalHits / queryParams.pageSize);
    createMarkup(hits);

    if (hits.length > 0 && hits.length !== totalHits) {
      refs.loadMoreBtn.classList.remove('is-hidden');
      refs.loadMoreBtn.addEventListener('click', loadMoreSearch);
    }

    if (queryParams.page === queryParams.maxPage) {
      iziToast.info({
        position: 'topRight',
        message: "That's all we find!",
      });
    }
  } catch (err) {
    iziToast.error({ position: 'topRight', message: 'Something wrong!' });
  } finally {
    form.reset();
    refs.loader.classList.add('is-hidden');
  }

  async function loadMoreSearch() {
    queryParams.page += 1;
    refs.loadMoreBtn.disabled = true;
    refs.loader.classList.remove('is-hidden');

    try {
      const { hits } = await searchPicturesByParam(queryParams);
      createMarkup(hits);
      skrollDown();
    } catch {
      iziToast.error({ position: 'topRight', message: 'Something wrong!' });
    } finally {
      refs.loadMoreBtn.disabled = false;
      refs.loader.classList.add('is-hidden');
    }

    if (queryParams.page === queryParams.maxPage) {
      refs.loadMoreBtn.classList.add('is-hidden');
      refs.loadMoreBtn.removeEventListener('click', loadMoreSearch);
      iziToast.info({
        position: 'topRight',
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
  }
}

function searchPicturesByParam({ query, page = 1, pageSize }) {
  return axios
    .get(`${BASE_URL}`, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: pageSize,
        page,
      },
    })
    .then(({ data }) => data);
}

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

function createMarkup(pictures) {
  const markUp = pictures
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
  refs.resultContainer.insertAdjacentHTML('beforeend', markUp);
  lightbox.refresh();
}

function skrollDown() {
  if (queryParams.page > 1) {
    const rectItem = document
      .querySelector('.gallery-item')
      .getBoundingClientRect();
    window.scrollBy({ top: rectItem.height * 2, left: 0, behavior: 'smooth' });
  }
}
