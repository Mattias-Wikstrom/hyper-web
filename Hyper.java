import java.awt.*;
import java.awt.geom.*;
import java.awt.event.*;
import java.awt.image.*;
import java.io.*;
import java.util.*;
import javax.swing.*;
import javax.swing.event.*;

public class Hyper extends Panel implements KeyListener, WindowListener, ActionListener, ChangeListener, MouseListener, MouseMotionListener //, AdjustmentListener
{ 
    static ResourceBundle resources = ResourceBundle.getBundle("HyperResources", Locale.US);

    static final double radius = 0.2;

    double k = 1;
    //boolean mode3d = false;
    Space space;

    String txtFilename = "";

    boolean bADown = false;
    boolean bQDown = false;
    boolean bZDown = false;
    boolean bXDown = false;
    boolean bCDown = false;
    boolean bShiftDown = false;
    boolean bControlDown = false;

    Length drawingDist = new Length(1.001);
    Angle angularSpeed;
    Length linearSpeed;
    double magnification = 0.2;

    boolean bChanged = false;

    private Dialog curvdlg;
    private JSlider slider;

    private AffineTransform transform;

    private int value = 0;

    public Hyper()
    {
        space = new Space(0.1 * value);
        calculateSpeed();
    }

    public Hyper(String filename)
    {
        space = new Space(0.1 * value);
        calculateSpeed();
        txtFilename = filename;
        if (!(new File(txtFilename)).exists() && !(new HyperFilter()).accept(new File(txtFilename)))
            txtFilename = txtFilename + ".hpr";
        
        openDocument();
    }

    private void setTitle()
    {
        String title;
        if (txtFilename == "")
            title = resources.getString("AppName");
        else
            title = txtFilename + " - " + resources.getString("AppName");

        ((Frame)this.getParent()).setTitle(title);
    }

    private static void centerWindow(Window w)
    {
        int height = w.getHeight();
        int width = w.getWidth();
        Dimension screensize = w.getToolkit().getScreenSize();

        w.setLocation(screensize.width / 2 - width / 2, screensize.height / 2 - height / 2);
    }

    boolean bContinue;
    
    boolean showHasChangedDialog()
    {
        final Dialog d = new Dialog((Frame)this.getParent(), resources.getString("AppName"), true);
        Label l = new Label(resources.getString("SaveChanges"));
        d.add("North", l);

        Button bYes = new Button(resources.getString("btnYes"));

        bYes.addActionListener(new ActionListener()
            {
                public void actionPerformed(ActionEvent e)
                {
                    file_save();
                    bContinue = true;
                    d.setVisible(false);
                }
            }
            );

        Button bNo = new Button(resources.getString("btnNo"));

        bNo.addActionListener(new ActionListener()
            {
                public void actionPerformed(ActionEvent e)
                {
                    bContinue = true;
                    d.setVisible(false);
                }
            }
            );

        Button bCancel = new Button(resources.getString("btnCancel"));

        bCancel.addActionListener(new ActionListener()
            {
                public void actionPerformed(ActionEvent e)
                {
                    bContinue = false;
                    d.setVisible(false);
                }
            }
            );

        Panel p = new Panel();
        p.add(bYes);
        p.add(bNo);
        p.add(bCancel);

        d.add("South", p);
        d.setSize(400, 100);
        d.setResizable(false);
        centerWindow(d);

        d.addWindowListener(new WindowListener()
        {
            public void windowClosing(WindowEvent e)
            {
                d.setVisible(false);
            }
                public void windowClosed(WindowEvent e) {}
                public void windowActivated(WindowEvent e) {}
                public void windowDeactivated(WindowEvent e) {}
                public void windowIconified(WindowEvent e) {}
                public void windowDeiconified(WindowEvent e) {}
                public void windowOpened(WindowEvent e) {}
        });

        d.setVisible(true);
        return bContinue;
    }

    void file_exit()
    {
        if (bChanged)
            if (!showHasChangedDialog())
                return;

        this.getParent().setVisible(false);
        System.exit(0);
    }

