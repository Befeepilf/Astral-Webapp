import React from 'react';
import {screen} from '@testing-library/react';
import {customRender as render} from 'testUtils.js';
import MovieImage from 'components/MovieImage.jsx';


describe("MovieImage", () => {
    const initialState = {
        tmdbConf: {
            images: {
                secure_base_url: 'https://127.0.0.1/'
            }
        }
    };

    it("renders an img element with cloudinary url as src", () => {
        const testSrc = '/test.jpg';

        render(<MovieImage src={testSrc}/>, {initialState});

        const img = screen.getByRole('img');
        expect(img.dataset.src).toBeString();
        expect(img.dataset.src).toMatch(new RegExp(`^https:\/\/.+befeepilf.+${initialState.tmdbConf.images.secure_base_url}original${testSrc}$`));
    });

    it("can be hidden", () => {
        render(<MovieImage hidden/>, {initialState});

        // by default byRole doesn't consider elements that are excluded from the accessibility tree
        // elements with the style attribute display:none are exluded, so if MovieImage is supposed to be hidden
        // this query shouldn't match any element
        // https://www.w3.org/TR/wai-aria-1.2/#tree_exclusion
        const img = screen.queryByRole('img');
        expect(img).toBeFalsy();
    });

    it("uses auto:good as default quality", () => {
        render(<MovieImage/>, {initialState});
        expect(screen.getByRole('img').dataset.src).toMatch('q_auto:good');
    });

    it("uses custom quality prop", () => {
        render(<MovieImage quality="auto:low"/>, {initialState});
        expect(screen.getByRole('img').dataset.src).toMatch('q_auto:low');
    });

    it("uses custom className", () => {
        const testClass = 'test';
        render(<MovieImage className={testClass}/>, {initialState});
        expect(screen.getByRole('img').classList.contains(testClass)).toBeTruthy();
    });
});