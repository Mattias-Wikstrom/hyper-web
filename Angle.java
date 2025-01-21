public class Angle
{
    final public double a;

    public Angle(double a)
    {
        this.a = a;
    }

    public static Angle diff(Angle a1, Angle a2)
    {
        return new Angle(a1.a - a2.a);
    }

    public static Angle sum(Angle a1, Angle a2)
    {
        return new Angle(a1.a + a2.a);
    }

    public static Angle neg(Angle a)
    {
        return new Angle(-a.a);
    }

    public static Angle abs(Angle a)
    {
        if (a.a < 0)
            return new Angle(-a.a);
        else
            return new Angle(a.a);
    }

}
