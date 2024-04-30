const canvas = document.querySelector('canvas');
const cc = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

cc.fillRect(0, 0, canvas.width, canvas.height);
const gravity = 0.5;

const bg = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSource: 'asset/background.png',
});

const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  imageSource: 'asset/samuraiMack/Idle.png',
  frames: 8,
  scale: 2.5,
  offset: {
    x: 115,
    y: 150,
  },
  sprites: {
    idle: {
      imageSource: 'asset/samuraiMack/Idle.png',
      frames: 8,
    },
    run: {
      imageSource: 'asset/samuraiMack/Run.png',
      frames: 8,
    },
    jump: {
      imageSource: 'asset/samuraiMack/Jump.png',
      frames: 2,
    },
    fall: {
      imageSource: 'asset/samuraiMack/Fall.png',
      frames: 2,
    },
    attackOne: {
      imageSource: 'asset/samuraiMack/Attack1.png',
      frames: 6,
    },
  },
});

const enemy = new Fighter({
  position: {
    x: 100,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: 'blue',
  imageSource: 'asset/kenji/Idle.png',
  frames: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167,
  },
  sprites: {
    idle: {
      imageSource: 'asset/kenji/Idle.png',
      frames: 4,
    },
    run: {
      imageSource: 'asset/kenji/Run.png',
      frames: 8,
    },
    jump: {
      imageSource: 'asset/kenji/Jump.png',
      frames: 2,
    },
    fall: {
      imageSource: 'asset/kenji/Fall.png',
      frames: 2,
    },
    attackOne: {
      imageSource: 'asset/kenji/Attack1.png',
      frames: 4,
    },
  },
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 100,
  },
  imageSource: 'asset/shop.png',
  scale: 3,
  frames: 6,
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};
let lastKey;

function animate() {
  window.requestAnimationFrame(animate);
  cc.fillStyle = 'black';
  cc.fillRect(0, 0, canvas.width, canvas.height);
  bg.update();
  shop.update();
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //Movement

  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -10;
    player.spriteState('run');
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.spriteState('run');
    player.velocity.x = 10;
  } else player.spriteState('idle');

  if (player.velocity.y < 0) {
    player.spriteState('jump');
  } else if (player.velocity.y > 0) {
    player.spriteState('fall');
  }

  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -10;
    enemy.spriteState('run');
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 10;
    enemy.spriteState('run');
  } else enemy.spriteState('idle');

  if (enemy.velocity.y < 0) {
    enemy.spriteState('jump');
  } else if (enemy.velocity.y > 0) {
    enemy.spriteState('fall');
  }

  //Collision
  if (collision({ rect1: player, rect2: enemy }) && player.isAttacking) {
    console.log('ye');
    player.isAttacking = false;
    enemy.health -= 10;
    document.querySelector('#enemyHealth').style.width = enemy.health + '%';
  }
  if (collision({ rect1: enemy, rect2: player }) && enemy.isAttacking) {
    console.log('ye enemy');
    enemy.isAttacking = false;
    player.health -= 10;
    document.querySelector('#playerHealth').style.width = player.health + '%';
  }

  //Ending game
  if (player.health <= 0 || enemy.health <= 0) {
    endState({ player, enemy, timerId });
  }
}

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = true;
      player.lastKey = 'd';
      break;

    case 'a':
      keys.a.pressed = true;
      player.lastKey = 'a';
      break;

    case 'w':
      if (player.velocity.y === 0) {
        player.velocity.y = -15;
      }
      break;

    case ' ':
      player.attack();
      break;

    case 'ArrowRight':
      keys.ArrowRight.pressed = true;
      enemy.lastKey = 'ArrowRight';
      break;

    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = 'ArrowLeft';
      break;

    case 'ArrowUp':
      enemy.velocity.y = -10;
      break;

    case 'ArrowDown':
      enemy.attack();
      break;
  }
});

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;

    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      break;
  }
});

timerTick();
enemy.draw();
player.draw();
animate();
