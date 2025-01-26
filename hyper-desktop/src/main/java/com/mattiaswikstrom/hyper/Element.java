package com.mattiaswikstrom.hyper;

import java.io.Serializable;

public abstract class Element implements Serializable
{
    Space space;

    protected Element(Space space)
    {
        this.space = space;
        space.elements.add(this);
    }

    final public Space getSpace()
    {
        return space;
    }

    abstract protected void draw(javafx.scene.canvas.GraphicsContext g);
    abstract protected void moveForward(Length dist);
    abstract protected void rotate(Angle a);
    abstract public boolean withinRadius(Length r);
}
