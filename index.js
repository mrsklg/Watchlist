const apiKey = "cc129778";
const input = document.getElementById("movie-title");
const searchForm = document.getElementById("search-form");
const searchResults = document.getElementById("search-results");
const watchlist = document.getElementById("watchlist");
const moviesLocalStorage = JSON.parse(localStorage.getItem("addedToWatchlist"));
let moviesHtml = '';
const addedToWatchlist = [];

if (searchForm) {
    searchForm.addEventListener("submit", event => {
        event.preventDefault();
        const title = input.value;
        input.value = '';
        fetch(`https://www.omdbapi.com/?apikey=${apiKey}&type=movie&s=${title}`)
            .then(res => res.json())
            .then(data => {
                const movies = data.Search;
                if (movies != null) {
                    const moviesIDs = [];
                    movies.forEach(movie => {
                        moviesIDs.push(movie.imdbID);
                    });
                    searchResults.innerHTML = '';
                    getMoviesHtml(searchResults, moviesIDs);
                } else {
                    searchResults.innerHTML = `
                        <p class="start-exploring">Unable to find what you’re looking for. Please try another search.</p>
                        `
                }
            })
    })
}

const getMoviesHtml = (element, moviesIDs) => {
    moviesIDs.forEach(id => {
        fetch(`https://www.omdbapi.com/?apikey=${apiKey}&type=movie&i=${id}`)
            .then(res => res.json())
            .then(movie => {
                element.innerHTML += `
                    <div class="movie-summary">
                        <img src="${movie.Poster === "N/A" ? "images/default-movie-poster.jpg" : movie.Poster}" class="movie-poster">
                        <div class="movie-info">
                            <div class="primary-info">
                                <h3>${movie.Title}</h3>
                                <img src="images/star.svg" class="star">
                                <p class="ratings">${movie.Ratings[0] ? movie.Ratings[0].Value.substring(0, movie.Ratings[0].Value.indexOf("/")) : "N/A"}</p>
                            </div>
                            <div class="movie-details">
                                <p class="runtime">${movie.Runtime}</p>
                                <p class="genre">${movie.Genre}</p>
                                <button class="watchlist ${element === searchResults ? "add-watchlist" : "remove-watchlist"}" data-add="${id}">
                                    <img src="images/plus-icon.svg" class="plus-icon">
                                    <img src="images/minus-icon.svg" class="minus-icon">
                                    Watchlist
                                </button>
                            </div>
                            <p class="plot">${movie.Plot}</p>
                        </div>
                    </div>
                `;
            });
    });
}

if (searchResults) {
    searchResults.addEventListener("click", event => {
        if (event.target.dataset.add) {
            if (!addedToWatchlist.includes(event.target.dataset.add)) {
                addedToWatchlist.push(event.target.dataset.add);
                event.target.classList.add("remove-watchlist");
            } else {
                addedToWatchlist.splice(addedToWatchlist.indexOf(event.target.dataset.add), 1);
                event.target.classList.add("add-watchlist");
                event.target.classList.remove("remove-watchlist");
            }
        }
        localStorage.setItem("addedToWatchlist", JSON.stringify(addedToWatchlist));
    })
}

if (watchlist) {
    const watchlistDefualtHtml = watchlist.innerHTML;
    if (moviesLocalStorage) {
        watchlist.innerHTML = '';
        getMoviesHtml(watchlist, moviesLocalStorage);
    }
    watchlist.addEventListener("click", event => {
        if (event.target.dataset.add) {
            moviesLocalStorage.splice(moviesLocalStorage.indexOf(event.target.dataset.add), 1);
            localStorage.setItem("addedToWatchlist", JSON.stringify(moviesLocalStorage));
        }
        watchlist.innerHTML = '';
        if (moviesLocalStorage.length > 0) {
            getMoviesHtml(watchlist, moviesLocalStorage);
        } else {
            watchlist.innerHTML = watchlistDefualtHtml;
        }
    })
}