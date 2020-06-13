import {getTmdbConf, getMovies} from 'tmdb.js';

function getMovieSessions(imdbId) {
    return ["15:20", "17:30", "18:40", "20:50", "23:15"];
}


export default async function({ctx}) {
    const tmdbConf = await getTmdbConf();

    let movies = await getMovies();
    movies = movies.map(movie => {
        const sessions = getMovieSessions(movie.imdb_id);
        return Object.assign(movie, {sessions});
    });


    return {initialState: {tmdbConf, movies}};
}