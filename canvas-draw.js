function enableDrawCanvas(canvas) {
	const ctx = canvas.getContext('2d') // get 2D context
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	
	/*********** handle mouse events on canvas **************/
	var mousedown = false;
	ctx.strokeStyle = '#000000';
	ctx.fillStyle = "#FFFFFF";
	ctx.lineWidth = 2;
	canvas.onmousedown = function(e) {		
		var pos = fixPosition(e, canvas);
		mousedown = true;
		ctx.beginPath();
		ctx.moveTo(pos.x, pos.y);
		// ctx.fillRect(pos.x, pos.y, 20, 20);
		return false;
	};
	
	canvas.onmousemove = function(e) {
		var pos = fixPosition(e, canvas);
		if (mousedown) {
			ctx.lineTo(pos.x, pos.y);
			ctx.stroke();
		}
	};
	
	canvas.onmouseup = function(e) {
		ctx.closePath();
		mousedown = false;
	};
	
	/********** utils ******************/
	// Thanks to http://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element/4430498#4430498
	function fixPosition(e, gCanvasElement) {
		var x;
		var y;
		if (e.pageX || e.pageY) { 
		  x = e.pageX;
		  y = e.pageY;
		}
		else { 
		  x = e.clientX + document.body.scrollLeft +
			  document.documentElement.scrollLeft;
		  y = e.clientY + document.body.scrollTop +
			  document.documentElement.scrollTop;
		} 
		x -= gCanvasElement.offsetLeft;
		y -= gCanvasElement.offsetTop;
		return {x: x, y:y};
	}
}