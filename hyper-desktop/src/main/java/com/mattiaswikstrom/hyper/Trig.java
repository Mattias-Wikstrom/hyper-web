package com.mattiaswikstrom.hyper;

import java.util.*;
import java.io.Serializable;

public final class Trig implements Serializable
{
    private double k;
    private double kinv;

    Trig(double k)
    {
        this.k = k;
        this.kinv = 1/k;
    }

    public double getCurvature()
    {
        return k;
    }

    public static double sin(Angle a)
    {
        return Math.sin(a.a);
    }

    public static double cos(Angle a)
    {
        return Math.cos(a.a);
    }

    public static Angle asin(double d)
    {
        return new Angle(Math.asin(d));
    }

    public static Angle acos(double d)
    {
        return new Angle(Math.acos(d));
    }

    public double sigma(Length l)
    {
        if (k == 0)
            return l.l;
        else if (k < 0)
            return Math2.sinh(l.l*k);
        else 
            return Math.sin(l.l*k);
    }

    public Length sigmainv(double d)
    {
        if (k == 0)
            return new Length(d);
        else if (k < 0)
            return new Length(kinv * Math2.asinh(d));
        else
            return new Length(kinv * Math.asin(d));
    }

    public double tau(Length l)
    {
        if (k == 0)
            return 1;
        else if (k < 0)
            return Math2.cosh(l.l*k);
        else 
            return Math.cos(l.l*k);
    }

    public Length tauinv(double d)
    {
        if (k == 0)
            return new Length(0);
        else if (k < 0)
            return new Length(kinv * Math2.acosh(d));
        else 
            return new Length(kinv * Math.acos(d));
    }

    public static double dprod(Length l1, Length l2)
    {
        return 2 * l1.l * l2.l;
    }

    public static double square(Length l)
    {
        return l.l * l.l;
    }

    public Angle angle_from_sss(Length s1, Length s2, Length opp)
    {
        if (k == 0)
            return acos((square(s1)+square(s2)-square(opp)) / dprod(s1, s2));
        else
            return acos((tau(s1)*tau(s2)-tau(opp)) / (sigma(s1)*sigma(s2)));
    }

    public Angle angle_from_aas(Angle a1, Angle a2, Length s)
    {
        if (k == 0)
            return new Angle(Math.PI - a1.a - a2.a);
        else
            return acos(sin(a1)*sin(a2)*tau(s) - cos(a1)*cos(a2));
    }

    Length side_from_aas(Angle a1, Angle a2, Length s)
    {
        return sigmainv(sin(a1)*sigma(s)/sin(a2));
    }

    public Angle angle_from_sas(Length s1, Angle a, Length s2)
    {
        return asin(sigma(s1)*sin(a)/sigma(s2));
    }

    public Length side_from_sas(Length s1, Angle a, Length s2)
    {
        return tauinv(tau(s1)*tau(s2)+sigma(s1)*sigma(s2)*cos(a));
    }

    public Angle angle_from_ssr(Length s1, Length s2)
    {
        return asin(sigma(s2)/sigma(s1));
    }

    public Length adj_from_asr(Angle a, Length s)
    {
        double ret;
        Angle a2;

        if (k == 0)
        {
            a2 = acos(sin(a));
            return adj_from_sra(s, a2); // Math.sin(a2) * Math2.sinh(s) / Math.sin(a);
            //return new Length(s.l / Math.cos(a.a));
        }
        else
        {
            a2 = acos(tau(s)*sin(a));
            return adj_from_sra(s, a2); // Math.sin(a2) * Math2.sinh(s) / Math.sin(a);
        }
    }


    public Length adj_from_sra(Length s, Angle a)
    {
        Angle a2;

        if (k == 0)
                return new Length(s.l / Math.sin(a.a));
        else
        {
                a2 = asin(cos(a) / tau(s));
                return sigmainv(sigma(s) / sin(a));
        }  
    }

    public Length opp_from_sra(Length s, Angle a)
    {
        return sigmainv(sigma(s)/sin(a));
    }

    public Length distance(Length s1, Length s2, Angle a)
    {
        if (k==0)
            return new Length(Math.sqrt(square(s1)+square(s2)-dprod(s1, s2)*cos(a)));
        else
            return tauinv(tau(s1)*tau(s2)
                -sigma(s1)*sigma(s2)*cos(a));
    }

    // Solves a*x*x+b*x+c=0 for x
    private List<Double> solveQuadratic(double a, double b, double c)
    {
        double p = b/a;
        double q = -c/a;
        // New equation: x*x+p*x=q

        double d = q + (p/2)*(p/2);
        List<Double> ret = new ArrayList<Double>(2);

        if (d < 0)
            ;
        else if (d == 0)
        {
            ret.add(Double.valueOf(-p/2));
        }
        else
        {
            double dr = Math.sqrt(d);
            ret.add(Double.valueOf(-p/2 + dr));
            ret.add(Double.valueOf(-p/2 - dr));
        }

        return ret;
    }

    // Solves a * sqrt(1-kappa*x*x)+b*x+c=0 for x
    private List<Double> solveRootEqn(double a, double b, double c, double kappa)
    {
        double a2 = a*a;
        return solveQuadratic(b*b/a2+kappa, 2*b*c/a2, c*c/a2-1);
    }

    public List<Length> side_from_ssa(Length s1, Length s2, Angle a)
    {
        List<Double> s;
        if (k == 0)
        {
            // s1*s1=s2*s2+s3*s3-2*s2*s3*cos(a)
            s = solveQuadratic(1, -2*s2.l*cos(a), square(s2)-square(s1));
        }
        else
        {
            double kappa = k > 0 ? 1 : -1;
            // tau(s1)=tau(s2)tau(s3)+kappa * sigma(s2)sigma(s3)*cos(a)
            // tau(s1)=tau(s2)sqrt(1-kappa*tau(s3)*tau(s3))+kappa*sigma(s2)sigma(s3)*cos(a)
            s = solveRootEqn(tau(s2), kappa*sigma(s2)*cos(a), -tau(s1), kappa);
        }

        List<Length> ret = new ArrayList<Length>(2);

        for (Iterator i = s.iterator(); i.hasNext(); )
        {
            Double d = (Double) i.next();
            ret.add(sigmainv(d.doubleValue()));
        }

        return ret;
    }
}
