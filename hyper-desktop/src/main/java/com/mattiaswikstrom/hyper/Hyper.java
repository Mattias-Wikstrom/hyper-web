package com.mattiaswikstrom.hyper;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.stage.Modality;
import javafx.stage.Stage;
import javafx.application.Platform;
import javafx.scene.input.KeyCode;
import javafx.scene.control.DialogPane;
import javafx.scene.control.Menu;
import javafx.scene.control.MenuBar;
import javafx.scene.control.MenuItem;
import javafx.scene.input.KeyEvent;
import javafx.scene.layout.BorderPane;
import javafx.scene.transform.Affine;
import javafx.scene.canvas.Canvas;
import javafx.geometry.Insets;
import javafx.scene.canvas.GraphicsContext;
import javafx.stage.FileChooser;
import javafx.stage.Screen;
import javafx.geometry.Point2D;
import javafx.scene.input.KeyCombination;
import javafx.stage.StageStyle;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.File;
import java.io.IOException;

import java.util.Locale;
import java.util.Iterator;
import java.util.ResourceBundle;

public class Hyper extends Application
{ 
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

    public static void main(String args[]) {
        launch(args);
    }

    Stage primaryStage;
    Canvas canvas;

    @Override
    public void start(Stage primaryStage) {
        this.primaryStage = primaryStage;

        // Create a BorderPane as the root layout
        BorderPane root = new BorderPane();

        canvas = new Canvas(400, 400);
        //root.getChildren().add(canvas);
        
        // Menu Bar
        MenuBar menuBar = new MenuBar();

        // Menu 1: File
        Menu fileMenu = new Menu("File");
        MenuItem newDoc = new MenuItem("New");
        newDoc.setOnAction(e -> file_new()); // Handle New action
        newDoc.setAccelerator(KeyCombination.keyCombination("Ctrl+N"));
        fileMenu.getItems().add(newDoc);

        MenuItem open = new MenuItem("Open");
        open.setOnAction(e -> file_open());
        open.setAccelerator(KeyCombination.keyCombination("Ctrl+O"));
        fileMenu.getItems().add(open);

        MenuItem save = new MenuItem("Save");
        save.setOnAction(e -> file_save());
        save.setAccelerator(KeyCombination.keyCombination("F2"));
        fileMenu.getItems().add(save);

        MenuItem saveAs = new MenuItem("Save As");
        saveAs.setOnAction(e -> file_save_as());
        fileMenu.getItems().add(saveAs);

        fileMenu.getItems().add(new javafx.scene.control.SeparatorMenuItem());

        MenuItem exit = new MenuItem("Exit");
        exit.setOnAction(e -> file_exit());
        //exit.setAccelerator(KeyCombination.keyCombination("Ctrl+Q"));
        fileMenu.getItems().add(exit);

        Menu editMenu = new Menu("Edit");
        MenuItem curvature = new MenuItem("Curvature");
        curvature.setOnAction(e -> edit_curvature());
        editMenu.getItems().add(curvature);

        MenuItem resetCurvature = new MenuItem("Reset Curvature");
        resetCurvature.setOnAction(e -> edit_reset_curvature());
        editMenu.getItems().add(resetCurvature);

        Menu helpMenu = new Menu("Help");
        MenuItem instructions = new MenuItem("Instructions");
        instructions.setOnAction(e -> help_intructions());
        instructions.setAccelerator(KeyCombination.keyCombination("F1"));
        helpMenu.getItems().add(instructions);

        menuBar.getMenus().add(fileMenu);
        menuBar.getMenus().add(editMenu);
        menuBar.getMenus().add(helpMenu);

        root.setTop(menuBar);

        root.setBottom(canvas);

        canvas.widthProperty().bind(root.widthProperty());
        canvas.heightProperty().bind(root.heightProperty());
        canvas.widthProperty().addListener((obs, oldVal, newVal) -> repaint());
        canvas.heightProperty().addListener((obs, oldVal, newVal) -> repaint());

        canvas.setFocusTraversable(true);

        canvas.setOnKeyPressed(this::onKeyPressed);
        canvas.setOnKeyReleased(this::onKeyReleased);

        root.setOnMousePressed(e -> onMousePressed(e));
        root.setOnMouseMoved(e -> onMouseMoved(e));

        primaryStage.setOnCloseRequest(event -> {
            file_exit();
        });

        Scene scene = new Scene(root, 400, 400);
        primaryStage.setTitle("Hyper");
        primaryStage.setScene(scene);

        centerWindow(primaryStage);

        primaryStage.show();
        repaint();
    }
 
