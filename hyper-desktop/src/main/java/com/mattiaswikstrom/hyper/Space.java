package com.mattiaswikstrom.hyper;

import java.io.*;
import java.util.*;

public final class Space implements Serializable
{
    public Trig trig;
    Collection<Element> elements;

    public Iterator getElementIterator()
    {
        return elements.iterator();
    }

    public void draw(javafx.scene.canvas.GraphicsContext g)
    {
        for (Iterator i = elements.iterator(); i.hasNext(); )
        {
            Element e = (Element) i.next();
            e.draw(g);
        }
    }

    public Space(double k)
    {
        trig = new Trig(k);
        elements = new LinkedList<Element>();
    }

    public double getCurvature()
    {
        return trig.getCurvature();
    }

    void changeCurvature(double k)
    {
        trig = new Trig(k);
    }

    public Length distance(Point p1, Point p2)
    {
        return trig.distance(p1.d, p2.d, Angle.diff(p2.a, p1.a));
    }

    public void rotate(Angle angle)
    {
        for (Iterator i = elements.iterator(); i.hasNext(); )
        {
            Element e = (Element) i.next();
            e.rotate(angle);
        }
    }

    public void moveforward(Length dist)
    {
        for (Iterator i = elements.iterator(); i.hasNext(); )
        {
            Element e = (Element) i.next();
            e.moveForward(dist);
        }
    }
}
