import { Length  } from "./Length.js";
import { Angle  } from "./Angle.js";
import { Trig  } from "./Trig.js";
import { Point  } from "./Point.js";
import { SpaceElement  } from "./SpaceElement.js";

export class Space {
    trig: Trig;
    elements: SpaceElement[];

    constructor(k: number, _elements:SpaceElement[]) {
        this.trig = new Trig(k);
        this.elements = _elements;
    }

    getElementIterator(): Iterator<SpaceElement> {
        return this.elements[Symbol.iterator]();
    }

    draw(g: CanvasRenderingContext2D): void {
        for (let e of this.elements) {
            e.draw(g);
        }
    }

    getCurvature(): number {
        return this.trig.getCurvature();
    }

    changeCurvature(k: number): void {
        this.trig = new Trig(k);
    }

    distance(p1: Point, p2: Point): Length {
        return this.trig.distance(p1.getDistance(), p2.getDistance(), Angle.diff(p2.getAngle(), p1.getAngle()));
    }

    rotate(angle: Angle): void {
        for (let e of this.elements) {
            e.rotate(angle);
        }
    }

    moveforward(dist: Length, space: Space): void {
        for (let e of this.elements) {
            e.moveForward(dist, space);
        }
    }
}
