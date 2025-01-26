import { Trig } from './Trig';
import { Angle } from './Angle';  // Assuming Angle is another class you've imported
import { Length } from './Length'; // Assuming Length is another class you've imported

describe('Trig Class', () => {
    let trig: Trig;

    beforeEach(() => {
        trig = new Trig(1); // Example for testing, setting k=1
    });

    test('should return the correct curvature', () => {
        expect(trig.getCurvature()).toBe(1);
    });

    test('should correctly calculate sin of an angle', () => {
        const angle = new Angle(Math.PI / 2); // 90 degrees
        expect(Trig.sin(angle)).toBeCloseTo(1, 5); // sin(90°) = 1
    });

    test('should correctly calculate cos of an angle', () => {
        const angle = new Angle(0); // 0 degrees
        expect(Trig.cos(angle)).toBeCloseTo(1, 5); // cos(0°) = 1
    });

    test('should correctly calculate asin (inverse sin)', () => {
        const result = Trig.asin(0.5); // asin(0.5) = 30 degrees or π/6 radians
        expect(result).toBeInstanceOf(Angle);
        expect(result.a).toBeCloseTo(Math.PI / 6, 5); 
    });

    test('should correctly calculate acos (inverse cos)', () => {
        const result = Trig.acos(0.5); // acos(0.5) = 60 degrees or π/3 radians
        expect(result).toBeInstanceOf(Angle);
        expect(result.a).toBeCloseTo(Math.PI / 3, 5);
    });

    test('should calculate sigma correctly for k=1', () => {
        const length = new Length(2);
        expect(trig.sigma(length)).toBeCloseTo(Math.sin(2), 5);
    });

    test('should calculate sigmainv correctly for k=1', () => {
        //const length = new Length(0.5);
        const result = trig.sigmainv(0.5);
        expect(result).toBeInstanceOf(Length);
        expect(result.l).toBeCloseTo(Math.asin(0.5), 5);
    });

    test('should calculate tau correctly for k=1', () => {
        const length = new Length(2);
        expect(trig.tau(length)).toBeCloseTo(Math.cos(2), 5);
    });

    test('should calculate tauinv correctly for k=1', () => {
        const result = trig.tauinv(0.5);
        expect(result).toBeInstanceOf(Length);
        expect(result.l).toBeCloseTo(Math.acos(0.5), 5);
    });
});
