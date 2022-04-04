import Sketch from "react-p5";

export function Lissajous(p5: any) {
  let x = 50;
  const y = 50;

  let lineWeight = 0.1;
  let lineColor: any;
  let lineAlpha = 50;

  let pointCount = 1000;
  let lissajousPoints: any[] = [];
  let freqX = 4;
  let freqY = 7;
  let phi = 15;
  let modFreqX = 3;
  let modFreqY = 2;
  let connectionRadius = 100;

  const preload = () => {};

  const setup = (p5: any, canvasParentRef: Element) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);

    p5.noStroke();
    p5.frameRate(30);

    p5.pixelDensity(2);
    p5.strokeCap(p5.SQUARE);

    // Lissajou
    lineColor = p5.color(50, 55, 100);

    p5.stroke(255);

    calculateLissajousPoints(p5);
    drawLissajous(p5);
  };

  const draw = (p5: any) => {};

  function createParticle(p5: any, x: number, y: number) {
    let direction = p5.random(p5.TWO_PI);
    let speed = 2;

    return {
      x,
      y,
      vx: speed * p5.cos(direction),
      vy: speed * p5.sin(direction),
      life: 1, // = 100%
    };
  }

  function mousePressed(p5: any) {}

  function mouseDragged(p5: any) {
    let curve = Math.floor(p5.windowHeight - p5.mouseY) * 0.001;
    if (curve > 1) {
      curve = 1;
    } else if (curve < 0) {
      curve = 0;
    }
  }

  function windowResized(p5: any) {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  }

  function calculateLissajousPoints(p5: any) {
    for (var i = 0; i <= pointCount; i++) {
      var angle = p5.map(i, 0, pointCount, 0, p5.TAU);

      var x =
        p5.sin(angle * freqX + p5.radians(phi)) * p5.cos(angle * modFreqX);
      var y = p5.sin(angle * freqY) * p5.cos(angle * modFreqY);
      x *= p5.width / 2 - 30;
      y *= p5.height / 2 - 30;

      lissajousPoints[i] = p5.createVector(x, y);
    }
  }

  function drawLissajous(p5: any) {
    // p5.background(255);
    p5.strokeWeight(lineWeight);
    p5.push();
    p5.translate(p5.width / 2, p5.height / 2);

    for (let i1 = 0; i1 < pointCount; i1++) {
      for (let i2 = 0; i2 < i1; i2++) {
        let d = lissajousPoints[i1]?.dist(lissajousPoints[i2]);
        let a = p5.pow(1 / (d / connectionRadius + 1), 6);
        if (d <= connectionRadius) {
          p5.stroke(lineColor, a * lineAlpha);
          p5.line(
            lissajousPoints[i1].x,
            lissajousPoints[i1].y,
            lissajousPoints[i2].x,
            lissajousPoints[i2].y
          );
        }
      }
    }
    p5.pop();
  }

  return (
    <Sketch
      preload={preload}
      setup={setup}
      draw={draw}
      windowResized={windowResized}
      mousePressed={mousePressed}
      mouseDragged={mouseDragged}
    />
  );
}
