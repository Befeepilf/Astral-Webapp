import {expect} from '@jest/globals';
import React from 'react';
import {render} from '@testing-library/react';

import {Provider} from 'react-redux';
import {createStore} from 'redux';
import reducer from 'redux/reducer.js';
import {createMuiTheme, ThemeProvider, StylesProvider} from '@material-ui/core/styles';
import {CloudinaryContext} from 'cloudinary-react';


export const tmdbConfMatchingObj = {
    images: {
        base_url: expect.stringMatching(/^http:\/\/\S+\/$/),
        secure_base_url: expect.stringMatching(/^https:\/\/\S+\/$/),
        backdrop_sizes: expect.toSatisfyAll(e => typeof e === 'string'),
        logo_sizes: expect.toSatisfyAll(e => typeof e === 'string'),
        poster_sizes: expect.toSatisfyAll(e => typeof e === 'string'),
        profile_sizes: expect.toSatisfyAll(e => typeof e === 'string'),
        still_sizes: expect.toSatisfyAll(e => typeof e === 'string')
    },
    change_keys: expect.toSatisfyAll(e => typeof e === 'string')
};

export const movieMatchingObj = {
    tmdbId: expect.toBeNumber(),
    imdbId: expect.stringMatching(/^tt\d+$/),
    title: expect.toBeString(),
    genres: expect.toSatisfyAll(e => typeof e === 'string'),
    imdbRating: expect.stringMatching(/^\d{1,2}\.\d$/),
    posterPath: expect.stringMatching(/^\/\S+\.(jpe?g|png)$/),
    backdropPath: expect.stringMatching(/^\/\S+\.(jpe?g|png)$/)
};


export const customRender = (ui, {initialState, ...options}) => render(ui, {
    ...options,
    wrapper: ({children}) => (
        <Provider store={createStore(reducer, initialState || {})}>
            <StylesProvider injectFirst>
                <ThemeProvider theme={createMuiTheme()}>
                    <CloudinaryContext cloudName="befeepilf" secure>
                        {children}
                    </CloudinaryContext>
                </ThemeProvider>
            </StylesProvider>
        </Provider>
    )
});