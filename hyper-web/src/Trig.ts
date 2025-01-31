import { Length  } from "./Length.js";
import { Angle  } from "./Angle.js";

export class Trig {
    private k: number;
    private kinv: number;

    constructor(k: number) {
        this.k = k;
        this.kinv = 1 / k;
    }

    getCurvature(): number {
        return this.k;
    }

    static sin(a: Angle): number {
        return Math.sin(a.a);
    }

    static cos(a: Angle): number {
        return Math.cos(a.a);
    }

    static asin(d: number): Angle {
        return new Angle(Math.asin(d));
    }

    static acos(d: number): Angle {
        return new Angle(Math.acos(d));
    }

    /*
        This function appears in the Law of Sines in non-Euclidean geometry:
            sin(α)/σ(a) = sin(β)/σ(b) = sin(γ)/σ(c)
    */
    sigma(l: Length): number {
        if (this.k === 0) return l.l;
        else if (this.k < 0) return Math.sinh(l.l * this.k);
        else return Math.sin(l.l * this.k);
    }

    sigmainv(d: number): Length {
        if (this.k === 0) return new Length(d);
        else if (this.k < 0) return new Length(this.kinv * Math.asinh(d));
        else return new Length(this.kinv * Math.asin(d));
    }

    /*
        This function appears in the Law of Cosines in non-Euclidean geometry:
            τ(c)=τ(a)⋅τ(b)+σ(a)⋅σ(b)⋅cos(γ)
    */
    tau(l: Length): number {
        if (this.k === 0) return 1;
        else if (this.k < 0) return Math.cosh(l.l * this.k);
        else return Math.cos(l.l * this.k);
    }

    tauinv(d: number): Length {
        if (this.k === 0) return new Length(0);
        else if (this.k < 0) return new Length(this.kinv * Math.acosh(d));
        else return new Length(this.kinv * Math.acos(d));
    }

    static dprod(l1: Length, l2: Length): number {
        return 2 * l1.l * l2.l;
    }

    static square(l: Length): number {
        return l.l * l.l;
    }

    angle_from_sss(s1: Length, s2: Length, opp: Length): Angle {
        if (this.k === 0)
            return Trig.acos((Trig.square(s1) + Trig.square(s2) - Trig.square(opp)) / Trig.dprod(s1, s2));
        else
            return Trig.acos((this.tau(s1) * this.tau(s2) - this.tau(opp)) / (this.sigma(s1) * this.sigma(s2)));
    }

    angle_from_aas(a1: Angle, a2: Angle, s: Length): Angle {
        if (this.k === 0)
            return new Angle(Math.PI - a1.a - a2.a);
        else
            return Trig.acos(Trig.sin(a1) * Trig.sin(a2) * this.tau(s) - Trig.cos(a1) * Trig.cos(a2));
    }

    side_from_aas(a1: Angle, a2: Angle, s: Length): Length {
        return this.sigmainv(Trig.sin(a1) * this.sigma(s) / Trig.sin(a2));
    }

    angle_from_sas(s1: Length, a: Angle, s2: Length): Angle {
        return Trig.asin(this.sigma(s1) * Trig.sin(a) / this.sigma(s2));
    }

    side_from_sas(s1: Length, a: Angle, s2: Length): Length {
        if (this.k === 0) {
            // Euclidean case: Use the Law of Cosines
            const cSquared = Trig.square(s1) + Trig.square(s2) - 2 * s1.l * s2.l * Trig.cos(a);
            return new Length(Math.sqrt(cSquared));
        } else {
            // Non-Euclidean case: Use the generalized formula
            return this.tauinv(this.tau(s1) * this.tau(s2) + this.sigma(s1) * this.sigma(s2) * Trig.cos(a));
        }
    }

    angle_from_ssr(s1: Length, s2: Length): Angle {
        return Trig.asin(this.sigma(s2) / this.sigma(s1));
    }

    adj_from_asr(a: Angle, s: Length): Length {
        let a2: Angle;
        if (this.k === 0) {
            a2 = Trig.acos(Trig.sin(a));
            return this.adj_from_sra(s, a2);
        } else {
            a2 = Trig.acos(this.tau(s) * Trig.sin(a));
            return this.adj_from_sra(s, a2);
        }
    }

    adj_from_sra(s: Length, a: Angle): Length {
        if (this.k === 0)
            return new Length(s.l / Trig.sin(a));
        else {
            //let a2: Angle = Trig.asin(Trig.cos(a) / this.tau(s));
            return this.sigmainv(this.sigma(s) / Trig.sin(a));
        }
    }

    opp_from_sra(s: Length, a: Angle): Length {
        return this.sigmainv(this.sigma(s) / Trig.sin(a));
    }

    distance(s1: Length, s2: Length, a: Angle): Length {
        if (this.k === 0)
            return new Length(Math.sqrt(Trig.square(s1) + Trig.square(s2) - Trig.dprod(s1, s2) * Trig.cos(a)));
        else
            return this.tauinv(this.tau(s1) * this.tau(s2) - this.sigma(s1) * this.sigma(s2) * Trig.cos(a));
    }

    private solveQuadratic(a: number, b: number, c: number): number[] {
        const p = b / a;
        const q = -c / a;

        const d = q + (p / 2) * (p / 2);
        let ret: number[] = [];

        if (d >= 0) {
            const dr = Math.sqrt(d);
            ret.push(-p / 2 + dr);
            ret.push(-p / 2 - dr);
        }

        return ret;
    }

    private solveRootEqn(a: number, b: number, c: number, kappa: number): number[] {
        const a2 = a * a;
        return this.solveQuadratic(b * b / a2 + kappa, 2 * b * c / a2, c * c / a2 - 1);
    }

    side_from_ssa(s1: Length, s2: Length, a: Angle): Length[] {
        let s: number[];
        if (this.k === 0) {
            s = this.solveQuadratic(1, -2 * s2.l * Trig.cos(a), Trig.square(s2) - Trig.square(s1));
        } else {
            const kappa = this.k > 0 ? 1 : -1;
            s = this.solveRootEqn(this.tau(s2), kappa * this.sigma(s2) * Trig.cos(a), -this.tau(s1), kappa);
        }

        return s.map(d => this.sigmainv(d));
    }
}