    void file_new()
    {
        if (bChanged)
            if (!showHasChangedDialog())
                return;

        txtFilename = "";
        value = 0;
        if (slider != null)
            slider.setValue(value);
        space = new Space(0.1 * value);
        repaint();
        bChanged = false;

        setTitle();
    }
    
    void file_open()
    {
        /*final Dialog d = new Dialog((Frame)this.getParent(), resources.getString("dlgOpen"), true);
        d.setSize(400, 300);
        centerWindow(d);
        d.addWindowListener(new WindowListener()
        {
            public void windowClosing(WindowEvent e)
            {
                d.setVisible(false);
            }
            public void windowClosed(WindowEvent e) {}
            public void windowActivated(WindowEvent e) {}
            public void windowDeactivated(WindowEvent e) {}
            public void windowIconified(WindowEvent e) {}
            public void windowDeiconified(WindowEvent e) {}
            public void windowOpened(WindowEvent e) {}
        });

        d.add("North", new Label(resources.getString("SelectFile")));

        final java.awt.List files = new java.awt.List(8, false);
        File f = new File(".");
        String fa[] = f.list();
        for (int i = 0; i < fa.length; i++)
            files.add(fa[i]);

        d.add("Center", files);
        

        final Button btnOpen = new Button(resources.getString("btnOpen"));
        btnOpen.addActionListener(new ActionListener()
            { public void actionPerformed(ActionEvent e){
              txtFilename = files.getSelectedItem();
              bContinue = true;
              d.setVisible(false);
            }});
        final Button btnCancel = new Button(resources.getString("btnCancel"));
        btnCancel.addActionListener(new ActionListener()
            { public void actionPerformed(ActionEvent e){
                bContinue = false;
                d.setVisible(false);
            }});
        Panel p = new Panel();
        p.add(btnOpen);
        p.add(btnCancel);
        d.add("South", p);

        d.setVisible(true);
        */
        /*FileDialog d = new FileDialog((Frame)this.getParent(), resources.getString("dlgOpen"), FileDialog.LOAD);

        d.setVisible(true);
        txtFilename = d.getFile();
        bContinue = true;
        */

        JFileChooser fc = new JFileChooser();
        fc.addChoosableFileFilter(new HyperFilter());
        fc.setCurrentDirectory(new File("."));
        int returnVal = fc.showOpenDialog((Frame)this.getParent()); //, resources.getString("dlgOpen"));

        if (returnVal != JFileChooser.APPROVE_OPTION)
            return;

        File file = fc.getSelectedFile();
        String txtOldFilename = txtFilename;
        if (file != null)
            txtFilename = file.getName();

        if (!openDocument())
            txtFilename = txtOldFilename;

        setTitle();

        /*
        if (!bContinue)
            return;

        if (bChanged)
            if (!showHasChangedDialog())
            {
                txtFilename = txtOldFilename;
                return;
            }


        if (!openDocument())
            txtFilename = txtOldFilename;
        */
    }

