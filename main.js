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
        this.projectiles.push(new Projectile(this.game, this.x, this.y));
        console.log(this.projectiles);
        this.game.ammo--;
      }
    }
  }
  class Enemy {
    constructor(){
      
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
      context.fillStyle = this.color;
      for(let i = 0; i < this.game.ammo; i++){
        context.fillRect(20+5 * i, 50, 3, 20)
      }
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
      this.ammo = 20;
      this.maxAmmo = 50;
      this.ammoTimer = 0;
      this.ammoInterval = 500;
    }
    update(deltaTime){
      this.player.update()
      if (this.ammoTimer > this.ammoInterval){
        if (this.ammo < this.maxAmmo) this.ammo++
        this.ammoTimer = 0;
      } else {
        this.ammoTimer += deltaTime;
      }
    }
    draw(context){
      this.player.draw(context)
      this.ui.draw(context);
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