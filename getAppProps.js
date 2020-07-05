// this code only runs on the server

import {getTmdbConf, getMovies} from 'tmdb.js';

function getMovieSessions(imdbId) {
    const sessions = {
        tt0206634: {
            days: ['Mon', 'Wed', 'Fri'],
            times: ['14:00', '18:00', '20:30']
        },
        tt3256226: {
            days: ['Mon', 'Wed', 'Fri'],
            times: ['12:30', '16:30', '21:30']
        },
        tt2488496: {
            days: ['Tue', 'Thu', 'Sat'],
            times: ['14:00', '18:00', '20:30']
        },
        tt0970179: {
            days: ['Tue', 'Thu', 'Sat'],
            times: ['12:30', '16:30', '21:30']
        },
        tt0088763: {
            days: ['Mon', 'Thu', 'Sun'],
            times: ['15:00', '17:15', '21:00']
        }
    }
    
    return sessions[imdbId]
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