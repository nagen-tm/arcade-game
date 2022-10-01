window.addEventListener('load', function(){
  // canvas setup
  const canvas = document.getElementById('gameCanvas');
  // this sets 2D or 3D property
  const ctx = canvas.getContext('2d');
  const gameWidth = canvas.width = 1500;
  const gameHeight = canvas.height = 500;

  /* objects:
    each object has a constructor property that creates a new
    object when the class is called. properties are then assigned
    based on the object's design
  */
  class InputHandler {

  }
  class Projectile {

  }
  class Particle {

  }
  class Player {
    constructor(game){
      this.game = game;
      this.width = 120;
      this.height= 190;
      this.x = 20;
      this.y = 100;
      this.speedY = 0.2;
    }
    update(){
      this.y += this.speedY;
    }
    draw(context){
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }
  class Enemy {

  }
  class Layer {

  }
  class Background {

  }
  class UI {

  }
  class Game {
    constructor(width, height){
      this.width = width;
      this.height = height;
      this.player = new Player(this);
    }
    update(){
      this.player.update()
    }
    draw(context){
      this.player.draw(context)
    }
  }

  /* 
  calling the game object that in turn executes its constructor
  and builds out the other objects. the new Game() needs to pass 
  all relevant information
  */
  const game = new Game(gameWidth, gameHeight);

  // animation loop
  function animation(){
    ctx.clearRect(0, 0, gameWidth, gameHeight);
    game.update();
    game.draw(ctx);
    /* 
    tells browser we are making an animation and calls a 
    specific function to update the animation
    passing it the parent function creates and endless 
    animation loop
    */
    requestAnimationFrame(animation);
  }

  animation();
});