import * as Tone from "tone";
import Sketch from "react-p5";
import Instrument, { NOTES } from "../../utils/instrument";

const colors: number[][] = [
  [255, 204, 0],
  [255, 0, 4],
  [255, 0, 196],
  [0, 255, 223],
  [255, 85, 0],
  [0, 27, 255],
  [254, 255, 0],
  [39, 39, 39],
  [240, 240, 240],
];

export function Display(p5: any) {
  let x = 50;
  const y = 50;

  let player: any = null;
  const synth: any = [];
  let particles: any = [];
  let heightNote: number = 0;
  let options: any = {
    frequency: 100,
    harmonicity: 0.2,
    modulationIndex: 3,
    modulationEnvelope: {
      attack: 0.1,
      decay: 0.8,
      sustain: 0.2,
      release: 0.2,
    },
    volume: 2,
  };
  let actRandomSeed = null;
  let count = 6;

  let fft: any = null;
  let meter: any = null;

  let beatThreshold = 0.1;
  let pianoThreshold = 0.25;

  let kick: any = null;
  let hh: any = null;

  const preload = () => {
    player = new Instrument()?.ctx;
  };

  const setup = (p5: any, canvasParentRef: Element) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);

    p5.noStroke();
    p5.frameRate(30);

    heightNote = p5.windowHeight / 12;

    synth.push(new Tone.AMSynth().toDestination());
    synth.push(new Tone.Synth().toDestination());
    synth.push(new Tone.FMSynth(options).toDestination());
    synth.push(new Tone.PolySynth(Tone.Synth).toDestination());

    let synthTemp;
    synthTemp = synth[2];
    const toneReverb = new Tone.Reverb(10).toDestination();

    player?.connect(toneReverb);

    p5.pixelDensity(2);
    p5.strokeCap(p5.SQUARE);

    fft = new Tone.Waveform(128);

    // kick
    meter = new Tone.Meter();
    kick = new Tone.Player("/samples/808/BD0000.WAV").toDestination();
    kick.connect(meter);

    hh = new Tone.Player("/samples/808/CH.WAV").toDestination();
    hh.connect(meter);

    // piano
    new Tone.Sequence(
      (time, note) => {
        player.triggerAttackRelease(note, 0.1, time);
        particles.push(createParticle(p5, p5.mouseX, p5.mouseY));
      },
      [["A3", "A5"], "A3", "G4", ["A5", "F4"]]
    ).start();

    // kick
    new Tone.Loop((time) => {
      Tone.loaded().then(() => kick?.start());
    }, "4n")?.start();

    // hihat
    new Tone.Loop((time) => {
      Tone.loaded().then(() => hh?.start(time + 0.25));
    }, "4n")?.start();

    Tone.Transport.start();
  };

  const draw = (p5: any) => {
    p5.background(0, 0, 0);
    p5.stroke(255);

    particles = particles.filter(particleIsAlive);
    for (let particle of particles) {
      updatePosition(particle);
      decreaseLife(particle);
      drawParticle(p5, particle);
    }

    const db = Math.pow(2, meter.getValue() / 6);
    if (db >= beatThreshold) {
      p5.ellipse(p5.width / 2, p5.height / 2, db * 500, db * 500);
    }
    if (db >= pianoThreshold) {
      form(p5, x, y, 400);
      form(p5, x + 800, y + 300, 400);
    }
  };

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

  function particleIsAlive(particle: any) {
    return particle.life > 0;
  }

  function updatePosition(particle: any) {
    particle.x += particle.vx;
    particle.y += particle.vy;
  }

  function decreaseLife(particle: any) {
    particle.life -= 0.01;
  }

  function drawParticle(p5: any, particle: any) {
    // Testing for squareRecursion
    if (particle.life) {
      actRandomSeed = p5.random(10000);
      p5.randomSeed(actRandomSeed);
      squareRecursion(p5, 0, 0, p5.windowWidth, count);
    }

    p5.push();
    p5.noStroke();
    p5.fill(255, 255, 255, particle.life * 255);
    p5.ellipse(particle.x, particle.y, particle.life * 20, particle.life * 20);
    p5.pop();
  }

  function mousePressed(p5: any) {
    const noteIdx = Math.floor(p5.mouseY / heightNote);
    const note = `${NOTES[noteIdx]}3`;
    player.triggerAttackRelease(note, "1n");

    particles.push(createParticle(p5, p5.mouseX, p5.mouseY));
  }

  function mouseDragged(p5: any) {
    let curve = Math.floor(p5.windowHeight - p5.mouseY) * 0.001;
    if (curve > 1) {
      curve = 1;
    } else if (curve < 0) {
      curve = 0;
    }

    options = {
      ...options,
      attack: curve,
    };
    player?.set(options);
  }

  function windowResized(p5: any) {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  }

  function squareRecursion(
    p5: any,
    x: number,
    y: number,
    s: number,
    n: number
  ) {
    p5.noFill();
    p5.strokeWeight(1);
    p5.stroke(getCol(p5));

    const buffer = fft.getValue();
    const len = buffer?.length;

    // if (buffer) {
    //   for (let i = 0; i < len; i++) {
    //     const x = p5.map(i, 0, len, 0, p5.windowWidth);
    //     const y = p5.map(Math.max(-100, buffer[i]), -1, 1, 0, p5.windowHeight);
    //     p5.line(x, y, x + p5.random(100), y);
    //   }
    // }

    n--;
    if (n >= 0) {
      const probability = p5.map(n, 0, count - 1, 0.8, 0);
      const hs = s / 2;
      // if (p5.random(1) > probability) {
      //   squareRecursion(p5, x, y, hs, n);
      //   console.log(x, y, hs, n);
      // }
      // if (p5.random(1) > probability) {
      //   squareRecursion(p5, x + hs, y, hs, n);
      // }
      // if (p5.random(1) > probability) {
      //   squareRecursion(p5, x + hs, y + hs, hs, n);
      // }
      // if (p5.random(1) > probability) {
      //   squareRecursion(p5, x, y + hs, hs, n);
      // }
    }
  }

  function form(p5: any, x: number, y: number, s: number) {
    const count = p5.random(4, 8);
    const w = s / count;
    const rw = p5.random(s / count);
    p5.strokeWeight(rw);
    p5.fill(getCol(p5));

    if (p5.random(1) > 2.0 / 3.0) {
      for (let i = x + w; i < x + s; i += w) {
        p5.line(i, y, i, y + s);
      }
    } else if (p5.random(1) > 1.0 / 3.0) {
      for (let i = y + w; i < y + s; i += w) {
        p5.line(x, i, x + s, i);
      }
    } else if (p5.random(1) > 0.0 / 3.0) {
      p5.noStroke();
      p5.circle(x + s / 2, y + s / 2, s);
    }
  }

  function getCol(p5: any) {
    return colors[Math.floor(p5.random(colors.length))];
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
