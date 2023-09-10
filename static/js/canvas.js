"use strict";

class Canvas
{
	constructor(id, mouseMoveCallback, mouseUpCallback)
	{
		this.canvasId = id;
		this.canvas = document.getElementById(id);
		this.canvas.ctx = this.canvas.getContext("2d");
		this.canvas.imgData = this.canvas.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
		this.canvas.imgData.data.fill(0);
		this.canvas.ctx.putImageData(this.canvas.imgData, 0, 0);
		this.canvas.tempImgData = null;

		this.canvas.chosenTool = "brush";
		this.canvas.chosenColor = new Color(0, 0, 0);
		this.canvas.brushRadius = 4;

		this.canvas.mouseMoveCallback = mouseMoveCallback;
		this.canvas.mouseUpCallback = mouseUpCallback;

		this.p1 = new Point(this.canvas.width * 100, this.canvas.height * 100);
		this.p2 = new Point(this.canvas.width * 100, this.canvas.height * 100);

		this.isMouseDown = false;

		function onMouseDown(e)
		{
			let x = e.offsetX == undefined ? e.layerX : e.offsetX;
  			let y = e.offsetY == undefined ? e.layerY : e.offsetY;

  			if (e.button == "0")
  			{
  				e.currentTarget.isMouseDown = true;

  				e.currentTarget.p1 = new Point(x, y);
  				e.currentTarget.p2 = new Point(x, y);

  				e.currentTarget.tempImgData = e.currentTarget.ctx.createImageData(e.currentTarget.imgData);
  				e.currentTarget.tempImgData.data.set(e.currentTarget.imgData.data);

  				switch (e.currentTarget.chosenTool)
  				{
  					case "flood_fill":
  						e.currentTarget.floodFill(e.currentTarget.tempImgData, e.currentTarget.p1.X, e.currentTarget.p1.Y, e.currentTarget.getPixel(e.currentTarget.tempImgData, e.currentTarget.p1.X, e.currentTarget.p1.Y), e.currentTarget.chosenColor);

  						e.currentTarget.imgData = e.currentTarget.ctx.createImageData(e.currentTarget.tempImgData);
  						e.currentTarget.imgData.data.set(e.currentTarget.tempImgData.data);
						
						e.currentTarget.updateCanvas(e.currentTarget.imgData);
  						break;

  					case "flood_fill_rows":
  						e.currentTarget.floodFillRows(e.currentTarget.tempImgData, e.currentTarget.p1.X, e.currentTarget.p1.Y, e.currentTarget.getPixel(e.currentTarget.tempImgData, e.currentTarget.p1.X, e.currentTarget.p1.Y), e.currentTarget.chosenColor);

  						e.currentTarget.imgData = e.currentTarget.ctx.createImageData(e.currentTarget.tempImgData);
  						e.currentTarget.imgData.data.set(e.currentTarget.tempImgData.data);
						
						e.currentTarget.updateCanvas(e.currentTarget.imgData);
  						break;	
  				}
  			}
		}
		this.canvas.addEventListener("mousedown", onMouseDown);

		function onMouseUp(e)
		{
			if (e.button == "0")
			{
				e.currentTarget.isMouseDown = false;

				e.currentTarget.imgData = e.currentTarget.ctx.createImageData(e.currentTarget.tempImgData);
  				e.currentTarget.imgData.data.set(e.currentTarget.tempImgData.data);

				e.currentTarget.updateCanvas(e.currentTarget.imgData);

				e.currentTarget.tempImgData = e.currentTarget.ctx.createImageData(e.currentTarget.imgData);

				e.currentTarget.mouseUpCallback();
			}
		}
		this.canvas.addEventListener("mouseup", onMouseUp);

		function onMouseMove(e)
		{
			if (e.currentTarget.isMouseDown)
			{
				let x = e.offsetX == undefined ? e.layerX : e.offsetX;
  				let y = e.offsetY == undefined ? e.layerY : e.offsetY;

				e.currentTarget.p2 = new Point(x, y);

				switch (e.currentTarget.chosenTool)
				{
					case "line":
						if (e.currentTarget.tempImgData != null)
						{
							e.currentTarget.tempImgData = e.currentTarget.ctx.createImageData(e.currentTarget.imgData);
		  					e.currentTarget.tempImgData.data.set(e.currentTarget.imgData.data);

		  					e.currentTarget.drawLine_Bresenham(e.currentTarget.tempImgData, e.currentTarget.p1.X, e.currentTarget.p1.Y, e.currentTarget.p2.X, e.currentTarget.p2.Y, e.currentTarget.chosenColor);

		  					e.currentTarget.updateCanvas(e.currentTarget.tempImgData);
						}
						break;

					case "line_dda":
						if (e.currentTarget.tempImgData != null)
						{
							e.currentTarget.tempImgData = e.currentTarget.ctx.createImageData(e.currentTarget.imgData);
		  					e.currentTarget.tempImgData.data.set(e.currentTarget.imgData.data);

		  					e.currentTarget.drawLine_DDA(e.currentTarget.tempImgData, e.currentTarget.p1.X, e.currentTarget.p1.Y, e.currentTarget.p2.X, e.currentTarget.p2.Y, e.currentTarget.chosenColor);

		  					e.currentTarget.updateCanvas(e.currentTarget.tempImgData);
						}
						break;

					case "circle":
						if (e.currentTarget.tempImgData != null)
						{
							e.currentTarget.tempImgData = e.currentTarget.ctx.createImageData(e.currentTarget.imgData);
		  					e.currentTarget.tempImgData.data.set(e.currentTarget.imgData.data);
							
							let r = Vector2.vectorFromPoints(e.currentTarget.p1.X, e.currentTarget.p1.Y, e.currentTarget.p2.X, e.currentTarget.p2.Y).length();
							r = Math.round(r);
							
							e.currentTarget.drawCircle(e.currentTarget.tempImgData, e.currentTarget.p1.X, e.currentTarget.p1.Y, r, e.currentTarget.chosenColor);
							
							e.currentTarget.updateCanvas(e.currentTarget.tempImgData);
						}
						break;

					case "fill_circle":
						if (e.currentTarget.tempImgData != null)
						{
							e.currentTarget.tempImgData = e.currentTarget.ctx.createImageData(e.currentTarget.imgData);
		  					e.currentTarget.tempImgData.data.set(e.currentTarget.imgData.data);
							
							let r = Vector2.vectorFromPoints(e.currentTarget.p1.X, e.currentTarget.p1.Y, e.currentTarget.p2.X, e.currentTarget.p2.Y).length();
							r = Math.round(r);
							
							e.currentTarget.fillCircle(e.currentTarget.tempImgData, e.currentTarget.p1.X, e.currentTarget.p1.Y, r, e.currentTarget.chosenColor);
							
							e.currentTarget.updateCanvas(e.currentTarget.tempImgData);
						}
						break;	
						
					case "ellipse":
						if (e.currentTarget.tempImgData != null)
						{
							e.currentTarget.tempImgData = e.currentTarget.ctx.createImageData(e.currentTarget.imgData);
		  					e.currentTarget.tempImgData.data.set(e.currentTarget.imgData.data);
							
							let a = Math.abs(e.currentTarget.p1.X - e.currentTarget.p2.X);
							let b = Math.abs(e.currentTarget.p1.Y - e.currentTarget.p2.Y);
							
							e.currentTarget.drawEllipse(e.currentTarget.tempImgData, e.currentTarget.p1.X, e.currentTarget.p1.Y, a, b, e.currentTarget.chosenColor);
							
							e.currentTarget.updateCanvas(e.currentTarget.tempImgData);
						}
						break;	

					case "ellipse_another":
						if (e.currentTarget.tempImgData != null)
						{
							e.currentTarget.tempImgData = e.currentTarget.ctx.createImageData(e.currentTarget.imgData);
		  					e.currentTarget.tempImgData.data.set(e.currentTarget.imgData.data);
							
							let a = Math.abs(e.currentTarget.p1.X - e.currentTarget.p2.X);
							let b = Math.abs(e.currentTarget.p1.Y - e.currentTarget.p2.Y);
							
							e.currentTarget.drawEllipse_Another(e.currentTarget.tempImgData, e.currentTarget.p1.X, e.currentTarget.p1.Y, a, b, e.currentTarget.chosenColor);
							
							e.currentTarget.updateCanvas(e.currentTarget.tempImgData);
						}
						break;

					case "fill_ellipse":
						if (e.currentTarget.tempImgData != null)
						{
							e.currentTarget.tempImgData = e.currentTarget.ctx.createImageData(e.currentTarget.imgData);
		  					e.currentTarget.tempImgData.data.set(e.currentTarget.imgData.data);
							
							let a = Math.abs(e.currentTarget.p1.X - e.currentTarget.p2.X);
							let b = Math.abs(e.currentTarget.p1.Y - e.currentTarget.p2.Y);
							
							e.currentTarget.fillEllipse(e.currentTarget.tempImgData, e.currentTarget.p1.X, e.currentTarget.p1.Y, a, b, e.currentTarget.chosenColor);
							
							e.currentTarget.updateCanvas(e.currentTarget.tempImgData);
						}
						break;	

					case "pencil":
						if (e.currentTarget.tempImgData != null)
						{
		  					e.currentTarget.drawLine_Bresenham(e.currentTarget.tempImgData, e.currentTarget.p1.X, e.currentTarget.p1.Y, e.currentTarget.p2.X, e.currentTarget.p2.Y, e.currentTarget.chosenColor);

		  					e.currentTarget.p1.X = e.currentTarget.p2.X;
		  					e.currentTarget.p1.Y = e.currentTarget.p2.Y;

		  					e.currentTarget.updateCanvas(e.currentTarget.tempImgData);

		  					e.currentTarget.mouseMoveCallback();
						}
						break;	

					case "brush":
						if (e.currentTarget.tempImgData != null)
						{
		  					e.currentTarget.brush(e.currentTarget.tempImgData, e.currentTarget.p1.X, e.currentTarget.p1.Y, e.currentTarget.p2.X, e.currentTarget.p2.Y, e.currentTarget.brushRadius, e.currentTarget.chosenColor);

		  					e.currentTarget.p1.X = e.currentTarget.p2.X;
		  					e.currentTarget.p1.Y = e.currentTarget.p2.Y;

		  					e.currentTarget.updateCanvas(e.currentTarget.tempImgData);

		  					e.currentTarget.mouseMoveCallback();
						}
						break;	

					default:
						break;		
				}
			}
		}
		this.canvas.addEventListener("mousemove", onMouseMove);

		this.canvas.clearCanvas = function()
		{
			for (let i = 0; i < this.imgData.data.length; i += 4) 
			{
				this.imgData.data[i] = 0;
				this.imgData.data[i + 1] = 0;
				this.imgData.data[i + 2] = 0;
				this.imgData.data[i + 3] = 255;
			}

			this.tempImgData = null;
			this.ctx.putImageData(this.imgData, 0, 0);
		}

		this.canvas.updateCanvas = function(imgData)
		{
			this.ctx.putImageData(imgData, 0, 0);
		}

		this.canvas.getPixel = function(imgData, x, y)
		{
			let index = (x * 4) + (y * imgData.width * 4);

			let r = imgData.data[index];
			let g = imgData.data[index + 1];
			let b = imgData.data[index + 2];

			return new Color(r, g, b);
		}

		this.canvas.setPixel = function(imgData, x, y, color)
		{
			let index = (x * 4) + (y * imgData.width * 4);

			imgData.data[index] = color.R;
			imgData.data[index + 1] = color.G;
			imgData.data[index + 2] = color.B;
			imgData.data[index + 3] = 255; //alpha
		}

		this.canvas.contains = function(x, y)
		{
			return (x >= 0 && x < this.width && y >= 0 && y < this.height);
		}

		this.canvas.drawPoint = function(imgData, x, y, color)
		{
			if (this.contains(x, y))
			{
				this.setPixel(imgData, x, y, color);
			}
		}

		this.canvas.drawLine_Bresenham = function(imgData, x0, y0, x1, y1, color)
		{
			let signx = (x1 - x0 >= 0 ? 1 : -1);
		    let signy = (y1 - y0 >= 0 ? 1 : -1);
		 
		    let px = Math.abs(x1 - x0);
		    let py = Math.abs(y1 - y0);
		 
		    let N = Math.max(px, py);
		 
		    if (N == 0)
		    {
				this.drawPoint(imgData, x0, y0, color);
				return;
			}
		 
			if (py <= px)
		    {
				let x = x1;
				let y = y1;
				let E = -px;
		 
				N++;
				while (N > 0)
				{
					this.drawPoint(imgData, x, y, color);

					x -= signx;
					E += 2 * py;
					if (E > 0) 
					{
						E -= 2 * px;
						y -= signy;
					}
					
					N--;
				}
			}
			else
			{
				let x = x1;
				let y = y1;
				let E = -py;
				
				N++;
				while (N > 0)
				{
					this.drawPoint(imgData, x, y, color);

					y -= signy;
					E += 2 * px;
					if (E > 0) 
					{
						E -= 2 * py;
						x -= signx;
					}
					
					N--;
				}
			}
		}

		this.canvas.drawLine_DDA = function(imgData, x0, y0, x1, y1, color)
		{
			if (x0 == x1 && y0 == y1)
			{
				this.drawPoint(imgData, x0, y0, color);
				return;
			}
			
			let px = x1 - x0;
			let py = y1 - y0;
			let N = Math.max(Math.abs(px), Math.abs(py));
			
			let dx = px/N;
			let dy = py/N;
			
			let x = x0;
			let y = y0;
			
			let i = 1;
			while (i <= N)
			{
				this.drawPoint(imgData, Math.round(x), Math.round(y), color);
				
				x += dx;
				y += dy;
				
				i += 1;
			}
		}
		
		this.canvas.drawCircle = function(imgData, x0, y0, R, color)
		{
			let x = -1;
			let y = R;
			
			let d = 3 - 2*R;
			let u = 6;
			let v = 10 - 4*R;
			
			while (v < 10)
			{
				if (d < 0)
				{
					d += u;
					u += 4;
					v += 4;
					
					x += 1;
				}
				else
				{
					d += v;
					u += 4;
					v += 8;
					
					x += 1;
					y -= 1;
				}
				
				this.drawPoint(imgData, x0 + x, y0 + y, color);
				this.drawPoint(imgData, x0 - x, y0 + y, color);
				this.drawPoint(imgData, x0 + x, y0 - y, color);
				this.drawPoint(imgData, x0 - x, y0 - y, color);
				
				this.drawPoint(imgData, x0 + y, y0 + x, color);
				this.drawPoint(imgData, x0 - y, y0 + x, color);
				this.drawPoint(imgData, x0 + y, y0 - x, color);
				this.drawPoint(imgData, x0 - y, y0 - x, color);
			}
		}

		this.canvas.fillCircle = function(imgData, x0, y0, R, color)
		{
			let x = -1;
			let y = R;
			
			let d = 3 - 2*R;
			let u = 6;
			let v = 10 - 4*R;
			
			while (v < 10)
			{
				if (d < 0)
				{
					d += u;
					u += 4;
					v += 4;
					
					x += 1;
				}
				else
				{
					d += v;
					u += 4;
					v += 8;
					
					x += 1;
					y -= 1;
				}
				
				this.drawLine_Bresenham(imgData, x0 + x, y0 + y, x0 - x, y0 + y, color); //1, 2
				this.drawLine_Bresenham(imgData, x0 - y, y0 + x, x0 + y, y0 + x, color); //3, 8
				this.drawLine_Bresenham(imgData, x0 - y, y0 - x, x0 + y, y0 - x, color); //4, 7
				this.drawLine_Bresenham(imgData, x0 - x, y0 - y, x0 + x, y0 - y, color); //5, 6
			}
		}

		this.canvas.brush = function(imgData, x0, y0, x1, y1, R, color)
		{
			let deltaX = x1 - x0;
			let deltaY = y1 - y0;

			let distance = Math.sqrt(deltaX*deltaX + deltaY*deltaY);

			let numDraws = distance;
			distance = Math.floor(distance);

			for (let i = 0; i < distance; i++) 
			{
				let ipos = Vector2.lerp(new Vector2(x0, y0), new Vector2(x1, y1), i / numDraws);

				this.fillCircle(imgData, Math.floor(ipos.X), Math.floor(ipos.Y), R, color);
			}
		}
		
		this.canvas.drawEllipse = function(imgData, x0, y0, a, b, color)
		{
			let x = 0;
			let y = b;

			let a_sqr = a * a;
			let b_sqr = b * b;
			let delta = 4 * b_sqr * ((x+1) * (x+1)) + a_sqr * ((2*y-1) * (2*y-1)) - 4 * a_sqr * b_sqr;

			while ((a_sqr * (2*y-1)) > (2 * b_sqr * (x+1)))
			{
				this.drawPoint(imgData, x0 + x, y0 + y, color);
				this.drawPoint(imgData, x0 - x, y0 + y, color);
				this.drawPoint(imgData, x0 + x, y0 - y, color);
				this.drawPoint(imgData, x0 - x, y0 - y, color);

				if (delta < 0)
				{
					x++;
					delta += 4 * b_sqr * (2*x+3);
				}
				else
				{
					x++;
                    delta = delta - 8 * a_sqr * (y-1) + 4 * b_sqr * (2*x+3);
                    y--;
				}
			}

			delta = b_sqr * ((2*x+1) * (2*x+1)) + 4 * a_sqr * ((y+1) * (y+1)) - 4 * a_sqr * b_sqr;
			while ((y+1) != 0)
            {
                this.drawPoint(imgData, x0 + x, y0 + y, color);
				this.drawPoint(imgData, x0 - x, y0 + y, color);
				this.drawPoint(imgData, x0 + x, y0 - y, color);
				this.drawPoint(imgData, x0 - x, y0 - y, color);

                if (delta < 0)
                {
                    y--;
                    delta += 4 * a_sqr * (2*y+3);
                }
                else
                {
                    y--;
                    delta = delta - 8 * b_sqr * (x+1) + 4 * a_sqr * (2*y+3);
                    x++;
             	}
            }
		}

		this.canvas.drawEllipse_Another = function(imgData, x0, y0, a, b, color)
		{
			let x = -1;
			let y = b;

			let A = a*a;
			let B = b*b;

			let R = A*B;

			let D = B + A*(2*b-1)*(2*b-1) - 4*R;
			let U = 8*B;
			let V = 8*A*(b-1);
			let I = a + b;

			do
			{
				if (D < 0)
				{
					D += U;
					U += 8*B;

					x += 1;
				}
				else
				{
					D -= V;
					V -= 8*A;

					y -= 1;
				}

				this.drawPoint(imgData, x0 + x, y0 + y, color);
				this.drawPoint(imgData, x0 - x, y0 + y, color);
				this.drawPoint(imgData, x0 + x, y0 - y, color);
				this.drawPoint(imgData, x0 - x, y0 - y, color);
			}
			while (--I > 0)
		}

		this.canvas.fillEllipse = function(imgData, x0, y0, a, b, color)
		{
			let x = 0;
			let y = b;

			let a_sqr = a * a;
			let b_sqr = b * b;
			let delta = 4 * b_sqr * ((x+1) * (x+1)) + a_sqr * ((2*y-1) * (2*y-1)) - 4 * a_sqr * b_sqr;

			while ((a_sqr * (2*y-1)) > (2 * b_sqr * (x+1)))
			{
				this.drawLine_Bresenham(imgData, x0 + x, y0 + y, x0 - x, y0 + y, color);
				this.drawLine_Bresenham(imgData, x0 + x, y0 - y, x0 - x, y0 - y, color);

				if (delta < 0)
				{
					x++;
					delta += 4 * b_sqr * (2*x+3);
				}
				else
				{
					x++;
                    delta = delta - 8 * a_sqr * (y-1) + 4 * b_sqr * (2*x+3);
                    y--;
				}
			}

			delta = b_sqr * ((2*x+1) * (2*x+1)) + 4 * a_sqr * ((y+1) * (y+1)) - 4 * a_sqr * b_sqr;
			while ((y+1) != 0)
            {
				this.drawLine_Bresenham(imgData, x0 + x, y0 + y, x0 - x, y0 + y, color);
				this.drawLine_Bresenham(imgData, x0 + x, y0 - y, x0 - x, y0 - y, color);

                if (delta < 0)
                {
                    y--;
                    delta += 4 * a_sqr * (2*y+3);
                }
                else
                {
                    y--;
                    delta = delta - 8 * b_sqr * (x+1) + 4 * a_sqr * (2*y+3);
                    x++;
                }
            }
		}

		this.canvas.floodFill = function(imgData, x, y, oldColor, newColor)
		{
			let S = [];
			S.push(new Point(x, y));
			
			while (S.length != 0)
			{
				let n = S.pop();
				
				let c = this.getPixel(imgData, n.X, n.Y);

				if (this.contains(n.X, n.Y) && (!c.equals(newColor)) && (c.equals(oldColor)))
				{
					this.setPixel(imgData, n.X, n.Y, newColor);

					S.push(new Point(n.X, n.Y - 1));
					S.push(new Point(n.X, n.Y + 1));
					S.push(new Point(n.X - 1, n.Y));
					S.push(new Point(n.X + 1, n.Y));
				}
			}
		}

		this.canvas.floodFillRows = function(imgData, x, y, oldColor, newColor)
		{
			let S = [];
			S.push(new Point(x, y));
			
			let spanLeft = 0; 
			let spanRight = 0;

			while (S.length != 0)
			{
				let n = S.pop();
				let y1 = n.Y;

				while (y1 >= 1 && this.getPixel(imgData, n.X, y1).equals(oldColor))
				{
					y1 -= 1;
				}

				y1 += 1;
				spanLeft = 0; 
				spanRight = 0;

				while (y1 < this.height && this.getPixel(imgData, n.X, y1).equals(oldColor))
				{
					this.setPixel(imgData, n.X, y1, newColor);

					if (spanLeft == 0 && n.X > 0 && this.getPixel(imgData, n.X-1, y1).equals(oldColor))
					{
						S.push(new Point(n.X - 1, y1));
						spanLeft = 1;
					}
					else
					{
						spanLeft = 0;
					}

					if (spanRight == 0 && n.X < this.width && this.getPixel(imgData, n.X+1, y1).equals(oldColor))
					{
						S.push(new Point(n.X + 1, y1));
						spanRight = 1;
					}
					else
					{
						spanRight = 0;
					}

					y1 += 1;
				}
			}
		}
	}

	switchTool(tool)
	{
		switch (tool)
		{
			case "line":
			case "line_dda":	
			case "flood_fill":
			case "flood_fill_rows":
			case "circle":
			case "fill_circle":	
			case "ellipse":
			case "ellipse_another":
			case "fill_ellipse":
			case "pencil":
			case "brush":
				this.canvas.chosenTool = tool;	
				break;	
		}
	}

	switchColor(clr)
	{
		this.canvas.chosenColor = clr;
	}

	switchRadius(r)
	{
		this.canvas.brushRadius = Math.round(r);
	}

	clearCanvas()
	{
		this.canvas.clearCanvas();
	}

	getCanvas()
	{
		let temp = this.canvas.ctx.createImageData(this.canvas.imgData);
  		temp.data.set(this.canvas.imgData.data);

		return temp;
	}

	setCanvas(imgData)
	{
		this.canvas = document.getElementById(this.canvasId);
		this.canvas.ctx = this.canvas.getContext("2d");
		this.canvas.imgData = this.canvas.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
		this.canvas.imgData.data.set(imgData.data);
		this.canvas.ctx.putImageData(this.canvas.imgData, 0, 0);
	}
}