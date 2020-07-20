import getAppProps from 'getAppProps.js';
import {tmdbConfMatchingObj, movieMatchingObj} from 'testUtils.js';

describe("Get App Props", () => {
    it("Returns valid tmdbConf, sessions and movies", async () => {
        const appProps = await getAppProps();

        expect(appProps).toMatchObject({
            initialState: {
                tmdbConf: tmdbConfMatchingObj,
                sessions: expect.toBeArray(),
                movies: expect.toBeArray()
            }
        });

        appProps.initialState.sessions.forEach(session => {
            expect(session).toMatchObject({
                id: expect.toBeNumber(),
                movieId: expect.toBeNumber(),
                startTime: expect.toSatisfy(timestamp => new Date(timestamp).getTime() === timestamp)
            });
        });

        appProps.initialState.movies.forEach(movie => {
            expect(movie).toMatchObject(movieMatchingObj);
        });
    });
});