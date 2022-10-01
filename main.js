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
        }
        console.log(this.game.keys);
      });

      window.addEventListener('keyup', e => {
        let keyIndex = this.game.keys.indexOf(e.key);
        if (keyIndex > -1){
          this.game.keys.splice(keyIndex, 1);
        }
        console.log(this.game.keys);
      });
    }
  }
  class Projectile {
    constructor(){
      
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
    }
    update(){
      // updates player behavior from input
      if (this.game.keys.includes('ArrowUp')) this.speedY = -this.maxSpeed;
      else if (this.game.keys.includes('ArrowDown')) this.speedY = this.maxSpeed;
      else this.speedY = 0
      this.y += this.speedY;
    }
    draw(context){
      context.fillRect(this.x, this.y, this.width, this.height);
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
    constructor(){
      
    }
  }
  class Game {
    constructor(width, height){
      this.width = width;
      this.height = height;
      // passing this to the new objects refers to this Game class
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.keys = [];
    }
    update(){
      this.player.update()
    }
    draw(context){
      this.player.draw(context)
    }
  }

  /* 
  calling the game object that in turn executes its constructor and builds out the other objects. the new Game()
  needs to pass all relevant information
  */
  const game = new Game(gameWidth, gameHeight);

  // animation loop
  function animation(){
    ctx.clearRect(0, 0, gameWidth, gameHeight);
    game.update();
    game.draw(ctx);
    /* 
    tells browser we are making an animation and calls a specific function to update the animation passing it the 
    parent function creates and endless animation loop
    */
    requestAnimationFrame(animation);
  }

  animation();
});