let walkActive = false;
let tiltX = 0, tiltY = 0;

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 450,
  parent: document.body,
  physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false }},
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);
let player;

function preload() {
  this.load.spritesheet('roger', 'assets/sprite.png', { frameWidth: 32, frameHeight: 32 });
  this.load.image('bg', 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Spaceship_background_pixel_art.png'); // temporary background
}

function create() {
  this.add.image(400, 225, 'bg').setScale(2);

  player = this.physics.add.sprite(400, 225, 'roger').setScale(1.5);
  player.setCollideWorldBounds(true);

  this.anims.create({ key: 'walk-left', frames: this.anims.generateFrameNumbers('roger', { start: 0, end: 2 }), frameRate: 10, repeat: -1 });
  this.anims.create({ key: 'walk-right', frames: this.anims.generateFrameNumbers('roger', { start: 3, end: 5 }), frameRate: 10, repeat: -1 });
  this.anims.create({ key: 'walk-up', frames: this.anims.generateFrameNumbers('roger', { start: 6, end: 8 }), frameRate: 10, repeat: -1 });
  this.anims.create({ key: 'walk-down', frames: this.anims.generateFrameNumbers('roger', { start: 9, end: 11 }), frameRate: 10, repeat: -1 });

  // Touch buttons
  const walkBtn = this.add.text(20, 370, '🚶 WALK', { font: '24px Arial', fill: '#00FF00' }).setInteractive();
  const stopBtn = this.add.text(120, 370, '✋ STOP', { font: '24px Arial', fill: '#FF0000' }).setInteractive();

  walkBtn.on('pointerdown', () => walkActive = true);
  stopBtn.on('pointerdown', () => walkActive = false);

  // Tilt detection
  window.addEventListener('deviceorientation', function (event) {
    tiltX = event.gamma;  // Left-right
    tiltY = event.beta;   // Front-back
  });
}

function update() {
  if (!walkActive) {
    player.setVelocity(0);
    player.anims.stop();
    return;
  }

  let vx = 0, vy = 0;

  if (tiltX > 10) { vx = 100; player.anims.play('walk-right', true); }
  else if (tiltX < -10) { vx = -100; player.anims.play('walk-left', true); }
  else if (tiltY > 30) { vy = 100; player.anims.play('walk-down', true); }
  else if (tiltY < 10) { vy = -100; player.anims.play('walk-up', true); }
  else {
    player.setVelocity(0);
    player.anims.stop();
    return;
  }

  player.setVelocity(vx, vy);
}
