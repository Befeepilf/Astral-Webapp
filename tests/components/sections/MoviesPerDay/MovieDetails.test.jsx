import React from 'react';
import {screen, fireEvent, waitFor} from '@testing-library/react';

import add from 'date-fns/add';
import startOfDay from 'date-fns/startOfDay';
import format from 'date-fns/format';

import {customRender as render} from 'testUtils.js';
import MovieDetails from 'components/sections/MoviesPerDay/MovieDetails.jsx';

describe("MovieDetails", () => {
    const today = startOfDay(new Date());
    const initialState = {
        sessions: [
            {id: 1, movieId: 74, startTime: add(today, {hours: 7, minutes: 20}).getTime()},
            {id: 2, movieId: 74, startTime: add(today, {hours: 14, minutes: 45}).getTime()}
        ]
    };

    const testMovie = {
        tmdbId: 74,
        title: "Test Movie",
        imdbRating: 7.4,
        genres: ["Genre 1", "Genre 2"]
    };

    const testStartTime = today.getTime();


    it("Displays relevant movie details", () => {
        render(<MovieDetails movie={testMovie} startTime={testStartTime}/>, {initialState});

        expect(screen.queryByText(new RegExp(testMovie.title, 'i'))).toBeTruthy();
        testMovie.genres.forEach(genre => {
            expect(screen.queryByText(new RegExp(genre, 'i'))).toBeTruthy();
        });
        initialState.sessions.forEach(({startTime}) => {
            expect(screen.queryByText(format(startTime, 'HH:mm'))).toBeTruthy();
        });
    });

    it("Sessions are selectable", async () => {
        const {container} = render(<MovieDetails movie={testMovie} startTime={testStartTime}/>, {initialState});

        const buttons = screen.queryAllByRole('button');
        const btnSession1 = buttons.find(btn => btn.innerHTML.includes(format(initialState.sessions[0].startTime, 'HH:mm')));
        const btnSession2 = buttons.find(btn => btn.innerHTML.includes(format(initialState.sessions[1].startTime, 'HH:mm')));
        const btnBook = screen.queryByText("book a session");

        expect(btnBook).toBeTruthy();

        fireEvent.click(btnSession1);

        await waitFor(() => {
            screen.getByText("book this session");
        });

        fireEvent.click(btnSession1);

        await waitFor(() => {
            screen.getByText("book a session");
        });

        fireEvent.click(btnSession2);

        await waitFor(() => {
            screen.getByText("book this session");
        });

        fireEvent.click(btnSession2);

        await waitFor(() => {
            screen.getByText("book a session");
        });
    });
});