    void file_save_as()
    {
        /*String txtOldFilename = txtFilename;
        txtFilename = "";
        final Dialog d = new Dialog((Frame)this.getParent(), resources.getString("dlgSaveAs"), true);
        d.setSize(400, 100);
        centerWindow(d);
        d.addWindowListener(new WindowListener()
        {
            public void windowClosing(WindowEvent e)
            {
                d.setVisible(false);
            }
            public void windowClosed(WindowEvent e) {}
            public void windowActivated(WindowEvent e) {}
            public void windowDeactivated(WindowEvent e) {}
            public void windowIconified(WindowEvent e) {}
            public void windowDeiconified(WindowEvent e) {}
            public void windowOpened(WindowEvent e) {}
            });

            d.add("North", new Label(resources.getString("EnterName")));

        final TextField tf = new TextField(txtFilename, 1);
        d.add("Center", tf);

        final Button btnSave = new Button(resources.getString("btnSave"));
        btnSave.addActionListener(new ActionListener()
                { public void actionPerformed(ActionEvent e){
                    txtFilename = tf.getText();
                    bContinue = true;
                    d.setVisible(false);
                }});
        final Button btnCancel = new Button(resources.getString("btnCancel"));
        btnCancel.addActionListener(new ActionListener()
                { public void actionPerformed(ActionEvent e){
                    bContinue = false;
                    d.setVisible(false);
                }});
        Panel p = new Panel();
        p.add(btnSave);
        p.add(btnCancel);
        d.add("South", p);

        d.setVisible(true);
        if (!bContinue)
            return;
        */

        JFileChooser fc = new JFileChooser();
        fc.addChoosableFileFilter(new HyperFilter());
        fc.setCurrentDirectory(new File("."));
        //fc.setApproveButtonText(resources.getString("btnSave"));
        //fc.setDialogTitle(resources.getString("dlgSave"));
        int returnVal = fc.showSaveDialog((Frame)this.getParent());   //, resources.getString("dlgSave"));

        if (returnVal != JFileChooser.APPROVE_OPTION)
            return;

        File file = fc.getSelectedFile();
        String txtOldFilename = txtFilename;
        if (file != null)
        {
            txtFilename = file.getName();

            if (!(new HyperFilter()).accept(new File(txtFilename)))
                txtFilename = txtFilename + ".hpr";
        }

        if ((new File(txtFilename)).exists())
        {
            final Dialog d2 = new Dialog((Frame)this.getParent(), resources.getString("AppName"), true);
            d2.setSize(400, 100);
            centerWindow(d2);

            Button b1 = new Button(resources.getString("btnYes"));
            b1.setSize(70, 50);
            b1.addActionListener(new ActionListener()
            { public void actionPerformed(ActionEvent e){
                bContinue = true;
                d2.setVisible(false);
            }});

            Button b2 = new Button(resources.getString("btnNo"));
            b2.setSize(70, 50);
            b2.addActionListener(new ActionListener()
            { public void actionPerformed(ActionEvent e){
                bContinue = false;
                d2.setVisible(false);
            }});

            d2.add("North", new Label(resources.getString("FileAlreadyExists")));
            Panel p2 = new Panel();
            p2.add(b1);
            p2.add(b2);

            d2.add("South", p2);
            d2.setVisible(true);

            if (!bContinue)
            {
                txtFilename = txtOldFilename;
                return;
            }
        }

        if (!saveDocument())
            txtFilename = txtOldFilename;

        setTitle();
    }

    void file_save()
    {
        if (txtFilename == "")
            file_save_as();
        else
            saveDocument();
    }

    boolean openDocument()
    {
        try
        {
            FileInputStream fis = new FileInputStream(txtFilename);
            ObjectInputStream ois = new ObjectInputStream(fis);
            //space = (new Space(0.0)).read(ois);
            space = (Space) ois.readObject();
        }
        catch (Exception e)
        {
            final Dialog d2 = new Dialog((Frame)this.getParent(), resources.getString("AppName"), true);
            d2.setSize(400, 100);
            centerWindow(d2);

            Button b = new Button(resources.getString("btnOK"));
            b.setSize(70, 50);
            b.addActionListener(new ActionListener()
            { public void actionPerformed(ActionEvent e){
                d2.setVisible(false);
            }});

            d2.add("North", new Label(resources.getString("UnableToReadFile")));
            Panel p2 = new Panel();
            p2.add(b);
            d2.add("South", p2);
            d2.setVisible(true);
            return false;
        }

        space.changeCurvature(0.1 * (value = (int) (10 * space.getCurvature())));
        if (slider != null)
            slider.setValue(value);

        repaint();
        bChanged = false;
        return true;
    }

