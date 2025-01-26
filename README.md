# About the Program
*Hyper* can be used to draw things on surfaces of constant curvature. There are three possibilities:
- Setting the curvature to 0 leads to ordinary Euclidean geometry.
- Setting the curvature to a positive value leads to spherical geometry.
- Setting the curvature to a positive value leads to hyperbolic geometry.

The program is at the same time i) a simple drawing program that one can use to draw things and ii) a program that one can use to move around on a surface and explore what has been drawn from different positions and angles.

The program may be used as a pedagogical tool when teaching geometry.

# Setup and Usage

## Prerequisites

Make sure the following are installed:
- A recent version of the Java Development Kit (JDK). Version 21 works.
- Maven
- JavaFX (either as part of JDK or as a standalone SDK; version 23 works)

## Setting up the Environment

1. Set the environment variable `JAVA_FX_SDK_PATH` to point to the location where the JavaFX SDK is installed. For example:
    ```bash
    export JAVA_FX_SDK_PATH=../javafx-sdk-23.0.2
    ```

## Building the Project

2. Use the following command to compile the code (ensure you have installed the Java Development Kit along with Maven):
    ```bash
    mvn clean package
    ```

## Running the Program

3. Then run the program using one of the following commands:

    - **Option 1:** 
      ```bash
      mvn javafx:run
      ```

    - **Option 2:**
      ```bash
      mvn exec:java
      ```

    - **Option 3 (Linux):**
      ```bash
      target/image/bin/com.mattiaswikstrom.hyper.Hyper
      ```

## Getting Started with the Program

Use the following keyboard keys to interact with the program:

- **Movement Controls:**
    - `Left`, `Right` – Turn around
    - `Up` – Move forward
    - `Down` – Move backward

- **Drawing Controls:**
    - `A` – Draw point at main cursor
    - `Q` – Draw point at auxiliary cursor

- **Curvature Controls:**
    - `F5` – Decrease curvature
    - `F6` – Increase curvature

## Complete List of Supported Keys

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
- `C` – Erase only points

### Function Keys:
- `F1` – Show help screen
- `F2` – Save
- `F5` – Decrease curvature
- `F6` – Increase curvature
- `F8` – Reset curvature

## License

This project is licensed under the terms of the [LICENSE.txt](./LICENSE.txt) file.
