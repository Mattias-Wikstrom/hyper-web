export class Angle {
    readonly a: number;

    constructor(a: number) {
        this.a = a;
    }

    static diff(a1: Angle, a2: Angle): Angle {
        return new Angle(a1.a - a2.a);
    }

    static sum(a1: Angle, a2: Angle): Angle {
        return new Angle(a1.a + a2.a);
    }

    static neg(a: Angle): Angle {
        return new Angle(-a.a);
    }

    static abs(a: Angle): Angle {
        return new Angle(Math.abs(a.a));
    }
}