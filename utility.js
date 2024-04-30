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
