# About Hyper
*Hyper* can be used to draw things on surfaces of constant curvature. There are three possibilities:
- Setting the curvature to 0 leads to ordinary Euclidean geometry.
- Setting the curvature to a positive value leads to spherical geometry.
- Setting the curvature to a positive value leads to hyperbolic geometry.

The program is at the same time i) a simple drawing program that one can use to draw things and ii) a program that one can use to move around on a surface and explore what has been drawn from different positions and angles.

The program may be used as a pedagogical tool when teaching geometry.
# Versions of Hyper
Hyper currently exists in two versions:
* A desktop version written in Java (not this repo).
* A web version written in TypeScript which uses React (this repo).

# Trying Hyper Online
The web version of Hyper can be tried [here](https://mattias-wikstrom.github.io/hyper-web/).

## Getting Started with Hyper

The feature that makes Hyper unique among drawing programs is the ability to change the curvature of the surface that things are drawn on. This can be done through the 'Edit Curvature' window.

You can use the following keyboard keys to interact with Hyper:

- **Movement Controls:**
    - `Left`, `Right` – Turn around
    - `Up` – Move forward
    - `Down` – Move backward

- **Drawing Controls:**
    - `A` – Draw point at main cursor
    - `Q` – Draw point at auxiliary cursor

## A More Complete List of Supported Keys

### Keys for Moving:
- `Left`, `Right` – Turn around
- `Up` – Move forward
- `Down` – Move backward
- `Page Up`, `Page Down` – Move auxiliary cursor
- `Insert` – Flip auxiliary cursor
- Hold down `Shift` and/or `Control` while moving to move slowly.

### Keys for Drawing:
- `Q` – Draw point at auxiliary cursor
- `A` – Draw point at main cursor

### Keys for Erasing:
- `Z` – Erase at cursor
- `X` – Erase at cursor with a bigger eraser

### Keys for Zooming:
- `O` – Zoom in
- `P` – Zoom out

### Function Keys (Desktop Version Only):
-- `F1` – Show help screen
-- `F2` – Save
-- `F5` – Decrease curvature
-- `F6` – Increase curvature
-- `F8` – Reset curvature

## License

This project is licensed under the terms of the [LICENSE.txt](./LICENSE.txt) file.
