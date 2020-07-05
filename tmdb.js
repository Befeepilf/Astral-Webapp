const { TMDB_API_KEY } = process.env;
const BASE_URL = 'https://api.themoviedb.org/3';

async function tmdbRequest(path, params = {}) {
    const query = Object.entries(params).reduce((str, param) => str + `&${param[0]}=${param[1]}`, '');
    const res = await fetch(`${BASE_URL}${path}?api_key=${TMDB_API_KEY}${query}`);
    return await res.json();
}

// fetches the imdb page of a movie and extracts the rating
async function getImdbRating(imdbId) {
    const res = await fetch(`https://imdb.com/title/${imdbId}`);
    const html = await res.text();
    return (/<span itemprop="ratingValue">(\d{1,2}\.\d)/.exec(html) || [])[1];
}

async function getMovie(tmdbId) {
    return await tmdbRequest(`/movie/${tmdbId}`);
}

export async function getTmdbConf() {
    return await tmdbRequest('/configuration');
}

export async function getMovies() {
    // hardcoded movies I personally find awesome
    const movies = [
        {id: 433249},
        {id: 9693},
        {id: 105},
        {id: 140607},
        {id: 44826}
    ];

    // get imdb rating and throw away data we don't need
    await Promise.all(movies.map(async function ({ id }, i) {
        const { title, genres, imdb_id, poster_path, backdrop_path } = await getMovie(id);
        const imdb_rating = await getImdbRating(imdb_id);

        movies[i] = { imdb_id, title, genres: genres.map(({ id, name }) => name), imdb_rating, poster_path, backdrop_path }
    }));

    return movies;
}