    private void centerWindow(Stage stage) {
        // Center the window on the screen
        stage.setX((Screen.getPrimary().getVisualBounds().getWidth() - stage.getWidth()) / 2);
        stage.setY((Screen.getPrimary().getVisualBounds().getHeight() - stage.getHeight()) / 2);
    }

    static ResourceBundle resources = ResourceBundle.getBundle("com.mattiaswikstrom.hyper.HyperResources", Locale.US);

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

    private Stage curvdlg;
    private javafx.scene.control.Slider slider;

    private Affine transform;

    private int value = 0;

    private void setTitle()
    {
        String title;
        if (txtFilename == "")
            title = resources.getString("AppName");
        else
            title = txtFilename + " - " + resources.getString("AppName");

        primaryStage.setTitle(title);
    }

    boolean bContinue;
    
    boolean showHasChangedDialog()
    {
        Stage dialog = new Stage();

        dialog.initOwner(primaryStage);
        dialog.initModality(Modality.APPLICATION_MODAL);
        dialog.setTitle("Hyper");

        //dialog.initStyle(StageStyle.UTILITY);
        dialog.setResizable(false);

        javafx.scene.control.Label label = new javafx.scene.control.Label("Save changes?");
        
        javafx.scene.control.Button btnYes = new javafx.scene.control.Button("Yes");
        btnYes.setDefaultButton(true);

        btnYes.setOnAction(e -> {
            file_save();
            bContinue = true;
            dialog.close();
        });

        javafx.scene.control.Button btnNo = new javafx.scene.control.Button("No");
        btnNo.setOnAction(e -> {
            bContinue = true;
            dialog.close();
        });

        javafx.scene.control.Button btnCancel = new javafx.scene.control.Button("Cancel");
        btnCancel.setOnAction(e -> {
            bContinue = false;
            dialog.close();
        });

        HBox buttonBox = new HBox(10, btnYes, btnNo, btnCancel);
        VBox layout = new VBox(10, label, buttonBox);
        layout.setStyle("-fx-padding: 10; -fx-alignment: center;");
        
        Scene dialogScene = new Scene(layout, 180, 80);
        dialog.setScene(dialogScene);

        dialog.setOnCloseRequest((javafx.stage.WindowEvent e) -> dialog.close());

        dialog.showAndWait();

        return bContinue;
    }

    void file_exit()
    {
        if (bChanged)
            if (!showHasChangedDialog())
                return;

        primaryStage.hide();
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
        FileChooser fc = new FileChooser();
        FileChooser.ExtensionFilter filter = new FileChooser.ExtensionFilter("Hyper Files", "*.hpr");
        fc.getExtensionFilters().add(filter);

        fc.setInitialDirectory(new File("."));

        fc.setTitle("Open");

        File file = fc.showOpenDialog(primaryStage); //, resources.getString("dlgOpen"));

        if (file == null)
            return;

        String txtOldFilename = txtFilename;
        if (file != null)
            txtFilename = file.getName();

        if (!openDocument())
            txtFilename = txtOldFilename;

        setTitle();
    }

