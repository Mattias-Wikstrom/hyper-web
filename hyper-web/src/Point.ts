import { Length  } from "./Length.js";
import { Angle  } from "./Angle.js";
import { Trig  } from "./Trig.js";
import { SpaceElement  } from "./SpaceElement.js";

export class Point extends SpaceElement {
    d: Length;  // distance from origin
    a: Angle;   // angle

    constructor(d: Length, a: Angle) {
        super();
        this.d = d.l > 0 ? d : Length.neg(d);
        this.a = d.l > 0 ? a : new Angle(a.a + Math.PI);
    }

    getDistance(): Length {
        return this.d;
    }

    getAngle(): Angle {
        return this.a;
    }

    rotate(a: Angle): void {
        this.a = Angle.diff(this.a, a);
    }

    moveForward(dist: Length, curvature: number): void {
        let a_temp: Angle;
        let d_temp: Length;
        let x: number, y: number;
        let trig = new Trig(curvature);

        if (curvature === 0) {
            d_temp = trig.distance(dist, this.d, this.a);
            x = (Trig.square(dist) + Trig.square(d_temp) - Trig.square(this.d)) / Trig.dprod(dist, d_temp);
            y = this.d.l * Trig.sin(this.a) / d_temp.l;
            a_temp = new Angle(Math.PI - Math.atan2(y, x));
        } else {
            d_temp = trig.tauinv(trig.tau(dist) * trig.tau(this.d) - trig.sigma(dist) * trig.sigma(this.d) * Trig.cos(this.a));
            x = (trig.tau(dist) * trig.tau(d_temp) - trig.tau(this.d)) /
                (trig.sigma(dist) * trig.sigma(d_temp));
            y = trig.sigma(this.d) * Trig.sin(this.a) / trig.sigma(d_temp);
            a_temp = new Angle(Math.PI - Math.atan2(y, x));
        }

        if (d_temp.l < 0) {
            this.d = new Length(-d_temp.l);
            this.a = new Angle(Math.PI + a_temp.a);
        } else {
            this.d = d_temp;
            this.a = a_temp;
        }
    }

    draw(g: CanvasRenderingContext2D): void {
        let x = this.getDistance().l * Math.cos(this.getAngle().a - 0.5 * Math.PI);
        let y = this.getDistance().l * Math.sin(this.getAngle().a - 0.5 * Math.PI);
        g.beginPath();
        g.arc(x, y, 0.05, 0, 2 * Math.PI);  // Fill a circle with a radius of 0.05
        g.fill();
    }

    public withinRadius(r: Length): boolean {
        return this.d.l < r.l;
    }
}
