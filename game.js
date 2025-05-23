let walkActive = false;
let tiltX = 0, tiltY = 0;
let player;

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 450,
  parent: document.body,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

new Phaser.Game(config);

function preload() {
  this.load.spritesheet('roger', 'assets/sprite.png', { frameWidth: 24, frameHeight: 24 });
  this.load.image('bg', 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Spaceship_background_pixel_art.png');
}

function create() {
  this.add.image(400, 225, 'bg').setScale(2);

  player = this.physics.add.sprite(400, 225, 'roger').setScale(1.5);
  player.setCollideWorldBounds(true);

  // Animations: 3 frames each for left, right, up, down
  this.anims.create({ key: 'walk-left', frames: this.anims.generateFrameNumbers('roger', { start: 0, end: 2 }), frameRate: 8, repeat: -1 });
  this.anims.create({ key: 'walk-right', frames: this.anims.generateFrameNumbers('roger', { start: 3, end: 5 }), frameRate: 8, repeat: -1 });
  this.anims.create({ key: 'walk-up', frames: this.anims.generateFrameNumbers('roger', { start: 6, end: 8 }), frameRate: 8, repeat: -1 });
  this.anims.create({ key: 'walk-down', frames: this.anims.generateFrameNumbers('roger', { start: 9, end: 11 }), frameRate: 8, repeat: -1 });

  // Walk and Stop Buttons
  const walkBtn = this.add.text(20, 370, '🚶 WALK', { font: '20px monospace', fill: '#00FF00' }).setInteractive();
  const stopBtn = this.add.text(120, 370, '✋ STOP', { font: '20px monospace', fill: '#FF0000' }).setInteractive();

  walkBtn.on('pointerdown', () => walkActive = true);
  stopBtn.on('pointerdown', () => walkActive = false);

  // Detect phone tilt
  window.addEventListener('deviceorientation', (event) => {
    tiltX = event.gamma;
    tiltY = event.beta;
  });
}

function update() {
  if (!walkActive) {
    player.setVelocity(0);
    player.anims.stop();
    return;
  }

  let vx = 0, vy = 0;
  let anim = '';

  if (tiltX > 10) { vx = 100; anim = 'walk-right'; }
  else if (tiltX < -10) { vx = -100; anim = 'walk-left'; }
  else if (tiltY > 30) { vy = 100; anim = 'walk-down'; }
  else if (tiltY < 10) { vy = -100; anim = 'walk-up'; }

  if (vx !== 0 || vy !== 0) {
    player.setVelocity(vx, vy);
    if (!player.anims.isPlaying || player.anims.currentAnim.key !== anim) {
      player.anims.play(anim, true);
    }
  } else {
    player.setVelocity(0);
    player.anims.stop();
  }
}
