import { Math2 } from './Math2';  // Assuming Math2 is in the same directory

describe('Math2 Class', () => {
    describe('cosh function', () => {
        it('should return the correct value for cosh(0)', () => {
            expect(Math2.cosh(0)).toBeCloseTo(1, 5); // cosh(0) = 1
        });

        it('should return the correct value for a positive number', () => {
            expect(Math2.cosh(1)).toBeCloseTo(1.5430806348152437, 5);
        });

        it('should return the correct value for a negative number', () => {
            expect(Math2.cosh(-1)).toBeCloseTo(1.5430806348152437, 5);
        });
    });

    describe('sinh function', () => {
        it('should return the correct value for sinh(0)', () => {
            expect(Math2.sinh(0)).toBeCloseTo(0, 5); // sinh(0) = 0
        });

        it('should return the correct value for a positive number', () => {
            expect(Math2.sinh(1)).toBeCloseTo(1.1752011936438014, 5);
        });

        it('should return the correct value for a negative number', () => {
            expect(Math2.sinh(-1)).toBeCloseTo(-1.1752011936438014, 5);
        });
    });

    describe('acosh function', () => {
        it('should return the correct value for acosh(1)', () => {
            expect(Math2.acosh(1)).toBeCloseTo(0, 5); // acosh(1) = 0
        });

        it('should return the correct value for a number greater than 1', () => {
            expect(Math2.acosh(2)).toBeCloseTo(1.3169578969248166, 5);
        });
    });

    describe('asinh function', () => {
        it('should return the correct value for asinh(0)', () => {
            expect(Math2.asinh(0)).toBeCloseTo(0, 5); // asinh(0) = 0
        });

        it('should return the correct value for a positive number', () => {
            expect(Math2.asinh(1)).toBeCloseTo(0.881373587019543, 5);
        });

        it('should return the correct value for a negative number', () => {
            expect(Math2.asinh(-1)).toBeCloseTo(-0.881373587019543, 5);
        });
    });
});
