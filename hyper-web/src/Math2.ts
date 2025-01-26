export class Math2 {
    static cosh(f: number): number {
        return (Math.exp(f) + Math.exp(-f)) / 2;
    }

    static sinh(f: number): number {
        return (Math.exp(f) - Math.exp(-f)) / 2;
    }

    static acosh(f: number): number {
        return Math.log(f + Math.sqrt(f * f - 1.0));
    }

    static asinh(f: number): number {
        let sgn = 1.0;

        if (f < 0.0) {
            sgn = -1.0;
            f = -f;
        }
        return sgn * Math.log(f + Math.sqrt(f * f + 1.0));
    }
}
