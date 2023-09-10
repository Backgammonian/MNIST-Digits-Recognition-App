"use strict";

let canvas;
const minBrush = 2;
const maxBrush = 10;
let mouseMoveTicks = 0;

window.onload = function()
{
	canvas = new Canvas('canvas', mouseMoveCallback, mouseUpCallback);

	changeTool('brush', 'btn11');
	changeColor('#FFFFFF');
	canvas.switchRadius(document.getElementById('brush-radius').value);
	canvas.clearCanvas();
	resetResults();
}

function mouseMoveCallback()
{
	mouseMoveTicks += 1;
	if (mouseMoveTicks == Number.MAX_SAFE_INTEGER)
	{
		mouseMoveTicks = 0;
	}

	if (mouseMoveTicks % 10 == 0)
	{
		let xhr = new XMLHttpRequest();
		let url = '/predict';
		xhr.open('POST', url);
		xhr.setRequestHeader('Content-type', 'application/json');
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let result = JSON.parse(this.responseText);
				let inference = result.inference;
				for (let i = 0; i < inference[0].length; i++) 
				{
					document.getElementById('output_' + i).value = inference[0][i] * 100;
				}
			}
		}

		let typedArray = canvas.canvas.tempImgData.data;
		if (typedArray != null)
		{
			let normalArray = Array.prototype.slice.call(typedArray);
			let json = JSON.stringify({image: normalArray});
			xhr.send(json);
		}
	}
}

function mouseUpCallback()
{
	let xhr = new XMLHttpRequest();
	let url = '/predict';
	xhr.open('POST', url);
	xhr.setRequestHeader('Content-type', 'application/json');
	xhr.onreadystatechange = function()
	{
		if (this.readyState == 4 && this.status == 200) 
		{
			let result = JSON.parse(this.responseText);
			let inference = result.inference;
			for (let i = 0; i < inference[0].length; i++) 
			{
				document.getElementById('output_' + i).value = inference[0][i] * 100;
			}
		}
	}

	let typedArray = canvas.canvas.imgData.data;
	let normalArray = Array.prototype.slice.call(typedArray);
	let json = JSON.stringify({image: normalArray});
	xhr.send(json);
}

function changeTool(tool, id)
{
	canvas.switchTool(tool);

	let btns = document.querySelectorAll('.button');
	for (let b of btns)
	{
		b.classList.remove('button_hover');
	}

	document.getElementById(id).classList.add('button_hover');
}

function changeColor(clr)
{
	document.getElementById('current-color').style.backgroundColor = clr;

	let r = parseInt(clr[1] + clr[2], 16);
	let g = parseInt(clr[3] + clr[4], 16);
	let b = parseInt(clr[5] + clr[6], 16);

	canvas.switchColor(new Color(r, g, b));
}

function changeBrushRadius(value)
{
	if (value.length > 0)
	{
		let v = (value < minBrush) ? minBrush : ((value > maxBrush) ? maxBrush : value);
		document.getElementById('brush-radius').value = v;
		canvas.switchRadius(v);
	}
}

function resetResults()
{
	for (let i = 0; i < 10; i++) 
	{
		document.getElementById('output_' + i).value = 0;
	}
}

function resetCanvas()
{
	 canvas.clearCanvas();
	 resetResults()
}