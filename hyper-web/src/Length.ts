export class Length {
    readonly l: number;

    constructor(l: number) {
        this.l = l;
    }

    static neg(l: Length): Length {
        return new Length(-l.l);
    }

    static diff(l1: Length, l2: Length): Length {
        return new Length(l1.l - l2.l);
    }

    static sum(l1: Length, l2: Length): Length {
        return new Length(l1.l + l2.l);
    }

    static abs(l: Length): Length {
        if (l.l < 0) {
            return new Length(-l.l);
        } else {
            return new Length(l.l);
        }
    }
}
