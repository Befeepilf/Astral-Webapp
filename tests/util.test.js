import {dateToDayName} from 'util.js';
import addDays from 'date-fns/addDays';

describe("util.js", () => {
    describe("dateToDayName()", () => {
        it("Returns a day descriptor", () => {
            expect(dateToDayName(new Date())).toEqual("Today");
            expect(dateToDayName(addDays(new Date(), 1))).toEqual("Tomorrow");
            expect(dateToDayName(new Date(2020, 6, 6))).toEqual("Monday");
            expect(dateToDayName(new Date(2020, 6, 7))).toEqual("Tuesday");
            expect(dateToDayName(new Date(2020, 6, 8))).toEqual("Wednesday");
            expect(dateToDayName(new Date(2020, 6, 9))).toEqual("Thursday");
            expect(dateToDayName(new Date(2020, 6, 10))).toEqual("Friday");
            expect(dateToDayName(new Date(2020, 6, 11))).toEqual("Saturday");
            expect(dateToDayName(new Date(2020, 6, 12))).toEqual("Sunday");
        });
    });
});