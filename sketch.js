// declaring all variables
var xc, yc, er, xs, ys;																// distance/position
var Tcount, day;																				// time
var Lcount, Lstep, Ldirection, payload, throttle;			// lander stats
var thslider, eButton, mButton;												// UI elements

function setup() {																	// setup
																											// basic stuff
	createCanvas(800, 700);							// canvas
	background(0);
	rectMode(CENTER);																			// draw modes
	ellipseMode(RADIUS);
	angleMode(DEGREES);
																											// define variables
	xc = width/2;																		// distance/position
	yc = height/2;
	er = height/2;
	xs = [];
	ys = [];
	for(var i = 1; i < 1001; i++) {													// define star position datasets
		xs[i] = random(width);
		ys[i] = random(height);
	}
	Tcount = 0;																						// time
	day = 180;
	Lcount = 0;																						// lander stats
	Lstep = 1;
	Ldirection = 1;
	payload = 'full';
																										// create UI interactables
	eButton = createButton('fire boosters at earth');		// earthbound button
  	eButton.size(100, 50);															// button code taken from "Buttons1" by Arthur Shapiro
		eButton.mousePressed(marsbound);										// ( https://www.openprocessing.org/sketch/589087 )
	mButton = createButton('fire boosters at mars')			// marsbound button
		mButton.size(100, 50)																// I have modified what the buttons say and what values they change
  	mButton.mousePressed(earthbound)
	thslider = createSlider(0, 5, 0);										// throttle slider
		thslider.size(100, 10);
}

function draw() {																		// draw function
																											// update variables
	Tcount = Tcount+1;																		// time
	Lcount = Lcount+(Lstep*Ldirection*.5);								// lander stats
	if(Lcount > (width-(3*er/2)) || Lcount < 0) {
		Ldirection = Ldirection*-1;
	}
	lunarsling();
	stat();
	
	background(0);																			// draw graphics
	for(var i = 1; i < 1001; i++) {
		star(xs[i], ys[i]);
	}
	earth(0, yc)
	mars(width, yc)
	moon((3*er/2)*cos((Tcount*.2)%360), yc+(3*er/2)*sin((Tcount*.2)%360))
	lander(er+Lcount, yc)
	UI(xc)
}

function lander(X, Y) {
	noStroke()
	fill(255)
	rect(X, Y, er/8, er/20, 5)
	fill(100, 0, 255)
	rect(X, Y, er/27, er/27)
	stroke(255, 175, 0)
	strokeWeight(er/40)
	point(X-(er/27), Y)
	point(X+(er/27), Y)
}

function earth(X, Y) {
	fill(0, 100, 255)
	noStroke()
	ellipse(X, Y, er, er)
	fill(0)
	ellipse(X+(3*er/16), Y-(er/4), er/8, er/8)
	ellipse(X+(11*er/16), Y-(er/4), er/8, er/8)
	noFill()
	stroke(0)
	strokeWeight(4)
	arc(X+(7*er/16), Y, er/4, er/4, 0, 180)
}

function mars(X, Y) {
	fill(255, 100, 0)
	noStroke()
	ellipse(X, Y,  er/2, er/2)
	fill(0)
	arc(X-(3*er/32), Y-(er/8), er/16, er/16, 0, 180)
	arc(X-(11*er/32), Y-(er/8), er/16, er/16, 0, 180)
	stroke(0)
	strokeWeight(4)
	line(X-(3*er/32), Y+(er/8), X-(11*er/32), Y+(er/8))
}

function moon (X, Y) {			// moon function taken from "Sun & Moon" by Brooke Olsen
	noStroke();								// ( https://www.openprocessing.org/sketch/587175 )
	fill(174, 181, 193);			// I have modified it to render correctly in ellipseMode(RADIUS)
	ellipse (X, Y, er/8, er/8)
	fill(0)
	ellipse (X+er/32, Y-er/32, er/80, er/80)
	ellipse (X-er/32, Y-er/32, er/80, er/80)
	arc(X, Y, er/32, er/16, 0, 180)
}

function star (X, Y) {
	strokeWeight(2);
	stroke(255);
	point(X, Y);
}

function earthbound() {
	if(Ldirection == 1) {
		Lstep = Lstep-thslider.value()
	}
	else {
		Lstep = Lstep+thslider.value()
	}
}

function marsbound() {
	if(Ldirection == 1) {
		Lstep = Lstep+thslider.value()
	}
	else {
		Lstep = Lstep-thslider.value()
	}
}

function lunarsling() {
	var d = dist(er+Lcount, yc, (3*er/2)*cos((Tcount*.2)%360), yc+(3*er/2)*sin((Tcount*.2)%360))
	if (d < er/8) {											//distance checking function taken from "Interactivity 1" example on the p5js website
		if(Ldirection == 1) {							//( https://p5js.org/examples/hello-p5-interactivity-1.html )
			Lstep = Lstep+1									//I have modified it to check the distance between the moon and the lander
		}
		else {
			Lstep = Lstep-1
		}
		fill(225)
		noStroke()
		textSize(40)
		text('Lunar Slingshot!', xc-100, yc-200)
	}
}

function stat() {
	if (Tcount%61 >= 60) {
		day = day+1;
	}
	/*if (Dcount%12 == 11) {
		day = day+1;
	}*/
	if (Lcount < 0) {
		payload = 'full'
	}
	if (Lcount > (width-(3*er/2)) && payload == 'full') {
		day = 0
		payload = 'empty'
	}
}

function UI(X) {
	eButton.position(X-110, 20)
	mButton.position(X+10, 20)
	thslider.position(X+120, 20)
	
	noStroke()
	fill(255)
	textSize(18)
	text('throttle: '+thslider.value(), X+240, 30);
	text('payload '+payload, 10, 30);
	text(day+' days since last supply drop', 10, 60);
}
