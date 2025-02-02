import React, { Component, ReactNode, createRef } from 'react';
import { Length } from './Length';
import { Angle } from './Angle';
import { Point } from './Point';
import { Trig } from './Trig';
import { SpaceElement } from './SpaceElement';
import CurvatureModal from './CurvatureModal';
import { Button, Typography } from '@mui/material';
import { withTheme } from '@mui/styles';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Alert } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import { HyperStateCore, ImportAndExport } from './ImportAndExport'; 
import Divider from '@mui/material/Divider';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import image from "./assets/Keys_used_in_Hyper.jpg"; // Adjust the path as needed

interface HyperProps {
}

interface HyperState {
  curvature: number;
  invCurvature: number;
  elements: Array<SpaceElement>;
  magnification: number;
  drawingDist: Length;
  isInfoModalOpen: boolean;
  isCurvatureModalOpen: boolean;
  bShiftDown: boolean;
  bControlDown: boolean;
  bADown: boolean;
  bQDown: boolean;
  bXDown: boolean;
  bZDown: boolean;
  bChanged: boolean;
  angularSpeed: Angle;
  linearSpeed: Length;
  anchorEl: null | HTMLElement;
  fileOpen : boolean;
  editOpen : boolean;
  helpOpen : boolean;
  alertMessage : string;
  filename: string;
  aboutOpen: boolean;
  instructionsOpen: boolean;
  bMouseDown: boolean;
  lastClientX: number;
  lastClientY: number;
}

class Hyper extends Component<HyperProps, HyperState> {
  canvasRef: React.RefObject<HTMLCanvasElement>;

