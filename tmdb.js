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


export async function getTmdbConf() {
    return await tmdbRequest('/configuration');
}

export async function getMovie(tmdbId) {
    const { title, genres, imdb_id, poster_path, backdrop_path } = await tmdbRequest(`/movie/${tmdbId}`);
    const imdbRating = await getImdbRating(imdb_id);
    
    return {
        tmdbId,
        imdbId: imdb_id,
        title,
        genres: genres.map(({ id, name }) => name),
        imdbRating,
        posterPath: poster_path,
        backdropPath: backdrop_path
    };
}