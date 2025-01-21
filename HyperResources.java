import java.util.*;

public class HyperResources extends ListResourceBundle {
     public Object[][] getContents() {
         return contents;
     }

     static final Object[][] contents = {
    { "AppName", "Hyper"},
    { "mnuFile", "File"},
    { "mnuEdit", "Edit"},
    { "mnuHelp", "Help"},
    { "mnuNew", "New"},
    { "mnuOpen", "Open..."},
    { "mnuSave", "Save  F2"},
    { "mnuSaveAs", "Save As..."},
    { "mnuExit", "Exit"},
    { "mnuCurvature", "Curvature..."},
    { "mnuResetCurvature", "Reset Curvature  F8"},
    { "mnuInstructions", "Instructions...  F1"},
    { "dlgOpen", "Open"},
    { "dlgSaveAs", "Save As"},
    { "dlgCurvature", "Curvature"},
    { "dlgInstructions", "Instructions"},
    { "btnYes", "Yes"},
    { "btnNo", "No"},
    { "btnOpen", "Open"},
    { "btnSave", "Save"},
    { "btnOK", "OK"},
    { "btnCancel", "Cancel"},
    { "EnterName", "Enter name:"},
    { "SelectFile", "Select file:"},
    { "SaveChanges", "Would you like to save changes?"},
    { "UnableToReadFile", "Unable to read file."},
    { "UnableToWriteFile", "Unable to write file."},
    { "FileAlreadyExists", "A file with the specified name already exists. " +
                            "Would you like to overwrite it?"},
    { "Info",
    "\n" +
    "Hyper -- Version 0.2\n" +
    "Copyright © Mattias Wikström 2006\n" +
    "\n" +
    "This program is for drawing things on curved planes.\n" +
    "\n" +
    "Keys used for moving:\n" +
    "Left, Right -- Turn around\n" +
    "Up -- Move forward\n" +
    "Down -- Move backward\n" +
    "Page Up, Page Down -- Move auxilary cursor\n" +
    "Insert -- Flip auxilary cursor\n" +
    "Hold down Shift and/or Control while moving to move slowly.\n" +
    "\n" +
    "Keys used for drawing:\n" +
    "Q -- Draw point at auxilary cursor\n" +
    "A -- Draw point at main cursor\n" +
    //"W -- Draw circle centered at auxilary cursor\n" +
    //"S -- Draw circle centered at main cursor\n" +
    //"R -- Draw infinite circle at auxilary cursor (not yet implemented)\n" +
    //"F -- Draw infinite circle at main cursor (not yet implemented)\n" +
    //"R -- Draw equidistant curve at auxilary cursor\n" +
    //"F -- Draw equidistant curve at main cursor\n" +
    //"T -- Draw horizontal line at auxilary cursor\n" +
    //"G -- Draw horizontal line at main cursor\n" +
    //"V -- Draw vertical line\n" +
    "\n" +
    "Keys used for erasing:\n" +
    "Z -- Erase at cursor\n" +
    "X -- Like Z, but bigger eraser\n" +
    "C -- Like Z, but erase only points\n" +
    "\n" +
    "Function keys:\n" +
    "F1 -- Show this help screen\n" +
    "F2 -- Save\n" +
    "F5 -- Decrease curvature\n" +
    "F6 -- Increase curvature\n" +
    "F8 -- Reset curvature\n" +
    //"F10 -- Toggle between 2D/3D views\n"
    ""}};
}

