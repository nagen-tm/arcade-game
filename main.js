window.addEventListener('load', function(){
  // canvas setup
  const canvas = document.getElementById('gameCanvas');
  // this sets 2D or 3D property
  const ctx = canvas.getContext('2d');
  const gameWidth = canvas.width = 1500;
  const gameHeight = canvas.height = 1000;
  /* objects:
    each class has a constructor property that creates a new object when the class is called. properties are then assigned
    based on the class design
  */
  class InputHandler {
    constructor(game){
      this.game = game;
      // the input handler adds to an array the key press when key is down, removes it from the array when key is up 
      window.addEventListener('keydown', e => {
        // checks if arrow up is pressed and not already in the array this stops holding the up key down continuously
        if(((e.key === 'ArrowLeft') || (e.key === 'ArrowRight')) && this.game.keys.indexOf(e.key) === -1) {
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
      this.y = y;
      this.width = 3;
      this.height= 15;
      this.speed = -3;
      this.markedForDeletion = false;
    }
    update(){
      // removes the laser after getting to 80% of the screen
      this.y += this.speed;
      if (this.y > this.game.width * 0.8) this.markedForDeletion = true;
    }
    draw(context){
      context.fillStyle = '#72D1EE';
      context.fillRect(this.x, this.y, this.width, this.height)
    }
  }
  class Player {
    constructor(game){
      this.game = game;
      this.width = 90;
      this.height= 90;
      this.x = 750;
      this.y = 850;
      this.speedX = 0;
      this.maxSpeed = 5;
      this.projectiles= [];
    }
    update(){
      // updates player behavior from input
      if (this.game.keys.includes('ArrowLeft')) this.speedX = -this.maxSpeed;
      else if (this.game.keys.includes('ArrowRight')) this.speedX = this.maxSpeed;
      else this.speedX = 0
      this.x += this.speedX;
      // updated projectile and removes from array based on boolean
      this.projectiles.forEach(projectile => {
        projectile.update();
      });
      this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);
    }
    draw(context){
      context.fillStyle = '#8CCDE1';
      context.fillRect(this.x, this.y, this.width, this.height);
      this.projectiles.forEach(projectile => {
        projectile.draw(context);
      });
    }
    shoot(){
      // creates projectile based on ammo amount, adjust x, y for positioning on player 
      if (this.game.ammo > 0){
        this.projectiles.push(new Projectile(this.game, this.x + 44, this.y));
        this.game.ammo--;
      }
    }
  }
  class Enemy {
    constructor(game){
      this.game = game;
      this.y = 0;
      this.speedY = Math.random() * 1.5 + 0.5;
      this.markedForDeletion = false;
    }
    update(){
      this.y += this.speedY;
      if(this.y + this.height > this.game.height) this.markedForDeletion = true;
    }
    draw(context){
      context.fillStyle = '#FA71B9';
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }
  // OOP - inheritance of the enemy class 
  class Alien extends Enemy {
    constructor(game){
      // combines the constructor properties from the parent class
      super(game);
      this.width = 50;
      this.height = 50;
      this.lives = 5;
      this.points = 1;
      // random starting position within certain width
      this.x = Math.random() * (this.game.width * 0.8 - this.width);
    }
  }
  class Alien2 extends Enemy {
    constructor(game){
      // combines the constructor properties from the parent class
      super(game);
      this.width = 75;
      this.height = 75;
      this.lives = 8;
      this.points = 2;
      this.x = Math.random() * (this.game.width * 0.8 - this.width);
    }
  }
  class Lives {
    constructor(game){
      this.game = game;
      this.y = 0;
      this.speedY = Math.random() * 1.5 + 0.5;
      this.markedForDeletion = false;
      this.width = 25;
      this.height = 25;

      this.x = Math.random() * (this.game.width * 0.8 - this.width);
    }
    update(){
      this.y += this.speedY;
      if(this.y + this.height > this.game.height) this.markedForDeletion = true;
    }
    draw(context){
      context.fillStyle = '#green';
      context.fillRect(this.x, this.y, this.width, this.height);
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
      //shadow is only set to whats in between save and restore
      context.shadowOffsetX = 2;
      context.shadowOffsetY = 2;
      context.shadowColor = 'black';
      context.fillStyle = this.color;
      context.font = this.fontSize + 'px ' + this.fontFamily;
      // score
      context.fillText('Score: ' + this.game.score, this.game.width - 150, 40);
      // timer, formatting to seconds
      const formattedTime = (this.game.gameTime * 0.001).toFixed(1);
      context.fillText('Timer: ' + formattedTime, this.game.width - 150, 75);
      // ammo amount
      for(let i = 0; i < this.game.ammo; i++){
        context.fillRect(20+5 * i, 50, 3, 20)
      }
      // lives
      for(let i = 0; i < this.game.playerLives; i++){
        context.fillRect(20+25 * i, 20, 20, 20)
      }
      // game over 
      if (this.game.gameOver){
        context.textAlign = 'center';
        context.font = '50px ' + this.fontFamily;
        context.fillText('Game Over!', this.game.width * 0.5, this.game.height * 0.5 - 40);
        context.font = '25px ' + this.fontFamily;
        context.fillText('Better luck next time.', this.game.width * 0.5, this.game.height * 0.5 + 40);
      }
      context.restore();
    }
  }
  class Game {
    /* 
    builds objects from the classes for the game and sets any variables needed 
    passing 'this' to the new objects refers to this Game class, which is needed in each constructor
    */
    constructor(width, height){
      this.width = width;
      this.height = height;
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.ui = new UI(this);
      this.start = false;
      this.keys = [];
      this.enemies = [];
      this.enemyCount = 0;
      this.enemyMiss = 0;
      this.enemyTimer = 0;
      this.enemyInterval = 3000;
      this.ammo = 20;
      this.maxAmmo = 50;
      this.ammoTimer = 0;
      this.ammoInterval = 500;
      this.lives = [];
      this.livesTimer = 0;
      this.livesInterval = 45000;
      this.playerLives = 5;
      this.gameOver = false;
      this.score = 0;
      this.gameTime = 0;
    }
    update(deltaTime){
      // keeping time
      if (!this.gameOver) this.gameTime += deltaTime;
      // update ammo based on timer and max amount
      this.player.update()
      if (this.ammoTimer > this.ammoInterval && !this.gameOver){
        if (this.ammo < this.maxAmmo) this.ammo++
        this.ammoTimer = 0;
      } else {
        this.ammoTimer += deltaTime;
      }
      // collision checks
      this.lives.forEach(life => {
        life.update();
        if (this.collisionCheck(this.player, life)){
          life.markedForDeletion = true;
          if(this.playerLives < 5) this.playerLives++;
        }
      });
      this.enemies.forEach(enemy => {
        enemy.update();
        // update player lives 
        if (this.collisionCheck(this.player, enemy)){
          enemy.markedForDeletion = true;
          this.playerLives--;
          if (this.playerLives === 0) this.gameOver = true;
        }
        // updates score and removes enemy
        this.player.projectiles.forEach(projectile => {
          if(this.collisionCheck(projectile, enemy)){
            enemy.lives--;
            projectile.markedForDeletion = true;
            if (enemy.lives <= 0){
              enemy.markedForDeletion = true;
              if (!this.gameOver) this.score += enemy.points;
            }
          }
        })
        // take a life if too many enemies are missed
        if(enemy.y + enemy.height > this.height) {
          console.log(enemy.y)
          this.enemyMiss++
          if(this.enemyMiss === 5){
            this.playerLives--;
            this.enemyMiss = 0;
            if (this.playerLives === 0) this.gameOver = true;
          }
        }
      });
      this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
      this.lives = this.lives.filter(enemy => !enemy.markedForDeletion);
      // adding enemies over time
      if (this.enemyTimer > this.enemyInterval && !this.gameOver){
        this.addEnemy();
        this.enemyTimer = 0;
        // decrease the enemyInterval depending on how many enemies there have been
        if (this.enemyCount < 10 ) this.enemyCount++
        else this.enemyCount = 0;
        if (this.enemyCount === 10 && this.enemyInterval > 1000) this.enemyInterval -= 100;
      } else {
        this.enemyTimer += deltaTime;
      }
      // extra lives
      if (this.livesTimer > this.livesInterval && !this.gameOver){
        this.lives.push(new Lives(this));
        this.livesTimer = 0;
      } else {
        this.livesTimer += deltaTime;
      }
    }
    draw(context){
      this.player.draw(context)
      this.ui.draw(context);
      this.enemies.forEach(enemy =>{
        enemy.draw(context);
      });
      this.lives.forEach(life => {
        life.draw(context);
      });
    }
    // functions used in update
    addEnemy(){
      const randomize = Math.random();
      if (randomize < 0.5) this.enemies.push(new Alien(this));
      else this.enemies.push(new Alien2(this));
    }
    collisionCheck(rect1, rect2){
      return(
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y &&
        rect1.x < rect2.x + rect2.x &&
        rect1.width + rect1.x > rect2.x
      );
    }
  }
  class Start {
    constructor(width, height){
      this.width = width;
      this.height = height;
      this.fontSize = 25;
      this.fontFamily = 'Helvetica';
      this.color = 'white';    
    }
    draw(context){
      context.shadowOffsetX = 2;
      context.shadowOffsetY = 2;
      context.shadowColor = 'black';
      context.fillStyle = this.color;
      context.font = this.fontSize + 'px ' + this.fontFamily;
      context.textAlign = 'center';
      context.font = '50px ' + this.fontFamily;
      context.fillText('Click to start.', this.width * 0.5, this.height * 0.5 - 40);
    }
  }
  /* 
  calling the game object that in turn executes its constructor and builds out the other objects. the new Game()
  needs to pass all relevant information
  */
  const game = new Game(gameWidth, gameHeight);
  const start = new Start(gameWidth, gameHeight);
  function startScreen(){
    ctx.clearRect(0, 0, gameWidth, gameHeight);
    start.draw(ctx);
    requestAnimationFrame(startScreen);
  }
  startScreen(0)

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

  //starts animation on click
  window.addEventListener('click', function(){
    animation(0);
  })

});