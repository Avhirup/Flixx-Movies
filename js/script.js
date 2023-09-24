const global = {
  currentPage: window.location.pathname,
  search: {
    term: '',
    type: '',
    page: 1,
    totalPages: 1
  },
  api: {
    api_url: 'https://api.themoviedb.org/3/',
    api_key: '0ce9c29359c9eb2cac89a2e4afbf98b0',
  }
};

//? FETCHING AND DISPLAYING POPULAR MOVIES
async function displayPopularMovies() {
  const { results } = await fetchAPIData('movie/popular');
  // console.log(results);
  results.forEach((movie) => {
    const div = document.createElement('div');
    div.setAttribute('class', 'card');
    div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
          ${movie.poster_path
        ? `<img src='https://image.tmdb.org/t/p/w500${movie.poster_path}' class="card-img-top" alt='${movie.title}' />`
        : `<img
                src="images/no-image.jpg"
                class="card-img-top"
                alt='${movie.title}'
            />`
      }
        </a>
        <div class="card-body">
          <h5 class="card-title">${movie.title}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${movie.release_date}</small>
          </p>
        </div>
        `;
    document.getElementById('popular-movies').appendChild(div);
  });
}

//? DISPLAY SLIDER
async function displaySlider() {
  const { results } = await fetchAPIData('movie/now_playing');
  console.log(results);
  results.forEach(result => {
    const div = document.createElement('div');
    div.setAttribute('class', 'swiper-slide');
    div.innerHTML = `
          <a href="movie-details.html?id=${result.id}">
            <img src='https://image.tmdb.org/t/p/w500${result.poster_path}' alt="${result.original_title}" />
          </a>
          <h4 class="swiper-rating">
            <i class="fas fa-star text-secondary"></i> ${result.vote_average} / 10
          </h4>
    `;
    document.querySelector('.swiper-wrapper').appendChild(div);
    initSwiper();
  })
}

//? INITIALIZING SWIPER OBJECT
function initSwiper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    speed: 800,
    breakpoints: {
      720: {
        slidesPerView: 2
      },
      900: {
        slidesPerView: 3
      },
      1200: {
        slidesPerView: 4
      },
    },
  });
}

//? FETCHING AND DISPLAYING POPULAR TV-SHOWS
async function displayPopularShows() {
  const { results } = await fetchAPIData('tv/popular');
  console.log(results);
  results.forEach((show) => {
    const div = document.createElement('div');
    div.setAttribute('class', 'card');
    div.innerHTML = `
        <a href="tv-details.html?id=${show.id}">
          ${show.poster_path
        ? `<img src='https://image.tmdb.org/t/p/w500${show.poster_path}' class="card-img-top" alt='${show.name}' />`
        : `<img
                src="images/no-image.jpg"
                class="card-img-top"
                alt='${show.name}'
            />`
      }
        </a>
        <div class="card-body">
          <h5 class="card-title">${show.name}</h5>
          <p class="card-text">
            <small class="text-muted">Air Date: ${show.first_air_date}</small>
          </p>
        </div>
        `;
    document.getElementById('popular-shows').appendChild(div);
  });
}

//? DISPLAY MOVIE DETAILS
async function displayMovieDetails() {
  // console.log(window.location.search);
  const searchParamArr = window.location.search.split('=');
  const movieId = searchParamArr[1];
  const movie = await fetchAPIData(`movie/${movieId}`);

  // DISPLAYING BACKDROP IMAGE
  displayBackgroundImage('movie', movie.backdrop_path);

  const div = document.createElement('div');
  // console.log(movie);
  div.innerHTML = `
    <div class="details-top">
          <div>
          ${movie.poster_path
      ? `<img src='https://image.tmdb.org/t/p/w500${movie.poster_path}' class="card-img-top" alt='${movie.title}' />`
      : `<img
          src="images/no-image.jpg"
          class="card-img-top"
          alt='${movie.title}'
      />`
    }
          </div>
          <div>
            <h2>${movie.original_title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
              ${movie.overview ? movie.overview : 'Description not available'}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            ${movie.homepage ? `<a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>` : ''}
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${addCommasToNum(
      movie.budget
    )}</li>
            <li><span class="text-secondary">Revenue:</span> $${addCommasToNum(
      movie.revenue
    )}</li>
            <li><span class="text-secondary">Runtime:</span> ${movie.runtime
    } minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${movie.production_companies
      .map((company) => `<span>${company.name}</span>`)
      .join('')}</div>
        </div>`;
  document.querySelector('#movie-details').appendChild(div);
}

//? DISPLAY SHOW DETAILS
async function displayShowDetails() {
  const searchParamArr = window.location.search.split('=');
  const showId = searchParamArr[1];
  const show = await fetchAPIData(`tv/${showId}`);
  // DISPLAYING BACKDROP IMAGE
  displayBackgroundImage('tv', show.backdrop_path);
  console.log(show);

  const div = document.createElement('div');
  div.innerHTML = `
    <div class="details-top">
          <div>
          ${show.poster_path
      ? `<img src='https://image.tmdb.org/t/p/w500${show.poster_path}' class="card-img-top" alt='${show.name}' />`
      : `<img
          src="images/no-image.jpg"
          class="card-img-top"
          alt='${show.name}'
      />`
    }
          </div>
          <div>
            <h2>${show.original_name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Last Air Date: ${show.last_air_date}</p>
            <p>
              ${show.overview ? show.overview : 'Description not available'}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            ${show.homepage ? `<a href="${show.homepage}" target="_blank" class="btn">Visit Show Homepage</a>` : ''}
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">No of Episodes:</span> ${show.number_of_episodes}</li>
            <li><span class="text-secondary">Last Episode To Air:</span> ${show.last_episode_to_air.name}</li>
            <li><span class="text-secondary">Status:</span> ${show.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${show.production_companies
      .map((company) => `<span>${company.name}</span>`)
      .join('')}</div>
        </div>`;
  document.querySelector('#show-details').appendChild(div);
}

//? DISPLAYING BACKDROP_PATH
function displayBackgroundImage(type, path) {
  const overlayDiv = document.createElement('div');
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${path})`;
  overlayDiv.style.backgroundSize = 'cover';
  overlayDiv.style.backgroundPosition = 'center';
  overlayDiv.style.backgroundRepeat = 'no-repeat';
  overlayDiv.style.height = '100vh';
  overlayDiv.style.width = '100vw';
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.top = '0';
  overlayDiv.style.left = '0';
  overlayDiv.style.zIndex = '-1';
  overlayDiv.style.opacity = '0.2';

  if (type === 'movie') {
    document.getElementById('movie-details').appendChild(overlayDiv);
  } else {
    document.getElementById('show-details').appendChild(overlayDiv);
  }
}

//? FETCH DATA FROM TMDB API
async function fetchAPIData(endpoint) {
  const API_URL = global.api.api_url;
  const API_KEY = global.api.api_key;

  showSpinner();

  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );
  const data = await response.json();

  hideSpinner();

  return data;
}

//? TO SEARCH A MOVIE/SHOW
async function searchAPIData(endpoint) {
  const API_URL = global.api.api_url;
  const API_KEY = global.api.api_key;

  showSpinner();

  const response = await fetch(
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}`
  );
  const data = await response.json();

  hideSpinner();

  return data;
}

//? FUNCTION TO IMPLEMENT SEARCH FEATURE
async function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  console.log(urlParams.get('type'));
  console.log(urlParams.get('search-term'));

  global.search.type = urlParams.get('type');
  global.search.term = urlParams.get('search-term');

  if (global.search.term !== '' && global.search.term !== null) {
    const results = await searchAPIData();
    console.log(results);
  }
  else {
    showAlert('Please enter something to search');
  }
}

function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}

function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}


//!? HIGHLIGHT ACTIVE LINK
function highlightActiveLink() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach((link) => {
    if (link.getAttribute('href') === global.currentPage)
      link.classList.add('active');
  });
}

//? FUNCTION TO ADD COMMAS
function addCommasToNum(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}




//? FOR SHOWING ALERTS
function showAlert(message, className) {
  const alertEl = document.createElement('div');
  alertEl.classList.add('alert', className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector('#alert').appendChild(alertEl);

  setTimeout(() => { alertEl.remove() }, 2500);
}


//!? CREATING A ROUTER
function main() {
  highlightActiveLink();
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      // console.log('Home Page');
      displaySlider();
      displayPopularMovies();
      break;
    case '/shows.html':
      // console.log('TV shows Page');
      displayPopularShows();
      break;
    case '/tv-details.html':
      // console.log('TV-Details Page');
      displayShowDetails();
      break;
    case '/movie-details.html':
      // console.log('Movie-Details Page');
      displayMovieDetails();
      break;
    case '/search.html':
      // console.log('Search Page');
      search();
      break;
  }
}

main();