    void file_save_as()
    {
        FileChooser fc = new FileChooser();
        FileChooser.ExtensionFilter filter = new FileChooser.ExtensionFilter("Hyper Files", "*.hpr");
        fc.getExtensionFilters().add(filter);
        fc.setInitialDirectory(new File("."));
        fc.setTitle("Save as");
        //fc.setApproveButtonText(resources.getString("btnSave"));
        //fc.setDialogTitle(resources.getString("dlgSave"));
        File file = fc.showSaveDialog(primaryStage);   //, resources.getString("dlgSave"));

        if (file == null)
            return;

        String txtOldFilename = txtFilename;

        if (file != null)
        {
            txtFilename = file.getName();

            if (!(new HyperFilter()).accept(new File(txtFilename)))
                txtFilename = txtFilename + ".hpr";
        }

        /*if ((new File(txtFilename)).exists())
        {
            Stage dialog = new Stage();
            dialog.setTitle("Hyper");
            dialog.setResizable(false);

            // Set dialog modality (modal dialog, similar to AWT's modal)
            dialog.initModality(Modality.APPLICATION_MODAL);

            javafx.scene.control.Label label = new javafx.scene.control.Label("File already exists");

            javafx.scene.control.Button yesButton = new javafx.scene.control.Button("Yes");
            javafx.scene.control.Button noButton = new javafx.scene.control.Button("No");

            // Button actions
            yesButton.setOnAction(ev -> {
                bContinue = true;
                dialog.close();
            });

            noButton.setOnAction(ev -> {
                bContinue = false;
                dialog.close();
            });

            // Layout: Using HBox to place buttons horizontally (equivalent to "South" in AWT code)
            HBox buttonLayout = new HBox(10);  // 10px spacing between buttons
            buttonLayout.getChildren().addAll(yesButton, noButton);

            // Dialog layout: VBox for label and buttons
            VBox dialogLayout = new VBox(10);
            dialogLayout.getChildren().addAll(label, buttonLayout);

            // Set the dialog size (400x200 equivalent)
            dialog.setWidth(400);
            dialog.setHeight(200);

            // Set the dialog position (optional)
            dialog.setX(400); // Adjust to position it as per your requirement
            dialog.setY(100); // Adjust Y-coordinate if needed

            System.out.println("Before showAndWait");
            // Show the dialog and wait until it is closed
            dialog.showAndWait();
            System.out.println("After showAndWait");
        }*/

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
            Stage dialog = new Stage();

            dialog.initOwner(primaryStage);
            dialog.initModality(Modality.APPLICATION_MODAL);
            dialog.setTitle("Hyper");

            dialog.setResizable(false);

            javafx.scene.control.Label label = new javafx.scene.control.Label("Unable to read file.");
            
            javafx.scene.control.Button btnOK = new javafx.scene.control.Button("OK");
            btnOK.setDefaultButton(true);

            btnOK.setOnAction(e2 -> {
                dialog.close();
            });

            HBox buttonBox = new HBox(10, btnOK);
            buttonBox.setStyle("-fx-alignment: center;");

            VBox layout = new VBox(10, label, buttonBox);
            layout.setStyle("-fx-padding: 10; -fx-alignment: center;");
            
            Scene dialogScene = new Scene(layout, 180, 80);
            dialog.setScene(dialogScene);

            dialog.setOnCloseRequest((javafx.stage.WindowEvent e2) -> dialog.close());

            dialog.showAndWait();

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
            Stage dialog = new Stage();

            dialog.initOwner(primaryStage);
            dialog.initModality(Modality.APPLICATION_MODAL);
            dialog.setTitle("Hyper");

            dialog.setResizable(false);

            javafx.scene.control.Label label = new javafx.scene.control.Label("Unable to write file.");
            
            javafx.scene.control.Button btnOK = new javafx.scene.control.Button("OK");
            btnOK.setDefaultButton(true);

            btnOK.setOnAction(e2 -> {
                dialog.close();
            });

            HBox buttonBox = new HBox(10, btnOK);
            buttonBox.setStyle("-fx-alignment: center;");

            VBox layout = new VBox(10, label, buttonBox);
            layout.setStyle("-fx-padding: 10; -fx-alignment: center;");
            
            Scene dialogScene = new Scene(layout, 180, 80);
            dialog.setScene(dialogScene);

            dialog.setOnCloseRequest((javafx.stage.WindowEvent e2) -> dialog.close());

            dialog.showAndWait();

            return false;
        }

