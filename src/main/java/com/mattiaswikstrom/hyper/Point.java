package com.mattiaswikstrom.hyper;

public final class Point extends Element
{
    Length d; // distance from origin
    Angle a;  

    public Length getDistance()
    {
        return d;
    }

    public Angle getAngle()
    {
        return a;
    }

    Point(Space space, Length d, Angle a)
    {
        super(space);

        this.d = d.l > 0 ? d : Length.neg(d);
        this.a = d.l > 0 ? a : new Angle(a.a + Math.PI);
    }

    protected void rotate(Angle a)
    {
        this.a = Angle.diff(this.a, a);
    }

    protected void moveForward(Length dist)
    {
        Angle a_temp;
        Length d_temp;
        double x, y;
        Trig trig = getSpace().trig;

            if (getSpace().getCurvature() == 0)
            {
                    d_temp = trig.distance(dist, d, a);
                    x = (trig.square(dist)+trig.square(d_temp)-trig.square(d))/(trig.dprod(dist, d_temp));
                    y = d.l*trig.sin(a)/d_temp.l;
                    a_temp = new Angle(Math.PI - Math.atan2(y, x));
            }
            else
            {
                    d_temp = trig.tauinv(trig.tau(dist)*trig.tau(d)-trig.sigma(dist)*trig.sigma(d)*trig.cos(a));
                    x = (trig.tau(dist)*trig.tau(d_temp)-trig.tau(d))
                        / (trig.sigma(dist)*trig.sigma(d_temp));

                    y = trig.sigma(d)*trig.sin(a)/trig.sigma(d_temp);

                    a_temp = new Angle(Math.PI - Math.atan2(y, x));
            }

            if (d_temp.l < 0)
            {
                d = new Length(-d_temp.l);
                a = new Angle(Math.PI + a_temp.a);
            }
            else
            {
                d = d_temp;
                a = a_temp;
            }
    }

    protected void draw(javafx.scene.canvas.GraphicsContext g)
    {
        double x = getDistance().l * Math.cos(getAngle().a - 0.5 * Math.PI);
        double y = getDistance().l * Math.sin(getAngle().a - 0.5 * Math.PI);

        g.fillOval(x - 0.05, y - 0.05, 0.1, 0.1);
    }

    public boolean withinRadius(Length r)
    {
        return d.l < r.l;
    }

}
