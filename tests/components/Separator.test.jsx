import React from 'react';
import {screen} from '@testing-library/react';
import {customRender as render} from 'testUtils.js';
import Separator from 'components/Separator.jsx';

describe("Separator", () => {
    it("Shows custom label", () => {
        const testLabel = "This is a test";
        render(<Separator height={400} label={testLabel}/>, {initialState: {}});
        expect(screen.queryByText(testLabel)).toBeTruthy();
    });

    it("Can be thick or thin", () => {
        const {container: container1} = render(<Separator height={400}/>, {initialState: {}});
        const width1 = parseFloat(container1.querySelector('rect').getAttribute('width'));

        const {container: container2} = render(<Separator height={400} thin/>, {initialState: {}});
        const width2 = parseFloat(container2.querySelector('rect').getAttribute('width'));

        expect(width1 > width2).toBeTruthy();
    })
});