    boolean saveDocument()
    {
        try
        {
            FileOutputStream fos = new FileOutputStream(txtFilename); 
            ObjectOutputStream oos = new ObjectOutputStream(fos);
        
            oos.writeObject(space);
            //space.write(oos);
            oos.flush();
            bChanged = false;
        }
        catch (Exception exception)
        {
            final Dialog d2 = new Dialog((Frame)this.getParent(), resources.getString("AppName"), true);
            d2.setSize(400, 100);
            centerWindow(d2);

            Button b = new Button(resources.getString("btnOK"));
            b.setSize(70, 50);
            b.addActionListener(new ActionListener()
            { public void actionPerformed(ActionEvent e){
                d2.setVisible(false);
            }});

            d2.add("North", new Label(resources.getString("UnableToWriteFile")));
            Panel p2 = new Panel();
            p2.add(b);
            d2.add("South", p2);
            d2.setVisible(true);
            return false;
        }

        return true;
    }
        
    void edit_curvature()
    {
        if (curvdlg == null)
        {
            curvdlg = new Dialog((Frame)this.getParent(), resources.getString("dlgCurvature"), false);

            curvdlg.addWindowListener(new WindowListener()
            {
                public void windowClosing(WindowEvent e)
                {
                    curvdlg.setVisible(false);
                }
                public void windowClosed(WindowEvent e) {}
                public void windowActivated(WindowEvent e) {}
                public void windowDeactivated(WindowEvent e) {}
                public void windowIconified(WindowEvent e) {}
                public void windowDeiconified(WindowEvent e) {}
                public void windowOpened(WindowEvent e) {}
            });

            slider = new JSlider(JSlider.HORIZONTAL, -20, 20, 0);
            slider.addChangeListener(this);
            slider.setMajorTickSpacing(10);
            slider.setMinorTickSpacing(1);
            slider.setPaintTicks(true);
            slider.setPaintLabels(true);
            slider.setSize(400, 50);
            slider.setValue(value);
            slider.addKeyListener(new KeyListener()
            {
                public void keyPressed(KeyEvent e)
                {
                    switch(e.getKeyCode())
                    {
                        case KeyEvent.VK_F5:
                            slider.setValue(slider.getValue() - 1);
                            break;
                        case KeyEvent.VK_F6:
                            slider.setValue(slider.getValue() + 1);
                            break;
                    }
                }
                public void keyTyped(KeyEvent e) {  }
                public void keyReleased(KeyEvent e)
                {
                }
            });


            curvdlg.add("North", slider);

            curvdlg.setSize(400, 70);
            centerWindow(curvdlg);
            curvdlg.setLocation(new java.awt.Point(400, 0));
        }

        curvdlg.setVisible(true);
    }

    void help_intructions()
    {
        final Dialog d = new Dialog((Frame)this.getParent(), resources.getString("dlgInstructions"), true);
        TextArea t = new TextArea(resources.getString("Info"), 20, 80, TextArea.SCROLLBARS_VERTICAL_ONLY);
        t.setEditable(false);

        d.add("North", t);

        final Button b = new Button(resources.getString("btnOK"));

        b.addActionListener(new ActionListener()
                                    {
                                        public void actionPerformed(ActionEvent e)
                                        {
                                            d.setVisible(false);
                                        }
                                    }
                              );
        Panel p = new Panel();
        p.add("Center", b);
        d.add("South", p);
        d.setSize(400, 400);
        d.setResizable(false);
        centerWindow(d);

        d.addWindowListener(new WindowListener()
        {
            public void windowClosing(WindowEvent e)
            {
                d.setVisible(false);
            }
                public void windowClosed(WindowEvent e) {}
                public void windowActivated(WindowEvent e) {}
                public void windowDeactivated(WindowEvent e) {}
                public void windowIconified(WindowEvent e) {}
                public void windowDeiconified(WindowEvent e) {}
                public void windowOpened(WindowEvent e) {}
        });


        t.addKeyListener(new KeyListener()
        {
            public void keyPressed(KeyEvent e)
            {
                        b.requestFocus();

            }
            public void keyTyped(KeyEvent e) {  }
            public void keyReleased(KeyEvent e) { }
            {
            }
        });

        d.setVisible(true);
    }


