export class Random {
	static randChoice(arr) {
	    return arr[Math.floor(Math.random()* arr.length)];
	}
	
	static randInt(min, max) {
		return Math.floor(Math.random()* (max - min + 1)) + min;
	}
	
	static randFloat(min, max) {
		return Math.random()* (max - min) + min;
	}
	
	static randBool(chance = 0.5) {
	    return Math.random() < chance;
	}
	
	static shuffle(arr) {
	  const copy = [...arr];
	  for (let i = copy.length - 1; i > 0; i--) {
	    const j = Math.floor(Math.random() * (i + 1));
	    [copy[i], copy[j]] = [copy[j], copy[i]];
	  }
	  return copy;
	}
}

export class Manager {
	constructor(canvas, ctx, MAX_PIXELS = 4000000) {
		this.canvas = canvas;
		this.ctx = ctx;
		this.MAX_PIXELS = MAX_PIXELS;
		this.width = 0;
		this.height = 0;
		this.ratio = 1;
	}
	
	resizeCanvas(W = window.innerWidth, H = window.innerHeight) {
		const aspect = W/H;
		this.width = Math.sqrt(this.MAX_PIXELS*aspect);
		this.height = this.width/aspect;
		this.ratio = this.width/W;
		
		this.canvas.width = this.width;
		this.canvas.height = this.height;
	}
	
	centerContext() {
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.ctx.scale(1, -1);
		this.ctx.translate(this.width/2, -this.height/2);
	}
	
	clientX2(e) {
		return this.ratio*e.clientX - this.width/2;
	}
	
	clientY2(e) {
		return -(this.ratio*e.clientY - this.height/2);
	}
}

export class Vector {
	constructor(mag, dir) {
		const rad = dir*Math.PI/180;
		this.x = mag*Math.cos(rad);
		this.y = mag*Math.sin(rad);
	}
	
	get mag() {
		return Math.sqrt(this.x*this.x + this.y*this.y);
	}
	
	get dir() {
		return Math.atan2(this.y, this.x)*180/Math.PI;
	}
	
	add(v) {
		this.x += v.x;
		this.y += v.y;
		
		return this;
	}
	
	copy() {
		return new Vector(this.mag, this.dir);
	}
	
	static fromXY(x, y) {
		return new Vector(Math.sqrt(x*x + y*y), Math.atan2(y, x)*180/Math.PI);
	}
	
	static sum(v1, v2) {
		return Vector.fromXY(v1.x + v2.x, v1.y + v2.y);
	}
	
	static diff(v1, v2) {
		return Vector.fromXY(v1.x - v2.x, v1.y - v2.y);
	}
}