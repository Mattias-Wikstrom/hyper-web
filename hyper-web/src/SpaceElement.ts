import { Length  } from "./Length.js";
import { Angle  } from "./Angle.js";
import { Space  } from "./Space.js";

export abstract class SpaceElement {
    abstract draw(g: CanvasRenderingContext2D): void;
    abstract moveForward(dist: Length, curvature: number): void;
    abstract rotate(a: Angle): void;
    abstract withinRadius(r: Length): boolean;
}
