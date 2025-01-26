package com.mattiaswikstrom.hyper;

import java.io.Serializable;

public class Length implements Serializable
{
    final public double l;

    public Length(double l)
    {
        this.l = l;
    }

    public static Length neg(Length l)
    {
        return new Length(-l.l);
    }

    public static Length diff(Length l1, Length l2)
    {
        return new Length(l1.l - l2.l);
    }

    public static Length sum(Length l1, Length l2)
    {
        return new Length(l1.l + l2.l);
    }

    public static Length abs(Length l)
    {
        if (l.l < 0)
            return new Length(-l.l);
        else
            return new Length(l.l);
    }
}
