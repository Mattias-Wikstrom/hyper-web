public abstract class Element
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

    abstract protected void draw(java.awt.Graphics2D g);
    abstract protected void moveForward(Length dist);
    abstract protected void rotate(Angle a);
    abstract public boolean withinRadius(Length r);
}
