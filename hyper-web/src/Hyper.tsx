import React, { Component, ReactNode, createRef } from 'react';
import { Length } from './Length';
import { Angle } from './Angle';
import { Point } from './Point';
import { Trig } from './Trig';
import { SpaceElement } from './SpaceElement';
import InfoModal from './InfoModal'; 
import CurvatureModal from './CurvatureModal'; 

interface HyperProps {
}

interface HyperState {
  curvature: number;
  invCurvature: number;
  elements: Array<SpaceElement>;
  magnification: number;
  drawingDist: Length;
  isModalOpen: boolean;
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
}

class Hyper extends Component<HyperProps, HyperState> {
  canvasRef: React.RefObject<HTMLCanvasElement>;

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
      isModalOpen: false,
      isCurvatureModalOpen: false,
      bShiftDown: false,
      bControlDown: false,
      bQDown: false,
      bADown: false,
      bZDown: false,
      bXDown: false,
      bChanged: false,
      angularSpeed: new Angle(Math.PI / 32),
      linearSpeed: new Length(0.25)
    };

    this.canvasRef = createRef(); 
  }

  onKeyPressed = (e: React.KeyboardEvent) => {
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

  onKeyReleased = (e: React.KeyboardEvent) => {
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

  componentDidMount() {
    this.repaint();
  }

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
        context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

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

  render(): ReactNode {
    return (
      <div style={{ padding: '5px', textAlign: 'left', minWidth: '400px' }}>
        <button onClick={() => this.setState({ isCurvatureModalOpen: true })}>
            Change curvature...
          </button>
        <CurvatureModal
          isOpen={this.state.isCurvatureModalOpen}
          onClose={(_curvature) => {this.setState({ curvature: _curvature, invCurvature: 1 / _curvature, isCurvatureModalOpen: false  }); this.canvasRef.current?.focus()}}
          previousCurvature={this.state.curvature}
          title={'Hyper'}
        />
        &nbsp;&nbsp;&nbsp;&nbsp;
        <button onClick={() => this.setState({ isModalOpen: true })}>
            Instructions...
          </button>
        <InfoModal
          isOpen={this.state.isModalOpen}
          onClose={() => {this.setState({ isModalOpen: false  }); this.canvasRef.current?.focus()}}
          title={'Hyper'}
          content={info}
        />
        <br></br>
        <br></br>
        <canvas 
          ref={this.canvasRef}
          width={'600px'}
          height={'600px'}
          tabIndex={0} // Make canvas focusable to capture keyboard events
          onKeyDown={this.onKeyPressed}
          onKeyUp={this.onKeyReleased}
          onMouseDown={this.onMousePressed}
        >
        </canvas>
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

export default Hyper;