    void edit_reset_curvature()
    {
        value = 0;
        if (slider != null)
            slider.setValue(value);

        space.changeCurvature(0.1 * value);
        repaint();
        bChanged = true;
    }

    public void actionPerformed(ActionEvent e)
    {
        String s = e.getActionCommand();
        if (s == resources.getString("mnuCurvature"))
            edit_curvature();

        if (s == resources.getString("mnuNew"))
            file_new();

        if (s == resources.getString("mnuOpen"))
            file_open();

        if (s == resources.getString("mnuSave"))
        {
            file_save();
        }

        if (s == resources.getString("mnuSaveAs"))
            file_save_as();

        if (s == resources.getString("mnuExit"))
        {
            file_exit();
        }

        if (s == resources.getString("mnuInstructions"))
            help_intructions();

        if (s == resources.getString("mnuResetCurvature"))
            edit_reset_curvature();

    }

    public void drawPoints()
    {
        if (bADown)
            new Point(space, new Length(0.001), new Angle(0));

        if (bQDown)
            new Point(space, drawingDist, new Angle(0));

        if (bZDown || bXDown || bCDown)
        {
            for (Iterator i = space.getElementIterator(); i.hasNext(); )
            {
                Element e = (Element) i.next();

                if (bCDown)
                {
                    try
                    {
                        Point p = (Point) e;
                    }
                    catch (Exception exception)
                    {
                        continue;
                    }
                }
                
                if (e.withinRadius(new Length(bXDown ? 0.6 : 0.2)))
                    i.remove();
            }
        }

    }

    public void calculateSpeed()
    {
        double as = Math.PI / 32;
        double ls = 0.25;

        if (bShiftDown)
        {
            as *= 0.5;
            ls *= 0.5;
        }

        if (bControlDown)
        {
            as *= 0.25;
            ls *= 0.25;
        }
        linearSpeed = new Length(ls);
        angularSpeed = new Angle(as);
    }

    public void stateChanged(ChangeEvent e)
    {
        value = (int) slider.getValue();
        space.changeCurvature(0.1 * value);
        repaint();
        bChanged = true;
    }

