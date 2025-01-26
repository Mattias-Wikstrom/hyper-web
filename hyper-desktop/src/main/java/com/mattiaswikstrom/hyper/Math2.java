package com.mattiaswikstrom.hyper;

public class Math2
{
    public static double cosh(double f)
    {
        return (Math.exp(f) + Math.exp(-f))/2;
    }
    public static double sinh(double f)
    {
        return (Math.exp(f) - Math.exp(-f))/2;
    }
    public static double acosh(double f)
    {
        return Math.log(f+Math.sqrt(f*f-1.0));
    }
    public static double asinh(double f)
    {
        double sgn = 1.0;

        if(f<0.0){
            sgn = -1.0;
            f = -f;
        }
        return sgn*Math.log(f+Math.sqrt(f*f+1.0));
    }
}