        return true;
    }

    private double xPos;
    private double yPos;

    void edit_curvature()
    {
        if (curvdlg == null)
        {     
            slider = new javafx.scene.control.Slider(-20, 20, 0); // min, max, initial value
            slider.setMajorTickUnit(10);
            slider.setMinorTickCount(1);
            slider.setShowTickMarks(true);
            slider.setShowTickLabels(true);
            slider.setBlockIncrement(1);
            slider.setPrefWidth(400);  // Set width of the slider
            
            // Handle slider value changes
            slider.valueProperty().addListener((obs, oldValue, newValue) -> {
                // Update the value when the slider moves (if needed)
                value = newValue.intValue();

                stateChanged();

                bChanged = true;
            });

            // Handle key events
            slider.setOnKeyPressed(event -> {
                if (event.getCode() == KeyCode.F5) {
                    slider.setValue(slider.getValue() - 1);
                } else if (event.getCode() == KeyCode.F6) {
                    slider.setValue(slider.getValue() + 1);
                }
            });

            // Create a VBox layout to hold the slider
            VBox layout = new VBox(10);  // 10px gap between components
            layout.getChildren().add(slider);

            // Create a new stage (Dialog)
            curvdlg = new Stage();
            curvdlg.setTitle("Curvature");
            curvdlg.setResizable(false);

            // Handle window closing event
            curvdlg.setOnCloseRequest((javafx.stage.WindowEvent e) -> {
                e.consume();
                
                xPos = curvdlg.getX();  // Store the X position
                yPos = curvdlg.getY();  // Store the Y position
                
                curvdlg.hide();
            });

            // Set the size and position of the window
            curvdlg.setWidth(400);
            curvdlg.setHeight(140);
            curvdlg.setX(400);  // X-position on screen
            curvdlg.setY(400);  // Y-position on screen

            // Create the scene and set it on the stage
            Scene scene = new Scene(layout);
            curvdlg.setScene(scene);
            
            curvdlg.show();
        }
        else if (!curvdlg.isShowing())
        {
            Platform.runLater(() -> {
                curvdlg.show();
                curvdlg.setX(xPos); // Restore X position
                curvdlg.setY(yPos); // Restore Y position
            });
        }
    }

    void help_intructions()
    {
        Stage dialog = new Stage();
        
        dialog.initOwner(primaryStage);
        dialog.initModality(Modality.APPLICATION_MODAL);

        javafx.scene.control.TextArea t = new javafx.scene.control.TextArea(resources.getString("Info"));
        t.setWrapText(true);
        t.setEditable(false);
        t.setPrefSize(800, 500);

        javafx.scene.control.Button b = new javafx.scene.control.Button("OK");
        b.setOnAction(e -> dialog.close());
        b.setDefaultButton(true);
        
        HBox buttonBox = new HBox();
        buttonBox.setAlignment(javafx.geometry.Pos.CENTER);
        buttonBox.getChildren().add(b);
        buttonBox.setPadding(new javafx.geometry.Insets(0, 0, 20, 0)); // Adds 20px of space below the button

        VBox vbox = new VBox(10);
        vbox.getChildren().addAll(t, buttonBox);

        Scene scene = new Scene(vbox, 800, 500);

        dialog.setTitle("Instructions");
        dialog.setScene(scene);
        dialog.setResizable(false);

        dialog.setOnCloseRequest((javafx.stage.WindowEvent we) -> {
            dialog.close();
        });

        dialog.show();
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

    public void stateChanged()
    {
        value = (int) slider.getValue();
        space.changeCurvature(0.1 * value);
        repaint();
        bChanged = true;
    }

    public void onKeyPressed(KeyEvent e)
    {
        
        KeyCode c = e.getCode();
        switch (c)
        {
            case PAGE_UP:
                drawingDist = new Length(drawingDist.l * (1 + (bShiftDown ? 0.5 : 1) * (bControlDown ? 0.25 : 1) * 0.2));
                if (bQDown)
                    new Point(space, drawingDist, new Angle(0));
                repaint();
                //bChanged = true;
                break;
            case PAGE_DOWN:
                drawingDist = new Length(drawingDist.l / (1 + (bShiftDown ? 0.5 : 1) * (bControlDown ? 0.25 : 1) * 0.2));
                if (bQDown)
                    new Point(space, drawingDist, new Angle(0));
                repaint();
                //bChanged = true;
                break;
            case INSERT:
                drawingDist = Length.neg(drawingDist);
                if (bQDown)
                    new Point(space, drawingDist, new Angle(0));
                repaint();
                //bChanged = true;
                break;
            //case F10:
            //    mode3d = !mode3d;
            //    repaint();
            //    break;
            case F5:
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
            case F6:
                value++;
                if(value > 20)
                    value=20;

                if (slider != null)
                    slider.setValue(value);

                space.changeCurvature(0.1 * value);
                repaint();
                bChanged = true;
                break;
            case F8:
                edit_reset_curvature();
                break;
            case LEFT:
                space.rotate(Angle.neg(angularSpeed));
                drawPoints();
                repaint();
                //bChanged = true;
                break;
            case RIGHT:
                space.rotate(angularSpeed);
                drawPoints();
                repaint();
                //bChanged = true;
                break;
            case UP:
                if (value <= 0)
                    space.moveforward(linearSpeed);
                else
                    space.moveforward(Length.neg(linearSpeed));

                drawPoints();
                repaint();
                //bChanged = true;
                break;
            case DOWN:
                if (value <= 0)
                    space.moveforward(Length.neg(linearSpeed));
                else
                    space.moveforward(linearSpeed);
                drawPoints();
                repaint();
                //bChanged = true;
                break;
            case V:
                //new Line(space, new Length(0.00001), new Angle(Math.PI / 2 + 0.00001));
                repaint();
                bChanged = true;
                break;
            case Q:
                bQDown = true;
                drawPoints();
                repaint();
                bChanged = true;
                break;
            case A:
                bADown = true;
                drawPoints();
                repaint();
                bChanged = true;
                break;
            case W:
                //new Circle(space, new Length(0.00001), new Angle(0.00001), drawingDist);
                repaint();
                bChanged = true;
                break;
            case S:
                //new Circle(space, drawingDist, new Angle(0.00001), drawingDist);
                repaint();
                bChanged = true;
                break;
            case R:
                //new EquidistantCurve(space, new Length(0.00001), new Angle(0.00001), drawingDist);
                repaint();
                bChanged = true;
                break;
            case F:
                //new EquidistantCurve(space, drawingDist, new Angle(0.00001), Length.neg(drawingDist));
                repaint();
                bChanged = true;
                break;
            case T:
                //new Line(space, drawingDist, new Angle(0.00001));
                repaint();
                bChanged = true;
                break;
            case G:
                //new Line(space, new Length(0.00001), new Angle(0.00001));
                repaint();
                bChanged = true;
                break;
            case Z:
                bZDown = true;
                drawPoints();
                repaint();
                bChanged = true;
                break;
            case X:
                bXDown = true;
                drawPoints();
                repaint();
                bChanged = true;
                break;
            case C:
                bCDown = true;
                drawPoints();
                repaint();
                bChanged = true;
                break;


            case O:
                magnification /= (1 + (bShiftDown ? 0.5 : 1) * (bControlDown ? 0.25 : 1) * 0.2);
                repaint();
                break;
            case P:
                magnification *= (1 + (bShiftDown ? 0.5 : 1) * (bControlDown ? 0.25 : 1) * 0.2);
                repaint();
                break;
            case SHIFT:
                bShiftDown = true;
                calculateSpeed();
                break;
            case CONTROL:
                bControlDown = true;
                calculateSpeed();
                break;
        }
    }

    public void keyTyped(KeyEvent e) {  }
    public void onKeyReleased(KeyEvent e)
    {
        KeyCode  c = e.getCode();
        switch (c)
        {
            case Q:
                bQDown = false;
                break;
            case A:
                bADown = false;
                break;
            case Z:
                bZDown = false;
                break;
            case X:
                bXDown = false;
                break;
            case C:
                bCDown = false;
                break;
            case SHIFT:
                bShiftDown = false;
                calculateSpeed();
                break;
            case CONTROL:
                bControlDown = false;
                calculateSpeed();
                break;
        }
    }

    public void repaint()
    {
        double currentWidth = primaryStage.getWidth();
        double currentHeight = primaryStage.getHeight();

        double cx = currentWidth / 2;
        double cy = currentHeight / 2;

        GraphicsContext gc = canvas.getGraphicsContext2D();

        gc.setTransform(new Affine());  // This resets the transform to identity
        gc.clearRect(0, 0, canvas.getWidth(), canvas.getHeight()); // Clear the canvas

        calculateTransform();
        gc.setTransform(transform);
        
        gc.setFill(new javafx.scene.paint.Color(0, 0, 0, 1));
        gc.setStroke(new javafx.scene.paint.Color(0, 0, 0, 1));
        gc.setLineWidth(0.01);

        space.draw(gc);

        gc.setStroke(new javafx.scene.paint.Color(0.3, 0, 0, 1));
        gc.setLineWidth(0.05);
        gc.strokeOval(-0.25, -0.25, 0.5, 0.5);
        
        gc.setStroke(new javafx.scene.paint.Color(0, 0, 0.7, 1));
        gc.setLineWidth(0.05);
        gc.strokeOval(-0.25, -0.25 - drawingDist.l, 0.5, 0.5);
    }

    public boolean imageUpdate(java.awt.Image i , int info, int x, int y, int w, int h)
    {
        return true;
    }

    private void calculateTransform()
    {
        //Insets insets = getInsets();
        double currentWidth = canvas.getWidth(); // - insets.left - insets.right;
        double currentHeight = canvas.getHeight();// - insets.top - insets.bottom;

        double cx = currentWidth /*getSize().width*/ / 2;
        double cy = currentHeight /*getSize().height*/ / 2;
        transform = new Affine(); //cx * magnification, 0, 0, cy * magnification, cx, cy);
        transform.appendTranslation(cx, cy);
        transform.appendScale(cx * magnification, cy * magnification);

    }

    private void onMousePressed(javafx.scene.input.MouseEvent event) {
        //Insets insets = getInsets();
        double currentWidth = primaryStage.getWidth(); //- insets.left - insets.right;
        double currentHeight = primaryStage.getHeight();// - insets.top - insets.bottom;

        double cx = currentWidth / 2;
        double cy = currentHeight / 2;

        calculateTransform();
        double x = event.getX() - canvas.getLayoutX();
        double y = event.getY() - canvas.getLayoutY();

        //x = x - cx;
        //y = y - cy;
        Point2D src = new Point2D(x, y);
        Point2D dst = new Point2D(0, 0);
        try
        {
            dst = transform.inverseTransform(src);
        }
        catch(Exception ex)
        {
        }

        double ang = Math.atan2(dst.getX(), dst.getY());
        double r = Math.sqrt(dst.getX()*dst.getX()+dst.getY()*dst.getY());
        //System.out.println("a:" + ang);

        new Point(space, new Length(r), new Angle(-ang + Math.PI));
        
        bChanged = true;
        
        repaint();
    }

    private void onMouseMoved(javafx.scene.input.MouseEvent event) {
        // Handle mouse moved
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