    public void keyPressed(KeyEvent e)
    {
        int c = e.getKeyCode();
        switch (c)
        {
            case KeyEvent.VK_PAGE_UP:
                drawingDist = new Length(drawingDist.l * (1 + (bShiftDown ? 0.5 : 1) * (bControlDown ? 0.25 : 1) * 0.2));
                if (bQDown)
                    new Point(space, drawingDist, new Angle(0));
                repaint();
                //bChanged = true;
                break;
            case KeyEvent.VK_PAGE_DOWN:
                drawingDist = new Length(drawingDist.l / (1 + (bShiftDown ? 0.5 : 1) * (bControlDown ? 0.25 : 1) * 0.2));
                if (bQDown)
                    new Point(space, drawingDist, new Angle(0));
                repaint();
                //bChanged = true;
                break;
            case KeyEvent.VK_INSERT:
                drawingDist = Length.neg(drawingDist);
                if (bQDown)
                    new Point(space, drawingDist, new Angle(0));
                repaint();
                //bChanged = true;
                break;
            case KeyEvent.VK_F1:
                help_intructions();
                break;
            case KeyEvent.VK_F2:
                file_save();
                break;
            //case KeyEvent.VK_F10:
            //    mode3d = !mode3d;
            //    repaint();
            //    break;
            case KeyEvent.VK_F5:
                value--;
                if(value < -20)
                    value=-20;

                //if (slider != null)
                  //  slider.setValue(value);
                if (slider != null)
                    slider.setValue(value);

                space.changeCurvature(0.1 * value);
                repaint();
                bChanged = true;
                break;
            case KeyEvent.VK_F6:
                value++;
                if(value > 20)
                    value=20;

                if (slider != null)
                    slider.setValue(value);

                space.changeCurvature(0.1 * value);
                repaint();
                bChanged = true;
                break;
            case KeyEvent.VK_F8:
                edit_reset_curvature();
                break;
            case KeyEvent.VK_LEFT:
                space.rotate(Angle.neg(angularSpeed));
                drawPoints();
                repaint();
                //bChanged = true;
                break;
            case KeyEvent.VK_RIGHT:
                space.rotate(angularSpeed);
                drawPoints();
                repaint();
                //bChanged = true;
                break;
            case KeyEvent.VK_UP:
                if (value <= 0)
                    space.moveforward(linearSpeed);
                else
                    space.moveforward(Length.neg(linearSpeed));

                drawPoints();
                repaint();
                //bChanged = true;
                break;
            case KeyEvent.VK_DOWN:
                if (value <= 0)
                    space.moveforward(Length.neg(linearSpeed));
                else
                    space.moveforward(linearSpeed);
                drawPoints();
                repaint();
                //bChanged = true;
                break;
            case KeyEvent.VK_V:
                //new Line(space, new Length(0.00001), new Angle(Math.PI / 2 + 0.00001));
                repaint();
                bChanged = true;
                break;
            case KeyEvent.VK_Q:
                bQDown = true;
                drawPoints();
                repaint();
                bChanged = true;
                break;
            case KeyEvent.VK_A:
                bADown = true;
                drawPoints();
                repaint();
                bChanged = true;
                break;
            case KeyEvent.VK_W:
                //new Circle(space, new Length(0.00001), new Angle(0.00001), drawingDist);
                repaint();
                bChanged = true;
                break;
            case KeyEvent.VK_S:
                //new Circle(space, drawingDist, new Angle(0.00001), drawingDist);
                repaint();
                bChanged = true;
                break;
            case KeyEvent.VK_R:
                //new EquidistantCurve(space, new Length(0.00001), new Angle(0.00001), drawingDist);
                repaint();
                bChanged = true;
                break;
            case KeyEvent.VK_F:
                //new EquidistantCurve(space, drawingDist, new Angle(0.00001), Length.neg(drawingDist));
                repaint();
                bChanged = true;
                break;
            case KeyEvent.VK_T:
                //new Line(space, drawingDist, new Angle(0.00001));
                repaint();
                bChanged = true;
                break;
            case KeyEvent.VK_G:
                //new Line(space, new Length(0.00001), new Angle(0.00001));
                repaint();
                bChanged = true;
                break;
            case KeyEvent.VK_Z:
                bZDown = true;
                drawPoints();
                repaint();
                bChanged = true;
                break;
            case KeyEvent.VK_X:
                bXDown = true;
                drawPoints();
                repaint();
                bChanged = true;
                break;
            case KeyEvent.VK_C:
                bCDown = true;
                drawPoints();
                repaint();
                bChanged = true;
                break;


            case KeyEvent.VK_O:
                magnification /= (1 + (bShiftDown ? 0.5 : 1) * (bControlDown ? 0.25 : 1) * 0.2);
                repaint();
                break;
            case KeyEvent.VK_P:
                magnification *= (1 + (bShiftDown ? 0.5 : 1) * (bControlDown ? 0.25 : 1) * 0.2);
                repaint();
                break;
            case KeyEvent.VK_SHIFT:
                bShiftDown = true;
                calculateSpeed();
                break;
            case KeyEvent.VK_CONTROL:
                bControlDown = true;
                calculateSpeed();
                break;
        }
    }

    public void keyTyped(KeyEvent e) {  }
    public void keyReleased(KeyEvent e)
    {
        int c = e.getKeyCode();
        switch (c)
        {
            case KeyEvent.VK_Q:
                bQDown = false;
                break;
            case KeyEvent.VK_A:
                bADown = false;
                break;
            case KeyEvent.VK_Z:
                bZDown = false;
                break;
            case KeyEvent.VK_X:
                bXDown = false;
                break;
            case KeyEvent.VK_C:
                bCDown = false;
                break;
            case KeyEvent.VK_SHIFT:
                bShiftDown = false;
                calculateSpeed();
                break;
            case KeyEvent.VK_CONTROL:
                bControlDown = false;
                calculateSpeed();
                break;
        }
    }

