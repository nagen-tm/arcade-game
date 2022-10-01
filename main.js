window.addEventListener('load', function(){
  // canvas setup
  const canvas = document.getElementById('gameCanvas');
  // this sets 2D or 3D property
  const ctx = canvas.getContext('2d');
  const gameWidth = canvas.width = 1500;
  const gameHeight = canvas.height = 500;

  /* objects:
    each object has a constructor property that creates a new object when the class is called. properties are then assigned
    based on the object's design
  */
  class InputHandler {
    constructor(game){
      this.game = game;
      // the input handler adds to an array the key press when key is down, removes it from the array when key is up 
      window.addEventListener('keydown', e => {
        // checks if arrow up is pressed and not already in the array this stops holding the up key down continuously
        if(((e.key === 'ArrowUp') || (e.key === 'ArrowDown')) && this.game.keys.indexOf(e.key) === -1) {
          this.game.keys.push(e.key);
        } else if (e.key === ' '){
          this.game.player.shoot();
        }
      });

      window.addEventListener('keyup', e => {
        let keyIndex = this.game.keys.indexOf(e.key);
        if (keyIndex > -1){
          this.game.keys.splice(keyIndex, 1);
        }
      });
    }
  }
  class Projectile {
    constructor(game, x, y){
      this.game = game;
      this.x = x;
      this.y =y;
      this.width = 10;
      this.height= 3;
      this.speed = 3;
      this.markedForDeletion = false;
    }
    update(){
      // removes the laser after getting to 80% of the screen
      this.x += this.speed;
      if (this.x > this.game.width * 0.8) this.markedForDeletion = true;
    }
    draw(context){
      context.fillStyle = 'yellow';
      context.fillRect(this.x, this.y, this.width, this.height)
    }
  }
  class Particle {
    constructor(){
      
    }
  }
  class Player {
    constructor(game){
      this.game = game;
      this.width = 120;
      this.height= 190;
      this.x = 20;
      this.y = 100;
      this.speedY = 0;
      this.maxSpeed = 2;
      this.projectiles= [];
    }
    update(){
      // updates player behavior from input
      if (this.game.keys.includes('ArrowUp')) this.speedY = -this.maxSpeed;
      else if (this.game.keys.includes('ArrowDown')) this.speedY = this.maxSpeed;
      else this.speedY = 0
      this.y += this.speedY;
      // updated projectile and removes from array based on boolean
      this.projectiles.forEach(projectile => {
        projectile.update();
      });
      this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);
    }
    draw(context){
      context.fillStyle = 'black';
      context.fillRect(this.x, this.y, this.width, this.height);
      this.projectiles.forEach(projectile => {
        projectile.draw(context);
      });
    }
    shoot(){
      // creates projectile based on ammo amount 
      if (this.game.ammo > 0){
        this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 30));
        this.game.ammo--;
      }
    }
  }
  class Enemy {
    constructor(game){
      this.game = game;
      this.x = this.game.width;
      this.speedX = Math.random() * -1.5 - 0.5;
      this.markedForDeletion = false;
      this.lives = 5;
      this.score = this.lives;
    }
    update(){
      this.x += this.speedX;
      if(this.x + this.width < 0) this.markedForDeletion = true;
    }
    draw(context){
      context.fillStyle = 'red';
      context.fillRect(this.x, this.y, this.width, this.height);
      context.fillStyle ='black';
      context.font = '20px Helvetica';
      context.fillText(this.lives, this.x, this.y);
    }
  }
  // OOP - inheritance of the enemy class 
  class Angler extends Enemy {
    constructor(game){
      // combines the constructor properties from the parent class
      super(game);
      this.width = 50;
      this.height = 50;
      this.y = Math.random() * (this.game.height * 0.9 - this.height);
    }
  }
  class Layer {
    constructor(){
      
    }
  }
  class Background {
    constructor(){
      
    }
  }
  class UI {
    constructor(game){
      this.game = game;
      this.fontSize = 25;
      this.fontFamily = 'Helvetica';
      this.color = 'white';
    }
    draw(context){
      // save and restore saves the contexts at that time, and its restored at context.restore
      context.save();
      //shadow is only set to whats inbetween save and restore
      context.shadowOffsetX = 2;
      context.shadwoOffsetY = 2;
      context.shadowColor = 'black';
      // ammo amount
      context.fillStyle = this.color;
      for(let i = 0; i < this.game.ammo; i++){
        context.fillRect(20+5 * i, 50, 3, 20)
      }
      // score
      context.font = this.fontSize + 'px' + this.fontFamily;
      context.fillText('Score: ' + this.game.score, 20, 40);
      // game over 
      if (this.game.gameOver){
        context.textAlign = 'center';
        let message1;
        let message2;
        if (this.game.score > this.game.winningScore){
          message1 = 'You Win!';
          message2 = 'Well Done!';
        } else {
          message1 = 'You Lose!';
          message2 = 'Try again.';
        }
        context.font = '50px' + this.fontFamily;
        context.fillText(message1, this.game.width * 0.5, this.game.height * 0.5 - 40);
        context.font = '25px' + this.fontFamily;
        context.fillText(message2, this.game.width * 0.5, this.game.height * 0.5 + 40);
      }
      context.restore();
    }
  }
  class Game {
    // builds all objects from the classes for the game
    constructor(width, height){
      this.width = width;
      this.height = height;
      // passing this to the new objects refers to this Game class
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.ui = new UI(this);
      this.keys = [];
      this.enemies = [];
      this.enemyTimer = 0;
      this.enemyInterval = 1000;
      this.ammo = 20;
      this.maxAmmo = 50;
      this.ammoTimer = 0;
      this.ammoInterval = 500;
      this.gameOver = false;
      this.score =0;
      this.winningScore = 10;
    }
    update(deltaTime){
      this.player.update()
      if (this.ammoTimer > this.ammoInterval){
        if (this.ammo < this.maxAmmo) this.ammo++
        this.ammoTimer = 0;
      } else {
        this.ammoTimer += deltaTime;
      }

      // same thing as projectiles
      this.enemies.forEach(enemy => {
        enemy.update();
        if (this.collisionCheck(this.player, enemy)){
          enemy.markedForDeletion = true;
        }
        this.player.projectiles.forEach(projectile => {
          if(this.collisionCheck(projectile, enemy)){
            enemy.lives--;
            projectile.markedForDeletion = true;
            if (enemy.lives <= 0){
              enemy.markedForDeletion = true;
              this.score+= enemy.score;
              if (this.score > this.winningScore) this.gameOver = true;
            }
          }
        })
      });
      this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
      if (this.enemyTimer > this.enemyInterval && !this.gameOver){
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }
    }
    draw(context){
      this.player.draw(context)
      this.ui.draw(context);
      this.enemies.forEach(enemy =>{
        enemy.draw(context);
      });
    }
    // same as when we recharged the ammo
    addEnemy(){
      this.enemies.push(new Angler(this));
    }
    collisionCheck(rect1, rect2){
      return(
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.y &&
        rect1.height + rect1.y > rect2.y
      );
    }
  }

  /* 
  calling the game object that in turn executes its constructor and builds out the other objects. the new Game()
  needs to pass all relevant information
  */
  const game = new Game(gameWidth, gameHeight);
  let lastTime = 0;

  // animation loop
  function animation(timeStamp){
    // to calculate the time for regenerating ammo, deltaTime compares current time stamp to last time stamp
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    ctx.clearRect(0, 0, gameWidth, gameHeight);
    game.update(deltaTime);
    game.draw(ctx);
    /* 
    tells browser we are making an animation and calls a specific function to update the animation passing it the 
    parent function creates and endless animation loop
    */
    requestAnimationFrame(animation);
  }

  animation(0);
});