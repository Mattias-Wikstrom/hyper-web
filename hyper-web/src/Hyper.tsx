import React, { Component, ReactNode, createRef } from 'react';
import { Length } from './Length';
import { Angle } from './Angle';
import { Point } from './Point';
import { Trig } from './Trig';
import { SpaceElement } from './SpaceElement';
import InfoModal from './InfoModal'; 
import CurvatureModal from './CurvatureModal';
import { Button, Typography } from '@mui/material';
import { withTheme } from '@mui/styles';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Alert } from '@mui/material';

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
}

class Hyper extends Component<HyperProps, HyperState> {
  canvasRef: React.RefObject<HTMLCanvasElement>;

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


  /*private hasChangedListener : ((input: boolean) => void) | null = null;

  public setHasChangedListener(_listener : (input: boolean) => void)
  {
      this.hasChangedListener = _listener;
  }*/

  private setChanged(newValue : boolean)
  {
    this.setState({
      bChanged: newValue
    });

      /*if (this.hasChangedListener)
      {
          this.hasChangedListener(this.state.bChanged);
    }*/
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
      alertMessage : ''
    };

    this.canvasRef = createRef(); 
  }

  onKeyPressed = (e: KeyboardEvent) => {
    console.log('onKeyPressed', e.key);

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
        elements: [...this.state.elements, p]
      });
      
      this.repaint();
    }
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

  handleMenuItemClick = (item : string) => {
    this.handleClose();
    switch (item)
    {
      case 'open':
        this.setState({
          alertMessage: 'The Open feature has not implemented yet.'
        });
        break;
      case 'download':
        this.setState({
          alertMessage: 'The Download feature has not implemented yet.'
        });
        break;
      case 'curvature':
        this.setState({ isCurvatureModalOpen: true })
        break;
      case 'instructions':
        this.setState({ isInfoModalOpen: true })
        break;
    }
  }

  render(): ReactNode {
    const { theme } = this.props as any;
    return (
      <div style={{ textAlign: 'left', backgroundColor: theme.palette.background.default, }}>
        <div>
        <Box style={{
              border: '1px solid #c7c7c7',
              lineHeight: 0
            }}             >
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
        </Menu>

        </Box>
        </div>
        
        <CurvatureModal
          isOpen={this.state.isCurvatureModalOpen}
          onClose={(_curvature) => {this.setState({ curvature: _curvature, invCurvature: 1 / _curvature, isCurvatureModalOpen: false  }); this.canvasRef.current?.focus()}}
          previousCurvature={this.state.curvature}
          title={'Hyper'}
        />
        <InfoModal
          isOpen={this.state.isInfoModalOpen}
          onClose={() => {this.setState({ isInfoModalOpen: false  }); this.canvasRef.current?.focus()}}
          title={'Hyper'}
          content={info}
        />
        <Box style={{
              border: '1px solid #c7c7c7',
              lineHeight: 0
            }} 
            width={'600px'}
            height={'600px'}
            ><canvas 
            ref={this.canvasRef}
            width={'600px'}
            height={'600px'}
            onMouseDown={this.onMousePressed}
          ></canvas></Box>
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

const info = `
            Hyper -- Web Version 0.1

            This app is for drawing things on curved planes.

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

            Zoom control:
            O -- Zoom out
            P -- Zoom in

            License information:
            This software is licensed under the MIT License. Copyright © 2006, 2025 Mattias Wikström.

            Permission is hereby granted, free of charge, to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is provided to do so, subject to the following conditions:

            The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

            THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT, OR OTHERWISE, ARISING FROM, OUT OF, OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
        `;

export default withTheme(Hyper);

