// this code only runs on the server

import add from 'date-fns/add';
import startOfDay from 'date-fns/startOfDay';

import {getTmdbConf, getMovie} from 'tmdb.js';

function getMovieSessions(imdbId) {
    const today = startOfDay(new Date());

    const daysAfterToday = [];
    for (let i = 1; i <= 3; i++) {
        daysAfterToday.push(add(today, {days: i}));
    }

    const sessions = [
        {id: 1, movieId: 433249, startTime: add(today, {hours: 14, minutes: 20}).getTime()},
        {id: 2, movieId: 9693, startTime: add(today, {hours: 16, minutes: 30}).getTime()},
        {id: 3, movieId: 105, startTime: add(today, {hours: 18, minutes: 0}).getTime()},
        {id: 4, movieId: 140607, startTime: add(today, {hours: 18, minutes: 15}).getTime()},
        {id: 5, movieId: 433249, startTime: add(today, {hours: 19, minutes: 30}).getTime()},
        {id: 6, movieId: 157336, startTime: add(today, {hours: 20, minutes: 30}).getTime()},
        {id: 7, movieId: 44826, startTime: add(today, {hours: 22, minutes: 15}).getTime()},
        {id: 8, movieId: 9693, startTime: add(today, {hours: 23, minutes: 0}).getTime()},

        {id: 9, movieId: 433249, startTime: add(daysAfterToday[0], {hours: 14, minutes: 20}).getTime()},
        {id: 10, movieId: 530915, startTime: add(daysAfterToday[0], {hours: 16, minutes: 30}).getTime()},
        {id: 11, movieId: 9693, startTime: add(daysAfterToday[0], {hours: 18, minutes: 0}).getTime()},
        {id: 12, movieId: 334533, startTime: add(daysAfterToday[0], {hours: 18, minutes: 15}).getTime()},
        {id: 13, movieId: 433249, startTime: add(daysAfterToday[0], {hours: 19, minutes: 30}).getTime()},
        {id: 14, movieId: 10681, startTime: add(daysAfterToday[0], {hours: 20, minutes: 30}).getTime()},
        {id: 15, movieId: 9693, startTime: add(daysAfterToday[0], {hours: 22, minutes: 15}).getTime()},
        {id: 16, movieId: 105, startTime: add(daysAfterToday[0], {hours: 23, minutes: 0}).getTime()},

        {id: 17, movieId: 105, startTime: add(daysAfterToday[1], {hours: 14, minutes: 20}).getTime()},
        {id: 18, movieId: 9693, startTime: add(daysAfterToday[1], {hours: 16, minutes: 30}).getTime()},
        {id: 19, movieId: 433249, startTime: add(daysAfterToday[1], {hours: 18, minutes: 0}).getTime()},
        {id: 20, movieId: 530915, startTime: add(daysAfterToday[1], {hours: 18, minutes: 15}).getTime()},
        {id: 21, movieId: 140607, startTime: add(daysAfterToday[1], {hours: 19, minutes: 30}).getTime()},
        {id: 22, movieId: 44826, startTime: add(daysAfterToday[1], {hours: 20, minutes: 30}).getTime()},
        {id: 23, movieId: 433249, startTime: add(daysAfterToday[1], {hours: 22, minutes: 15}).getTime()},
        {id: 24, movieId: 9693, startTime: add(daysAfterToday[1], {hours: 23, minutes: 0}).getTime()},

        {id: 25, movieId: 9693, startTime: add(daysAfterToday[2], {hours: 14, minutes: 20}).getTime()},
        {id: 26, movieId: 199, startTime: add(daysAfterToday[2], {hours: 16, minutes: 30}).getTime()},
        {id: 27, movieId: 433249, startTime: add(daysAfterToday[2], {hours: 18, minutes: 0}).getTime()},
        {id: 28, movieId: 372058, startTime: add(daysAfterToday[2], {hours: 18, minutes: 15}).getTime()},
        {id: 29, movieId: 140607, startTime: add(daysAfterToday[2], {hours: 19, minutes: 30}).getTime()},
        {id: 30, movieId: 9693, startTime: add(daysAfterToday[2], {hours: 20, minutes: 30}).getTime()},
        {id: 31, movieId: 433249, startTime: add(daysAfterToday[2], {hours: 22, minutes: 15}).getTime()},
        {id: 32, movieId: 44826, startTime: add(daysAfterToday[2], {hours: 23, minutes: 0}).getTime()}
    ];
    
    return sessions;
}


export default async function({ctx}) {
    const tmdbConf = await getTmdbConf();
    const sessions = getMovieSessions().filter(s => s.startTime > new Date().getTime());
    
    const duplicatedMovieIds = getMovieSessions().map(({movieId}) => movieId);
    const movies = await Promise.all(
        duplicatedMovieIds
            .filter((id, index) => duplicatedMovieIds.indexOf(id) === index)
            .map(getMovie)
    );

    return {initialState: {tmdbConf, sessions, movies}};
}