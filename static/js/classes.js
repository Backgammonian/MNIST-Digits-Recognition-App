"use strict";

class Point
{
	constructor(x, y)
	{
		this.x = x;
		this.y = y;
	}

	get X()
	{
		return this.x;
	}

	set X(value)
	{
		this.x = value;
	}

	get Y()
	{
		return this.y;
	}

	set Y(value)
	{
		this.y = value;
	}
}

class Vector2
{
	constructor(x, y)
	{
		this.x = x;
		this.y = y;
	}

	get X()
	{
		return this.x;
	}

	set X(value)
	{
		this.x = value;
	}

	get Y()
	{
		return this.y;
	}

	set Y(value)
	{
		this.y = value;
	}
	
	static vectorFromPoints(x1, y1, x2, y2)
	{
		return new Vector2(x2 - x1, y2 - y1);
	}
	
	length()
	{
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	static interpolate(from, to, amount)
	{
		return (1.0 - amount) * from + amount * to;
	}

	static lerp(start, end, amount)
	{
		let x = this.interpolate(start.X, end.X, amount);
		let y = this.interpolate(start.Y, end.Y, amount);

		return new Vector2(x, y);
	}
}

class Color
{
	constructor(r, g, b)
	{
		this.r = (r < 0) ? 0 : ((r > 255) ? 255 : r);
		this.g = (g < 0) ? 0 : ((g > 255) ? 255 : g);
		this.b = (b < 0) ? 0 : ((b > 255) ? 255 : b);

		this.r = Math.round(this.r);
		this.g = Math.round(this.g);
		this.b = Math.round(this.b);
	}

	get R()
	{
		return this.r;
	}

	set R(value)
	{
		this.r = (value < 0) ? 0 : ((value > 255) ? 255 : value);
		this.r = Math.round(this.r);
	}

	get G()
	{
		return this.g;
	}

	set G(value)
	{
		this.g = (value < 0) ? 0 : ((value > 255) ? 255 : value);
		this.g = Math.round(this.g);
	}

	get B()
	{
		return this.b;
	}

	set B(value)
	{
		this.b = (value < 0) ? 0 : ((value > 255) ? 255 : value);
		this.b = Math.round(this.b);
	}

	toString()
	{
		let result_r = this.r.toString(16).length < 2 ? "0" + this.r.toString(16) : this.r.toString(16);
		let result_g = this.g.toString(16).length < 2 ? "0" + this.g.toString(16) : this.g.toString(16);
		let result_b = this.b.toString(16).length < 2 ? "0" + this.b.toString(16) : this.b.toString(16);

		return ("#" + result_r + result_g + result_b);
	}

	equals(other)
	{
		return ((this.r == other.R) && (this.g == other.G) && (this.b == other.B));
	}
}

class Random
{
	static next(min, max) 
	{
  		// random number in range [min; (max + 1)]
  		let rand = min + Math.random() * (max + 1 - min);
  		return Math.floor(rand);
	}

	static nextDouble()
	{
		return Math.random();
	}
}

class Matrix
{
	constructor(x, y)
	{
		this.x = x;
		this.y = y;

		this.data = Array(x).fill(0);
		for (let i = 0; i < x; i++) 
		{
			this.data[i] = Array(y).fill(0);
		}
	}

	get X()
	{
		return this.x;
	}

	set X(value)
	{
		this.x = value;
	}

	get Y()
	{
		return this.y;
	}

	set Y(value)
	{
		this.y = value;
	}

	getData(a, b)
	{
		return this.data[a][b];
	}

	setData(a, b, value)
	{
		this.data[a][b] = value;
	}

	addData(a, b, value)
	{
		this.data[a][b] += value;
	}

	addMatrix(matrix)
	{
		if ((this.X != matrix.X) || (this.Y != matrix.Y))
		{
			throw new Error("Illegal matrix dimensions at addition");
		}

		let t = new Matrix(this.X, this.Y);

		for (let i = 0; i < t.X; i++) 
		{
			for (let j = 0; j < t.Y; j++) 
			{
				let a = this.getData(i, j);
				let b = matrix.getData(i, j);
				t.setData(i, j, a+b);	
			}
		}
		
		return t;
	}

	substractMatrix(matrix)
	{
		if ((this.X != matrix.X) || (this.Y != matrix.Y))
		{
			throw new Error("Illegal matrix dimensions at substraction");
		}

		let t = new Matrix(this.X, this.Y);

		for (let i = 0; i < t.X; i++) 
		{
			for (let j = 0; j < t.Y; j++) 
			{
				let a = this.getData(i, j);
				let b = matrix.getData(i, j);
				t.setData(i, j, a-b);	
			}
		}
		
		return t;
	}

	multiplyMatrix(matrix)
	{
		if (this.Y != matrix.X)
		{
			throw new Error("Illegal matrix dimensions at multiplication");
		}

		let t = new Matrix(this.X, matrix.Y);

		for (let i = 0; i < this.X; i++) 
		{
			for (let j = 0; j < matrix.Y; j++) 
			{
				for (let k = 0; k < this.Y; k++) 
				{
					t.addData(i, j, this.getData(i, k) * matrix.getData(k, j));
				}
			}
		}
			
		return t;
	}

	multiplyScalar(float)
	{
		let t = new Matrix(this.X, this.Y);

		for (let i = 0; i < this.X; i++) 
		{
			for (let j = 0; j < this.Y; j++) 
			{
				t.setData(i, j, this.getData(i, j) * float);
			}
		}

		return t;
	}

	static identity(n)
	{
		let t = new Matrix(n, n);
		for (let i = 0; i < n; i++)
        {
        	t.setData(i, i, 1);
        }
   
        return t;
	}
}