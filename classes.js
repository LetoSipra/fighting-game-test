class Sprite {
  constructor({
    position,
    imageSource,
    scale = 1,
    frames = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image();
    this.image.src = imageSource;
    this.scale = scale;
    this.frames = frames;
    this.currentFrame = 0;
    this.fpsCount = 0;
    this.fps = 5;
    this.offset = offset;
  }
  animateFrames() {
    this.fpsCount++;
    if (this.fpsCount % this.fps === 0) {
      if (this.currentFrame < this.frames - 1) {
        this.currentFrame++;
      } else {
        this.currentFrame = 0;
      }
    }
  }

  draw() {
    cc.drawImage(
      this.image,
      this.currentFrame * (this.image.width / this.frames),
      0,
      this.image.width / this.frames,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.frames) * this.scale,
      this.image.height * this.scale
    );
  }
  update() {
    this.draw();
    this.animateFrames();
  }
}
class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = 'red',
    imageSource,
    scale = 1,
    frames = 1,
    offset = { x: 0, y: 0 },
    sprites,
  }) {
    super({
      position,
      imageSource,
      scale,
      frames,
      offset,
    });

    this.velocity = velocity;
    this.color = color;
    this.width = 50;
    this.height = 150;
    this.lastKey = '';
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: 100,
      height: 50,
    };
    this.isAttacking;
    this.health = 100;
    this.currentFrame = 0;
    this.fpsCount = 0;
    this.fps = 5;
    this.sprites = sprites;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSource;
    }
    console.log(this.sprites);
  }

  update() {
    this.draw();
    this.animateFrames();
    this.attackBox.position.x = this.position.x - this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Gravity
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
      this.position.y = 330;
    } else this.velocity.y += gravity;
  }
  attack() {
    this.spriteState('attackOne');
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }

  spriteState(sprite) {
    if (
      this.image === this.sprites.attackOne.image &&
      this.currentFrame < this.sprites.attackOne.frames - 1
    )
      return;
    switch (sprite) {
      case 'idle':
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.frames = this.sprites.idle.frames;
          this.currentFrame = 0;
        }
        break;
      case 'run':
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.frames = this.sprites.run.frames;
          this.currentFrame = 0;
        }
        break;
      case 'jump':
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.frames = this.sprites.jump.frames;
          this.currentFrame = 0;
        }
        break;
      case 'fall':
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.frames = this.sprites.fall.frames;
          this.currentFrame = 0;
        }
        break;
      case 'attackOne':
        if (this.image !== this.sprites.attackOne.image) {
          this.image = this.sprites.attackOne.image;
          this.frames = this.sprites.attackOne.frames;
          this.currentFrame = 0;
        }
        break;
    }
  }
}
