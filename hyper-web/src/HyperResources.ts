// HyperResources.ts
export class HyperResources {
    static contents = {
        AppName: "Hyper",
        mnuFile: "File",
        mnuEdit: "Edit",
        mnuHelp: "Help",
        mnuNew: "New",
        mnuOpen: "Open...",
        mnuSave: "Save  F2",
        mnuSaveAs: "Save As...",
        mnuExit: "Exit",
        mnuCurvature: "Curvature...",
        mnuResetCurvature: "Reset Curvature  F8",
        mnuInstructions: "Instructions...  F1",
        dlgOpen: "Open",
        dlgSaveAs: "Save As",
        dlgCurvature: "Curvature",
        dlgInstructions: "Instructions",
        btnYes: "Yes",
        btnNo: "No",
        btnOpen: "Open",
        btnSave: "Save",
        btnOK: "OK",
        btnCancel: "Cancel",
        EnterName: "Enter name:",
        SelectFile: "Select file:",
        SaveChanges: "Would you like to save changes?",
        UnableToReadFile: "Unable to read file.",
        UnableToWriteFile: "Unable to write file.",
        FileAlreadyExists: "A file with the specified name already exists. Would you like to overwrite it?",
        Info: `
            Hyper -- Version 0.4

            This program is for drawing things on curved planes.

            Keys used for moving:
            Left, Right -- Turn around
            Up -- Move forward
            Down -- Move backward
            Page Up, Page Down -- Move auxiliary cursor
            Insert -- Flip auxiliary cursor
            Hold down Shift and/or Control while moving to move slowly.

            Keys used for drawing:
            Q -- Draw point at auxiliary cursor
            A -- Draw point at main cursor

            Keys used for erasing:
            Z -- Erase at cursor
            X -- Like Z, but bigger eraser
            C -- Like Z, but erase only points

            Function keys:
            F1 -- Show this help screen
            F2 -- Save
            F5 -- Decrease curvature
            F6 -- Increase curvature
            F8 -- Reset curvature

            License information:
            This software is licensed under the MIT License. Copyright © 2006, 2025 Mattias Wikström.

            Permission is hereby granted, free of charge, to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is provided to do so, subject to the following conditions:

            The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

            THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT, OR OTHERWISE, ARISING FROM, OUT OF, OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
        `
    };

    // A method to get the contents, mimicking the getContents() method in Java
    static getContents(): Record<string, string> {
        return HyperResources.contents;
    }
}
