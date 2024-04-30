const canvas = document.querySelector('canvas');
const cc = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

cc.fillRect(0, 0, canvas.width, canvas.height);
const gravity = 0.2;

const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
});

player.draw();

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
  offset: {
    x: 50,
    y: 0,
  },
});

enemy.draw();

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

function animate() {
  window.requestAnimationFrame(animate);
  cc.fillStyle = 'black';
  cc.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //Movement
  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -10;
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 10;
  }

  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -10;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 10;
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

function endState({ player, enemy, timerId }) {
  clearTimeout(timerId);
  document.querySelector('#text').style.display = 'flex';
  if (player.health === enemy.health) {
    document.querySelector('#text').innerHTML = 'Tie';
  } else if (player.health > enemy.health) {
    document.querySelector('#text').innerHTML = 'Player Won!';
  } else if (enemy.health > player.health) {
    document.querySelector('#text').innerHTML = 'Enemy Won!';
  }
}

function collision({ rect1, rect2 }) {
  return (
    rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x &&
    rect1.attackBox.position.x <= rect2.position.x + rect2.width &&
    rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y &&
    rect1.attackBox.position.y <= rect2.position.y + rect2.height
  );
}

let timer = 30;
let timerId;
function timerTick() {
  if (timer > 0) {
    timerId = setTimeout(timerTick, 1000);
    timer--;
    document.querySelector('#timer').innerHTML = timer;
  }
  if (timer === 0) {
    endState({ player, enemy, timerId });
  }
}

timerTick();

animate();

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
      player.velocity.y = -10;
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
