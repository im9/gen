import * as Tone from "tone";
import Sketch from "react-p5";

export function Display(p5: any) {
  let x = 50;
  const y = 50;
  let player: any = null;
  const synth: any = [];
  let particles: any = [];

  const preload = () => {
    player = new Tone.Player(
      "https://tonejs.github.io/audio/berklee/gong_1.mp3"
    ).toDestination();

    // player = new Tone.Sampler({
    //   urls: {
    //     A1: "A1.mp3",
    //     A2: "A2.mp3",
    //   },
    //   baseUrl: "https://tonejs.github.io/audio/casio/",
    //   onload: () => {
    //     player.triggerAttackRelease("c3", 0.5);
    //   },
    // }).toDestination();
  };

  const setup = (p5: any, canvasParentRef: Element) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);

    p5.noStroke();
    p5.frameRate(30);

    synth.push(new Tone.AMSynth().toDestination());
    synth.push(new Tone.Synth().toDestination());
    synth.push(new Tone.FMSynth().toDestination());
    synth.push(new Tone.PolySynth(Tone.Synth).toDestination());
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
    p5.push();
    p5.noStroke();
    p5.fill(255, 255, 255, particle.life * 255);
    p5.ellipse(particle.x, particle.y, particle.life * 20, particle.life * 20);
    p5.pop();
  }

  function mousePressed(p5: any) {
    particles.push(createParticle(p5, p5.mouseX, p5.mouseY));

    let synthTemp;
    synthTemp = synth[3];
    synthTemp.triggerAttackRelease("C4", 1);
  }

  function windowResized(p5: any) {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  }

  return (
    <Sketch
      preload={preload}
      setup={setup}
      draw={draw}
      windowResized={windowResized}
      mousePressed={mousePressed}
    />
  );
}
