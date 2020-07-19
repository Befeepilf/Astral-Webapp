import {getTmdbConf, getMovie} from 'tmdb.js';
import {tmdbConfMatchingObj, movieMatchingObj} from 'testUtils.js';


describe("TMDB API", () => {
    describe("Fetch TMDB config", () => {
        it("Returns valid TMDB config", async () => {
            expect(await getTmdbConf()).toMatchObject(tmdbConfMatchingObj);
        });
    });

    describe("Fetch movie metadata", () => {
        it("Returns movie metadata object", async () => {
            const testTmdbId = 433249;
            expect(await getMovie(testTmdbId)).toMatchObject(movieMatchingObj);
        });
    });
});