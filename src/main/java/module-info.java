module hyper {
    requires javafx.controls;
    requires javafx.fxml;
    requires java.desktop;

    exports com.mattiaswikstrom.hyper;
    opens com.mattiaswikstrom.hyper to javafx.fxml;
}