  fileInputRef: React.RefObject<HTMLInputElement>;

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyPressed);
    document.addEventListener('keyup', this.onKeyReleased);

    this.repaint();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyPressed);
    document.removeEventListener('keyup', this.onKeyReleased);
  }

  handleKeyDown = (event: KeyboardEvent) => {
    // Perform actions based on the keyboard event
    // For example, update state or trigger side effects
    console.log(`Key pressed: ${event.key}`);
  };

  private setChanged(newValue : boolean)
  {
    this.setState({
      bChanged: newValue
    });
  }

  public drawPoints()
  {
    if (this.state.bADown)
    {      
      this.setState({
        elements: [...this.state.elements, new Point(new Length(0.001), new Angle(0))]
      });
    }
    
    if (this.state.bQDown)
    {
      this.setState({
        elements: [...this.state.elements, new Point(this.state.drawingDist, new Angle(0))]
      });
    }
      
    if (this.state.bZDown || this.state.bXDown)
    {
      const newElements = [];

      for (let e of this.state.elements)
      {              
        if (!e.withinRadius(new Length(this.state.bXDown ? 0.6 : 0.2)))
        {
          newElements.push(e);
        }
      }
      
      this.setState({
        elements: newElements
      });
    }
  }

  private calculateSpeed(): void {
    let as = Math.PI / 32;
    let ls = 0.25;

    if (this.state.bShiftDown) {
        as *= 0.5;
        ls *= 0.5;
    }

    if (this.state.bControlDown) {
        as *= 0.25;
        ls *= 0.25;
    }

    this.setState({
      linearSpeed: new Length(ls),
      angularSpeed: new Angle(as)
    });
  }

  draw(g: CanvasRenderingContext2D): void {
      for (let e of this.state.elements) {
          e.draw(g);
      }
  }

  distance(p1: Point, p2: Point): Length {
      return new Trig(this.state.curvature).distance(p1.getDistance(), p2.getDistance(), Angle.diff(p2.getAngle(), p1.getAngle()));
  }

  rotate(angle: Angle): void {
    let newElements : Array<SpaceElement> = [];
      for (let e of this.state.elements) {
        e.rotate(angle);
        newElements.push(e);
      }

      this.setState({
        elements: newElements
      });
  }

  moveforward(dist: Length): void {
      let newElements : Array<SpaceElement> = [];
      for (let e of this.state.elements) {
        e.moveForward(dist, this.state.curvature);
        newElements.push(e);
      }

      this.setState({
        elements: newElements
      });
  }

  constructor(props: HyperProps) {
    super(props);

    // Initialize the state
    this.state = {
      curvature: 0,
      invCurvature: 1/0,
      elements: [],
      magnification: 0.2,
      drawingDist: new Length(1.001),
      isInfoModalOpen: false,
      isCurvatureModalOpen: false,
      bShiftDown: false,
      bControlDown: false,
      bQDown: false,
      bADown: false,
      bZDown: false,
      bXDown: false,
      bChanged: false,
      angularSpeed: new Angle(Math.PI / 32),
      linearSpeed: new Length(0.25),
      anchorEl: null,
      fileOpen : false,
      editOpen : false,
      helpOpen : false,
      alertMessage : '',
      filename: initialFilename,
      aboutOpen : false,
      instructionsOpen : false,
      bMouseDown : false,
      lastClientX : 0,
      lastClientY : 0
    };

    this.canvasRef = createRef();
    this.fileInputRef = createRef();

    let _this = this;

    window.addEventListener('beforeunload', function(event) {      
      if (_this.state.bChanged) {
          const message = "Are you sure you want to leave this page?";
          event.returnValue = message;  // Required for some browsers
          return message;  // Required for others
      }
    });
    
    const img = new Image();
    img.src = image;

    console.log(img);
  }

  onKeyPressed = (e: KeyboardEvent) => {
    switch (e.key) {
      case "PageDown":
      case "PageUp":
          {
            const newDrawingDist = 
              e.key == "PageUp" 
                ? new Length(this.state.drawingDist.l * (1 + (this.state.bShiftDown ? 0.5 : 1) * (this.state.bControlDown ? 0.25 : 1) * 0.2))
                : new Length(this.state.drawingDist.l / (1 + (this.state.bShiftDown ? 0.5 : 1) * (this.state.bControlDown ? 0.25 : 1) * 0.2))
                ;

            const newElements =
              this.state.bQDown
              ? [...this.state.elements, new Point(this.state.drawingDist, new Angle(0))]
              : this.state.elements
              ;
            
            this.setState({
              drawingDist: newDrawingDist,
              elements: newElements
            });
          
            this.forceUpdate(() => {
              this.repaint();
            });
            
          }
          break;
        case "Insert":
          {
            const newDrawingDist = Length.neg(this.state.drawingDist);
            
            const newElements =
              this.state.bQDown
              ? [...this.state.elements, new Point(this.state.drawingDist, new Angle(0))]
              : this.state.elements
              ;

            this.setState({
              drawingDist: newDrawingDist,
              elements: newElements
            });
        
            this.forceUpdate(() => {
              this.repaint();
            });
          }
          break;
        case "ArrowLeft":
            this.rotate(Angle.neg(this.state.angularSpeed));
            this.forceUpdate(() => {
              this.drawPoints();
              this.repaint();
            });
            break;
        case "ArrowRight":
            this.rotate(this.state.angularSpeed);
            this.forceUpdate(() => {
              this.drawPoints();
              this.repaint();
            });
            break;
        case "ArrowUp":
            if (this.state.curvature <= 0)
                this.moveforward(this.state.linearSpeed);
            else
                this.moveforward(Length.neg(this.state.linearSpeed));
            this.forceUpdate(() => {
              this.drawPoints();
              this.repaint();
            });
            break;
        case "ArrowDown":
            if (this.state.curvature <= 0)
                this.moveforward(Length.neg(this.state.linearSpeed));
            else
                this.moveforward(this.state.linearSpeed);
            this.forceUpdate(() => {
              this.drawPoints();
              this.repaint();
            });
            break;
        case "q":
        case "Q":
          this.setState({
            bQDown: true
          });
          this.forceUpdate(() => {
            this.drawPoints();
            this.repaint();
            this.setChanged(true);
          });
          break;
        case "a":
        case "A":
          this.setState({
            bADown: true
          });
          this.forceUpdate(() => {
            this.drawPoints();
            this.repaint();
            this.setChanged(true);
          });
          break;
          case "z":
          case "Z":
              this.setState({
                bZDown: true
              });
              this.forceUpdate(() => {
                this.drawPoints();
                this.repaint();
                this.setChanged(true);
              });
                break;
            case "x":
            case "X":
              this.setState({
                bXDown: true
              });
              this.forceUpdate(() => {
                this.drawPoints();
                this.repaint();
                this.setChanged(true);
              });
                break;
            case "o":
            case "O":
              this.setState({
                magnification: this.state.magnification / (1 + (this.state.bShiftDown ? 0.5 : 1) * (this.state.bControlDown ? 0.25 : 1) * 0.2)
              });
              
              this.repaint();
              break;
            case "p":
            case "P":
              this.setState({
                magnification: this.state.magnification * (1 + (this.state.bShiftDown ? 0.5 : 1) * (this.state.bControlDown ? 0.25 : 1) * 0.2)
              });
              this.repaint();
              break;
        
        case "Shift":
          this.setState({
            bShiftDown: true
          });
          
          this.forceUpdate(() => {
            this.calculateSpeed();
          });
            break;
        case "Control":
          this.setState({
            bControlDown: true
          });
          this.forceUpdate(() => {
            this.calculateSpeed();
          });
            break;
    }
  };

  onKeyReleased = (e: KeyboardEvent) => {
    console.log('onKeyReleased', e.key);
    switch (e.key) {
      case "q":
      case "Q":
        this.setState({
          bQDown: false
        });
        break;
      case "a":
      case "A":
        this.setState({
          bADown: false
        });
        break;
        case "z":
          case "Z":
          this.setState({
            bZDown: false
          });
          break;
          case "x":
            case "X":
          this.setState({
            bXDown: false
          });
          break;
        case "Shift":
          this.setState({
            bShiftDown: false
          });
            this.calculateSpeed();
            break;
        case "Control":
          this.setState({
            bControlDown: false
          });
            this.calculateSpeed();
            break;
    }
  };
  
  onMouseReleased = (_: React.MouseEvent) => {  
    this.setState({
      bMouseDown: false
    });
  }
  
  onMouseMove = (e: React.MouseEvent) => {  
    const difference = (a : number, b : number) => a < b ? b - a : a - b;

    if (this.state.bMouseDown) {
      if (difference(e.clientX, this.state.lastClientX) < 3
        && difference(e.clientY, this.state.lastClientY) < 3) {
          //console.log('Skipping');
          return; // Avoid drawing lots of points
      }

      const canvas = this.canvasRef.current;

      if (canvas) {
        const transform = this.calculateTransform(canvas);
        
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const src = new DOMPoint(x, y);
        const dst = src.matrixTransform(transform.inverse());

        const ang = Math.atan2(dst.x, dst.y);
        const r = Math.sqrt(dst.x * dst.x + dst.y * dst.y);

        const p = new Point(new Length(r), new Angle(-ang + Math.PI));
        
        this.setState({
          elements: [...this.state.elements, p],
          bChanged: true,
          lastClientX: e.clientX,
          lastClientY: e.clientY,
        });
        
        this.repaint();
      }

      //console.log('*');
    }
  }

  onMousePressed = (e: React.MouseEvent) => {            
    const canvas = this.canvasRef.current;

    if (canvas) {
      const transform = this.calculateTransform(canvas);
      
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const src = new DOMPoint(x, y);
      const dst = src.matrixTransform(transform.inverse());

      const ang = Math.atan2(dst.x, dst.y);
      const r = Math.sqrt(dst.x * dst.x + dst.y * dst.y);

      const p = new Point(new Length(r), new Angle(-ang + Math.PI));
      
      this.setState({
        elements: [...this.state.elements, p],
        bChanged: true,
        lastClientX: e.clientX,
        lastClientY: e.clientY,
      });
      
      this.repaint();
    }

    
    this.setState({
      bMouseDown: true
    });
  };

  componentDidUpdate() {
    this.repaint();
  }

  private calculateTransform(canvas : HTMLCanvasElement): DOMMatrix {
    
    const currentWidth = canvas.width;
    const currentHeight = canvas.height;
    const cx = currentWidth / 2;
    const cy = currentHeight / 2;

    const transform = new DOMMatrix();
    transform.translateSelf(cx, cy);
    transform.scaleSelf(cx * this.state.magnification, cy * this.state.magnification);

    return transform;
  }

  repaint = () => {
    const canvas = this.canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        context.setTransform(1, 0, 0, 1, 1, 1);
        context.clearRect(-10, -10, canvas.width + 20, canvas.height + 20); // Clear the canvas

        context.setTransform(this.calculateTransform(canvas));

        context.fillStyle = "black";
        context.strokeStyle = "black";
        context.lineWidth = 0.01;

        this.draw(context);

        context.strokeStyle = "rgb(120, 0, 0)";
        context.lineWidth = 0.05;
        context.beginPath();
        context.arc(0, 0, 0.25, 0, Math.PI * 2);
        context.stroke();

        context.strokeStyle = "rgb(0, 0, 120)";
        context.lineWidth = 0.05;
        context.beginPath();
        context.arc(0, -this.state.drawingDist.l, 0.25, 0, Math.PI * 2);
        context.stroke();
      }
    }
  };

  handleCurvatureSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const _curvatureTimes10 = parseInt(event.target.value, 10);
    const _curvature = 0.1 * _curvatureTimes10;
    const _invCurvature = 1.0 / _curvature;

    this.setState({
      curvature: _curvature,
      invCurvature: _invCurvature
    });
  };

  handleClick = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({
      fileOpen: event.currentTarget.id == "file-menu-button",
      editOpen: event.currentTarget.id == "edit-menu-button",
      helpOpen: event.currentTarget.id == "help-menu-button",
      anchorEl: event.currentTarget
    });
  }

  handleClose = () => {
    this.setState({
      fileOpen: false,
      editOpen: false,
      helpOpen: false,
      anchorEl: null
    });
  }

  handleInstructionsClose= () => {
    this.setState({
      instructionsOpen: false
    });
  }

  handleAboutClose= () => {
    this.setState({
      aboutOpen: false
    });
  }

  handleMenuItemClick = (item : string) => {
    this.handleClose();
    switch (item)
    {
      case 'new':
        this.handleNewFile();
        break;
      case 'open':
        this.handleOpenFile();
        break;
      case 'download':
        this.handleSaveFile();
        break;
      case 'curvature':
        this.setState({ isCurvatureModalOpen: true })
        break;
      case 'instructions':
        //this.setState({ info: instructions });
        //this.setState({ isInfoModalOpen: true });
        
        this.setState({instructionsOpen: true});
        break;
      case 'about':
        //this.setState({ info: about });
        //this.setState({ isInfoModalOpen: true });

        this.setState({aboutOpen: true});
        break;
    }
  }
  
  canProceedWithoutSaving = () => {
    if (this.state.bChanged)
    {
      const okToProceed = confirm('Changes have not been saved. Are you sure you want to continue?');
      
      return okToProceed;
    }

    return true;
  }

  handleNewFile = () => {
    if (this.canProceedWithoutSaving())
    {
      this.setState({
        filename: initialFilename,
        curvature: 0,
        invCurvature: 1.0/0,
        elements: []
      });
    }
  }

  handleOpenFile = () => {
    if (this.canProceedWithoutSaving())
    {
      this.fileInputRef.current?.click();
    }
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const stateModifications : HyperStateCore = {} as HyperStateCore;
        
        try {      
          ImportAndExport.import_from_string(stateModifications, e.target?.result as string);
        }
        catch (e) {
          this.setState({ alertMessage: 'Failed to open file. ' + (e as any)?.reason })
          return;
        }

        let filename = file.name;

        if (filename.toLowerCase().endsWith('.hyper'))
        {
          filename = filename.slice(0, filename.lastIndexOf("."))
        }

        this.setState({
          filename: filename
        });

        this.setState(stateModifications);
      };

      reader.onerror = (e) => {
        console.log('Error reading file: ', e);
        this.setState({ alertMessage: 'Error reading file.' })
      };

      reader.readAsText(file); // Reads file as text
    }
  }

  handleSaveFile = () => {
    const content = ImportAndExport.export_to_string(this.state);
    
    const blob = new Blob([content], { type: ".hyper" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = this.state.filename + ".hyper";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.setState({
        bChanged: false
      });
  }

  render(): ReactNode {
    const { theme } = this.props as any;
    return (
      <div style={{ textAlign: 'left', backgroundColor: theme.palette.background.default, maxWidth: '600px' }}>
        {/* Open File */}
        <input
          type="file"
          accept=".hyper" 
          ref={this.fileInputRef}
          style={{ display: "none" }}
          onChange={this.handleFileChange}
        />
        
        <div>
        <Box style={{
              border: '1px solid #c7c7c7',
              lineHeight: 0
            }}>
          
            <InputBase
              sx={{ ml: 2.1, mt: 0.5, flex: 1 }}
              placeholder={initialFilename}
              value={this.state.filename}
              inputProps={{ 'aria-label': 'filename' }}
              onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                event.stopPropagation(); 
              }}
              onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) => {
                event.stopPropagation(); 
              }}
              onChange={(e) => this.setState({ filename: e.target.value, bChanged: true })}
            >
            </InputBase>
            <br></br>

        <Button
          id="file-menu-button"
          aria-controls={this.state.fileOpen ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={this.state.fileOpen ? 'true' : undefined}
          onClick={this.handleClick}
          sx={{ textTransform: 'none', userSelect: 'none' }}
        >
          File
        </Button>
        <Menu
          id="file-menu"
          anchorEl={this.state.anchorEl}
          open={this.state.fileOpen}
          onClose={this.handleClose}
          MenuListProps={{
            'aria-labelledby': 'file-menu-button'
          }}
        >
          <MenuItem onClick={() => { this.handleMenuItemClick('new'); }}>New</MenuItem>
          <MenuItem onClick={() => { this.handleMenuItemClick('open'); }}>Open...</MenuItem>
          <MenuItem onClick={() => { this.handleMenuItemClick('download'); }}>Download...</MenuItem>
        </Menu>
        <Button
          id="edit-menu-button"
          aria-controls={this.state.editOpen ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={this.state.editOpen ? 'true' : undefined}
          onClick={this.handleClick}
          sx={{ textTransform: 'none', userSelect: 'none' }}
        >
          Edit
        </Button>
        <Menu
          id="edit-menu"
          anchorEl={this.state.anchorEl}
          open={this.state.editOpen}
          onClose={this.handleClose}
          MenuListProps={{
            'aria-labelledby': 'edit-menu-button',
          }}
        >
          <MenuItem onClick={() => this.handleMenuItemClick('curvature')}>Curvature...</MenuItem>
        </Menu>
        <Button
          id="help-menu-button"
          aria-controls={this.state.helpOpen ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={this.state.helpOpen ? 'true' : undefined}
          onClick={this.handleClick}
          sx={{ textTransform: 'none', userSelect: 'none' }}
        >
          Help
        </Button>
        <Menu
          id="help-menu"
          anchorEl={this.state.anchorEl}
          open={this.state.helpOpen}
          onClose={this.handleClose}
          MenuListProps={{
            'aria-labelledby': 'help-menu-button',
          }}
        >
          <MenuItem onClick={() => this.handleMenuItemClick('instructions')}>Instructions...</MenuItem>
          <Divider />
          <MenuItem onClick={() => this.handleMenuItemClick('about')}>About Hyper...</MenuItem>
        </Menu>

        </Box>
        </div>
        
        <CurvatureModal
          isOpen={this.state.isCurvatureModalOpen}
          onClose={(_curvature) => {this.setState({ curvature: _curvature, invCurvature: 1 / _curvature, isCurvatureModalOpen: false  }); this.canvasRef.current?.focus()}}
          previousCurvature={this.state.curvature}
          title={'Hyper'}
        />

        <Dialog open={this.state.instructionsOpen} onClose={this.handleInstructionsClose} maxWidth="md" fullWidth>
          <DialogTitle>Instructions</DialogTitle>
          <DialogContent>
            
          <Typography variant="body1">
            This program is for drawing things on surfaces of constant curvature:<br></br>
            * Set the curvature to 0 for ordinary, Euclidean geometry.<br></br>
            * Set a positive curvature to draw on the surface of a sphere (spherical geometry).<br></br>
            * Set a negative curvature to get hyperbolic geometry.
          </Typography>
          <br></br>
          <Box component="img" src={image} alt="Keyboard with keys that are used in Hyper" height={200} />
            <Typography variant="body1">
              Keys used for moving:<br></br>
              Left, Right -- Turn around<br></br>
              Up -- Move forward<br></br>
              Down -- Move backward<br></br>
              Page Up, Page Down -- Move auxiliary cursor<br></br>
              Insert -- Flip auxiliary cursor<br></br>
              Hold down Shift and/or Control while moving to move slowly.
            </Typography>
            <br></br>
            <Typography variant="body1">
              Keys used for drawing:<br></br>
              Q -- Draw point at auxiliary cursor<br></br>
              A -- Draw point at main cursor
            </Typography>
            <br></br>
            <Typography variant="body1">
              Keys used for erasing:<br></br>
              Z -- Erase at cursor<br></br>
              X -- Like Z, but bigger eraser
            </Typography>
            <br></br>
            <Typography variant="body1">
              Zoom control:<br></br>
              O -- Zoom out<br></br>
              P -- Zoom in
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button onClick={this.handleInstructionsClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={this.state.aboutOpen} onClose={this.handleAboutClose} maxWidth="md" fullWidth>
          <DialogTitle>About Hyper (Web Version)</DialogTitle>
          <DialogContent>
            <Typography variant="h6">Version 0.2</Typography>
            <Typography variant="body1" paragraph>
              Developed by: Mattias Wikström
            </Typography>
            <Typography variant="body1" paragraph>
              License information:
              <br />
              This software is licensed under the MIT License. Copyright © 2006, 2025 Mattias Wikström.
            </Typography>
            <Typography variant="body2" paragraph>
              Permission is hereby granted, free of charge, to use, copy, modify, merge, publish, distribute,
              sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
              provided to do so, subject to the following conditions:
              <br />
              The above copyright notice and this permission notice shall be included in all copies or substantial
              portions of the Software.
            </Typography>
            <Typography variant="body2" paragraph>
              THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
              NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
              NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
              DAMAGES, OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT, OR OTHERWISE, ARISING FROM,
              OUT OF, OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button onClick={this.handleAboutClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Box style={{
              border: '1px solid #c7c7c7',
              lineHeight: 0
            }} 
            width={'598px'}
            height={'598px'}
            ><canvas 
            ref={this.canvasRef}
            width={'598px'}
            height={'598px'}
            onMouseDown={this.onMousePressed}
            onMouseUp={this.onMouseReleased}
            onMouseMove={this.onMouseMove}
          ></canvas>
          
          </Box>
          {this.state.alertMessage && (
          <Alert severity='info'
            onClose={() => this.setState({ alertMessage: '' })}>
              {this.state.alertMessage}
            </Alert>
          )}
      </div>
      
    );
  }
}

const initialFilename = 'Untitled document';

export default withTheme(Hyper);