    public void windowClosing(WindowEvent e)
    {
        file_exit();
    }
    public void windowClosed(WindowEvent e) {}
    public void windowActivated(WindowEvent e) {}
    public void windowDeactivated(WindowEvent e) {}
    public void windowIconified(WindowEvent e) {}
    public void windowDeiconified(WindowEvent e) {}
    public void windowOpened(WindowEvent e) {}

    public void paint(Graphics g)
    {
        Insets insets = getInsets();
        int currentWidth = getWidth() - insets.left - insets.right;
        int currentHeight = getHeight() - insets.top - insets.bottom;

        int cx = currentWidth /*getSize().width*/ / 2;
        int cy = currentHeight /*getSize().height*/ / 2;

        Graphics2D g2 = (Graphics2D) g;
        calculateTransform();
        g2.setTransform(transform);
        //g.setColor(new java.awt.Color(0, 0, 0));
        //g.fillRect(0, 0, 2 * cx, 2 * cy);

        //if (!mode3d)
        //{
            g2.setPaint(new java.awt.Color(100, 100, 0));
            g2.setStroke(new BasicStroke(0.01f));

            space.draw(g2);

            g2.setPaint(new java.awt.Color(100, 0, 0));
            g2.draw(new Ellipse2D.Double(-0.25, -0.25, 0.5, 0.5));
            //g2.drawLine(cx, cy - 4, cx, cy - 6);

            g2.setPaint(new java.awt.Color(0, 0, 200));
            g2.draw(new Ellipse2D.Double(-0.25, -0.25 - drawingDist.l, 0.5, 0.5));
            
        /*}
        else
        {
            int x, y, wx, wy;
            int red, green, blue;
            double dist, dist2, a_vert, a_horz, a_cut;
            Point p;

            int pixels[] = new int[getSize().width * getSize().height];
            int index = 0;

            for (wy = 0, y = -cy; wy < getSize().height; wy++, y++)
            {
                for (wx = 0, x = -cx; wx < getSize().width; wx++, x++)
                {
                    a_vert = Math.atan( y / (double) cy);
                    a_horz = Math.atan( x / (double) cx);

                    if (y != 0)
                        dist = space.trig.adj_from_sra(1.0, Math.abs(a_vert));
                    else
                        dist = 10000.0;

                    red=0;
                    green=0;
                    blue = Math.min(255, (int) (255.0 / (dist * dist)));

                                                         
                    for (p = space.getFirst(); p != null; p = p.getNext())
                    {
                        dist2 = p.getDistance();
                        if (dist2 < 0.005)
                            continue;

                        a_cut = Math.asin(space.trig.sigma(radius)/space.trig.sigma(Math.abs(dist2)));


                        if (Math.abs(a_horz - p.getAngle()) < a_cut && Math.abs(dist2) < dist)
                        {
                            dist = Math.abs(dist2);

                            red=0;
                            blue=0;
                            green = Math.min(255, (int) (255.0 / (dist * dist)));
                        }
                    }                                      
                    pixels[index++] = (255 << 24) | (red << 16) | (green << 8) | blue;
                }
            }

            Image img = createImage(new MemoryImageSource(getSize().width, getSize().height, pixels, 0, getSize().width));

            g.drawImage(img, 0, 0, this);
        } */
    }

    public boolean imageUpdate(java.awt.Image i , int info, int x, int y, int w, int h)
    {
        return true;
    }

    private void calculateTransform()
    {
        Insets insets = getInsets();
        int currentWidth = getWidth() - insets.left - insets.right;
        int currentHeight = getHeight() - insets.top - insets.bottom;

        int cx = currentWidth /*getSize().width*/ / 2;
        int cy = currentHeight /*getSize().height*/ / 2;
        transform = new AffineTransform(cx * magnification, 0, 0, cy * magnification, cx, cy);
    }

