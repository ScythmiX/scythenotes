// Utilities
import { Random, Vector, Manager } from './utils/utils.js';


// Setup (1)
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const manager = new Manager(canvas, ctx);
let W, H;
const pointer = {
	x: undefined,
	y: undefined,
	range: 250
}

function setupCanvas() {
	manager.resizeCanvas(); // Constant resolution, Aligned aspect
	manager.centerContext(); // Centers the canvas
	W = manager.width;
	H = manager.height;
} setupCanvas();

function resetPointer() {
	pointer.x = undefined;
    pointer.y = undefined;
}

function updatePointer(e) {
    if ((e.touches) && (e.touches.length > 0)) {
        pointer.x = manager.clientX2(e.touches[0]);
        pointer.y = manager.clientY2(e.touches[0]);
    } else {
        pointer.x = manager.clientX2(e);
        pointer.y = manager.clientY2(e);
    }
}


// Constructor (5)
class Particle {
	static particles = [];
	static COUNT = 100;
	static COLORS = ["#e0e0e0", "#c0c0c0", "#a0a0a0", "#808080", "#606060", "#404040", "#202020"]
	static THRESHOLD = 250;
	
	constructor(rad, col, pos, vel) {
		this.iRad = rad;
		this.rad = rad;
		this.col = col;
		this.pos = pos;
		this.vel = vel;
		this.draw();
	}
	
	draw() {
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, this.rad, 0, 2*Math.PI);
		ctx.shadowColor = this.col;
		ctx.shadowBlur = 2*this.rad;
		ctx.fillStyle = this.col;
		ctx.fill();
		ctx.shadowColor = "transparent";
		ctx.shadowBlur = 0;
	}
	
	
	update(time) {
		this.pos.add(this.vel);
		
		const posX = this.pos.x;
		const posY = this.pos.y;
		
		if ((posX < -W/2) || (posX > W/2))  {
			this.vel.x *= -1;
		}
		if ((posY < -H/2) || (posY > H/2)) {
			this.vel.y *= -1;
		}
		
		const dx = pointer.x - posX;
		const dy = pointer.y - posY;
		const distSq = dx*dx + dy*dy;
		const pointRange = pointer.range;
		const pointRangeSq = pointRange*pointRange;
		
		if (distSq < pointRangeSq) {
			this.rad = Math.min(this.rad + 5, 25);
		} else {
			this.rad = Math.max(this.iRad, this.rad - 0.5);
		}
		
		this.draw();
	}
	
	static connect(arr, len, i, thresholdSq) {
		for (let j = i + 1; j < len; j++) {
			const p1 = arr[i];
			const p2 = arr[j];
			
			const p1X = p1.pos.x;
			const p1Y = p1.pos.y;
			const p2X = p2.pos.x;
			const p2Y = p2.pos.y;
			
			const dx = p2X - p1X;
			const dy = p2Y - p1Y;
			
			const distSq = dx*dx + dy*dy;
			
			if (distSq < thresholdSq) {
				ctx.beginPath();
				ctx.moveTo(p1X, p1Y);
				ctx.lineTo(p2X, p2Y);
				ctx.strokeStyle = p1.col;
				ctx.stroke();
			}
		}
	}
	
	static updateAll(time) {
		const arr = this.particles;
		const len = arr.length;
		const threshold = Particle.THRESHOLD;
		const thresholdSq = threshold*threshold;
		
		for (let i = 0; i < len; i++) {
			arr[i].update(time);
			this.connect(arr, len, i, thresholdSq);
		}
	}
}


// Initialising (3)
function init() {
	const count = Particle.COUNT;
	Particle.particles = new Array(count);
	const arr = Particle.particles;
	const colors = Particle.COLORS;
	
	for (let i = 0; i < count; i++) {
		arr[i] = new Particle(
			Random.randFloat(5, 7),
			Random.randChoice(colors),
			
			Vector.fromXY(
				Random.randInt(-W/2, W/2),
				Random.randInt(-H/2, H/2)
			),
			
			new Vector(
				Random.randFloat(1, 3),
				Random.randInt(0, 360)
			)
		)
	}
} init();


// Animating (4)
function animate(time) {
	time *= 0.001;
	
	ctx.clearRect(-W/2, -H/2, W, H);
	
	Particle.updateAll(time);

	window.requestAnimationFrame(animate);
} window.requestAnimationFrame(animate);


// Event handling (2)
let lastTimerId;
window.addEventListener("resize", () => {
	clearTimeout(lastTimerId); 	// Clears the last timer (Prevents chaining multiple resizes)
	
	lastTimerId = setTimeout(setupCanvas, 150); // Executes the block after 150 ms
});

window.addEventListener("mousedown", updatePointer);
window.addEventListener("touchstart", updatePointer);

window.addEventListener("mousemove", updatePointer);
window.addEventListener("touchmove", updatePointer);

window.addEventListener("mouseup", resetPointer);
window.addEventListener("touchend", resetPointer);