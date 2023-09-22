const global = {
    currentPage: window.location.pathname,
}

//? FETCHING AND DISPLAYING POPULAR MOVIES
async function displayPopularMovies() {
    const { results } = await fetchAPIData('movie/popular');
    console.log(results);
    results.forEach((movie) => {
        const div = document.createElement('div');
        div.setAttribute('class', 'card');
        div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
          ${movie.poster_path ? `<img src='https://image.tmdb.org/t/p/w500${movie.poster_path}' class="card-img-top" alt='${movie.title}' />` : `<img
                src="images/no-image.jpg"
                class="card-img-top"
                alt='${movie.title}'
            />`}
        </a>
        <div class="card-body">
          <h5 class="card-title">${movie.title}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${movie.release_date}</small>
          </p>
        </div>
        `
        document.getElementById('popular-movies').appendChild(div)
    })
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
          ${show.poster_path ? `<img src='https://image.tmdb.org/t/p/w500${show.poster_path}' class="card-img-top" alt='${show.name}' />` : `<img
                src="images/no-image.jpg"
                class="card-img-top"
                alt='${show.name}'
            />`}
        </a>
        <div class="card-body">
          <h5 class="card-title">${show.name}</h5>
          <p class="card-text">
            <small class="text-muted">Air Date: ${show.first_air_date}</small>
          </p>
        </div>
        `
        document.getElementById('popular-shows').appendChild(div)
    })
}

//? DISPLAY MOVIE DETAILS
async function displayMovieDetails() {
    const searchParamArr = window.location.search.split('=');
    const movieId = searchParamArr[1];
    const movie = await fetchAPIData(`movie/${movieId}`)

    const div = document.createElement('div');
    console.log(movie);
    div.innerHTML = `
    <div class="details-top">
          <div>
          ${movie.poster_path ? `<img src='https://image.tmdb.org/t/p/w500${movie.poster_path}' class="card-img-top" alt='${movie.title}' />` : `<img
          src="images/no-image.jpg"
          class="card-img-top"
          alt='${movie.title}'
      />`}
          </div>
          <div>
            <h2>${movie.original_title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
              ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${addCommasToNum(movie.budget)}</li>
            <li><span class="text-secondary">Revenue:</span> $${addCommasToNum(movie.revenue)}</li>
            <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${movie.production_companies.map((company) => `<span>${company.name}</span>`).join('')}</div>
        </div>`;
    document.querySelector('#movie-details').appendChild(div);
}

//? FETCH DATA FROM TMDB API
async function fetchAPIData(endpoint) {
    const API_URL = 'https://api.themoviedb.org/3/';
    const API_KEY = '0ce9c29359c9eb2cac89a2e4afbf98b0';

    showSpinner();

    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
    const data = await response.json();

    hideSpinner();

    return data;
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
    links.forEach(link => {
        if (link.getAttribute('href') === global.currentPage)
            link.classList.add('active');
    })
}

//? FUNCTION TO ADD COMMAS
function addCommasToNum(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

//!? CREATING A ROUTER
function main() {
    highlightActiveLink();
    switch (global.currentPage) {
        case '/':
        case '/index.html':
            // console.log('Home Page');
            displayPopularMovies();
            break;
        case '/shows.html':
            // console.log('TV shows Page');
            displayPopularShows();
            break;
        case '/tv-details.html':
            console.log('TV-Details Page');
            break;
        case '/movie-details.html':
            // console.log('Movie-Details Page');
            displayMovieDetails()
            break;
        case '/search.html':
            console.log('Search Page')
            break;
    }
}

main();


//! NOTE FOR YOURSELF
/*

string.split('=') => will create an array breaking the String from all the position where '=' exists

array.join('') => will join all the array elements in a single string with adding '' in between them


*/