    public void mousePressed(MouseEvent e)
    {
        Insets insets = getInsets();
        int currentWidth = getWidth() - insets.left - insets.right;
        int currentHeight = getHeight() - insets.top - insets.bottom;

        int cx = currentWidth / 2;
        int cy = currentHeight / 2;

        calculateTransform();
        int x = e.getX();
        int y = e.getY();

        //x = x - cx;
        //y = y - cy;
        Point2D src = new Point2D.Double(x, y);
        Point2D dst = new Point2D.Double(0, 0);
        try
        {
            dst = transform.inverseTransform(src, null);
        }
        catch(Exception ex)
        {
        }

        double ang = Math.atan2(dst.getX(), dst.getY());
        double r = Math.sqrt(dst.getX()*dst.getX()+dst.getY()*dst.getY());
        //System.out.println("a:" + ang);

        new Point(space, new Length(r), new Angle(-ang + Math.PI));
        repaint();
    }

    public void mouseReleased(MouseEvent e) {}

    public void mouseEntered(MouseEvent e) {}

    public void mouseExited(MouseEvent e) {}

    public void mouseClicked(MouseEvent e){}

    public void mouseDragged(MouseEvent e) 
    {
        mousePressed(e);
    }

    public void mouseMoved(MouseEvent e) {}

    public static void main(String args[]) {
        Frame f = new Frame("");
        Hyper a;
        if (args.length == 0)
            a = new Hyper();
        else
            a = new Hyper(args[0]);

        f.addWindowListener(a);
        a.addKeyListener(a);
        a.addMouseListener(a);
        a.addMouseMotionListener(a);

        a.setBackground(new Color(0, 0, 0));

        MenuBar mb = new MenuBar();
        Menu m1 = new Menu(resources.getString("mnuFile"));

        MenuItem newDoc = new MenuItem(resources.getString("mnuNew"));
        newDoc.addActionListener(a);
        m1.add(newDoc);

        MenuItem open = new MenuItem(resources.getString("mnuOpen"));
        open.addActionListener(a);
        m1.add(open);

        MenuItem save = new MenuItem(resources.getString("mnuSave"));
        save.addActionListener(a);
        m1.add(save);

        MenuItem saveAs = new MenuItem(resources.getString("mnuSaveAs"));
        saveAs.addActionListener(a);
        m1.add(saveAs);

        m1.addSeparator();

        MenuItem exit = new MenuItem(resources.getString("mnuExit"));
        exit.addActionListener(a);
        m1.add(exit);

        Menu m2 = new Menu(resources.getString("mnuEdit"));
        MenuItem curvature = new MenuItem(resources.getString("mnuCurvature"));
        curvature.addActionListener(a);
        m2.add(curvature);

        MenuItem resetCurvature = new MenuItem(resources.getString("mnuResetCurvature"));
        resetCurvature.addActionListener(a);
        m2.add(resetCurvature);
                                                  
        Menu m3 = new Menu(resources.getString("mnuHelp"));
        MenuItem instr = new MenuItem(resources.getString("mnuInstructions"));
        instr.addActionListener(a);
        m3.add(instr);
        mb.add(m1);
        mb.add(m2);
        mb.add(m3);
        mb.setHelpMenu(m3);
        f.setMenuBar(mb);

        f.add("Center", a);
        a.setTitle();

        f.setSize(300, 300);
        centerWindow(f);

        f.setVisible(true);
    }
}

class HyperFilter extends javax.swing.filechooser.FileFilter
{
    public boolean accept(File f)
    {
        if (f.isDirectory())
            return true;

        String name = f.getName();
        String ext = null;
        int i = name.lastIndexOf('.');

        if (i > 0 &&  i < name.length() - 1)
            ext = name.substring(i+1).toLowerCase();

        if (ext != null)
            return ext.equals("hpr");
        else
            return false;
    }

    public String getDescription()
    {
        return "Hyper Files (*.hpr)";
    }
} 

