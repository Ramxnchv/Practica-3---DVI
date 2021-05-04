var game = function() {

    var Q = window.Q = Quintus()
            .include(["Sprites", "Scenes", "Input", "2D", "UI", "Anim", "TMX", "Audio", "Touch"])
            .setup("myGame",{
              width: 800,
              height:600,
              scaleToFit: true
            })
            .controls().controls().enableSound().touch();
    
    
    Q.Sprite.extend("Mario", {
      init: function(p) {
        this._super(p,{
        sheet: "mario",
        sprite: "mario_anim",
        x:100,
        y:100,
        frame: 0,
        scale: 1.5,
        gravityY: 550
        });
        this.add("2d , platformerControls, animation, tween, dancer");
        Q.input.on("up", this, function(){
          if (this.p.vy == 0){
                  Q.audio.play("jump_small.mp3"); 
              }
        });
        Q.input.on("fire", this, "dance");
      },

      step: function(dt){
        if(this.p.vx > 0){
            this.play("walk_right");
          } else if(this.p.vx < 0){
            this.play("walk_left");
          }

          if(this.p.vy < 0){
            if(this.p.vx < 0)
              this.play("jump_left");

            else if(this.p.vx > 0)
              this.play("jump_right");

          }

          if(this.p.y > 700){
            this.p.y = 100;
            this.p.x = 100;
            this.die();
          }
      },
      die: function(){

        Q.state.dec("lives", 1);
        if(Q.state.get("lives") < 0){
          this.destroy();
          Q.audio.stop();
          Q.audio.play("music_die.mp3");
          Q.stageScene("endGame", 2);
        }
      },
      movFin: function () {
        Q.audio.stop();
        Q.audio.play('music_level_complete.ogg', { debounce: 10000 });
        this.del("platformerControls");
        this.add("aiMario");
        this.p.vx = 80;
      },
      goDown: function (destX, destY) {
        Q.audio.play('down_pipe.ogg', { debounce: 100 });
        this.p.x = destX;
        this.p.y = destY;
      }
    });


    
    Q.Sprite.extend("OneUp", {
      init: function(p) {
        this._super(p,{
        asset: "1up.png",
        scale: 1,
        x: 20,
        y: -10,
        sensor: true,
        taken: false
        });
        this.on("sensor", this, "hit");
        this.add("tween");
      },
      hit: function(collision){

        if(this.taken) return;
        if(!collision.isA("Mario")) return;

        this.taken = true;
        Q.state.inc("lives", 1);
        console.log(Q.state.get("lives"));
        //collision.p.vy = -400;
        Q.audio.play("1up.mp3");
        this.animate({y:this.p.y - 50, angle: 360}, 0.5, Q.Easing.Quadratic.In, {callback: function(){this.destroy();}});
      }
    
    });

    //Monedas
    Q.Sprite.extend("Coin", {
      init: function(p) {
        this._super(p,{
        asset: "coin.png",
        sheet: "coin",
        sprite: "Coin",
        sensor: true,
        taken: false,
        gravityY: 0
        });
        this.add("2d,animation");
        this.play("coin");
        this.on("sensor", this, "hit");
        this.add("tween");
      },
      hit: function(collision){

        if(this.taken) return;
        if(!collision.isA("Mario")) return;

        this.taken = true;
        //Q.state.inc("coins", 1);
        //console.log(Q.state.get("coins"));
        //collision.p.vy = -400;
        Q.audio.play("coin.mp3");
        Q.state.inc("score", 10);
        Q.state.inc("coins", 1);
        this.countCoins();
        this.animate({y:this.p.y - 50, angle: 0}, 0.5, Q.Easing.Quadratic.In, {callback: function(){this.destroy();}});
      },
      countCoins:function(){
        if( Q.state.get("coins")=== Q.state.get("coins1Up")){
            Q.state.inc("lives",1);
            Q.state.inc("score", 10);
            Q.state.set("coins",0);
        }
    }
    
    });

    //Bandera
    Q.Sprite.extend("Flag", {
      init: function(p) {
        this._super(p,{
        asset: "flag.png",
        sensor: true,
        });
        this.on("sensor", this, "hit");
        this.add("tween");
      },
      win: function(collision){
        if(!collision.isA("Mario")) return;
        console.log(Q.state.get("Has tocado la bandera"));
        Q.audio.play("flagpole_slide.mp3");
        //this.animate({y:this.p.y - 50, angle: 360}, 0.5, Q.Easing.Quadratic.In, {callback: function(){this.destroy();}});
        collision.obj.die();
      }
    
    });

    
    Q.Sprite.extend("Goomba", {
      init: function(p) {
        this._super(p,{
        sheet: "goomba",
        x:400+(Math.random()*200),
        y:250,
        frame: 0,
        vx: 100,
        });
        this.add("2d, aiBounce, animation");
        this.on("bump.top", this, "onTop");
        this.on("bump.bottom, bump.left, bump.right", this, "kill");
        

      },
      onTop: function(collision){
        if(!collision.obj.isA("Mario")) return;
        collision.obj.p.vy = -200;
        console.log("Goomba dies");
        Q.state.inc("score", 100);
        Q.audio.play("kill_enemy.mp3");
        this.destroy();
      },
      kill: function(collision){
        if(!collision.obj.isA("Mario")) return;
        collision.obj.p.vy = -200;
        collision.obj.p.vx = collision.normalX*-500;
        collision.obj.p.x += collision.normalX*-5;
        collision.obj.die();
      }
    });

    Q.Sprite.extend("Bloopa", {
      init: function(p) {
        this._super(p,{
        sheet: "bloopa",
        sprite: "Bloopa",
        frame: 0,
        vy: -100,
        gravity: 10
        });
        this.add("2d, aiBounce, animation");
        this.play("bloopa");
        this.on("bump.top", this, "onTop");
        this.on("bump.bottom, bump.left, bump.right", this, "kill");

      },
      onTop: function(collision){
        if(!collision.obj.isA("Mario")) return;
        collision.obj.p.vy = -200;
        console.log("Bloopa dies");
        Q.state.inc("score", 100);
        Q.audio.play("kill_enemy.mp3");
        this.destroy();
      },
      kill: function(collision){
        if(!collision.obj.isA("Mario")) return;
        collision.obj.p.vy = -200;
        collision.obj.p.vx = collision.normalX*-500;
        collision.obj.p.x += collision.normalX*-5;
        collision.obj.die();
      },
      step:function(){
        if(this.p.y > 700 ){
          //this.p.vy = 500;
        }
        if(this.die) 
            this.muerteCont++;
        if(this.muerteCont===15) this.play("bloopaDieStop");
        else if(this.muerteCont===25)
            this.destroy();
    }
    });

    Q.Sprite.extend("Flag",{ 
      init: function(p) { 
          this._super(p, { 
              asset: "flag.png",
              goDown:false,
              limInf:0,
              gravity:0,
              vy:0
          });
          this.add("2d");
          this.on("bump.top,bump.left,bump.down",this,"captura");
      },
      step:function(){
          if(this.p.goDown && this.p.y<this.p.limInf){
                  this.p.y+=5;
          }   
      },
      captura:function(collision){
          this.del("2d");
          this.p.goDown=true;
          collision.obj.p.bandera=true;
          Q.state.inc("score",Q.state.get("valBandera"));
          collision.obj.movFin();
      }
  });
    
    Q.load(["mario_small.png" , "mario_small.json" , "1up.png", "bg.png", "mapa.tmx", "tiles.png", "goomba.png", "goomba.json", "music_main.mp3", "title-screen.png", "music_die.mp3", "1up.mp3", "kill_enemy.mp3", "jump_small.mp3", "coin.png", "coin.json", "coin.mp3", "bloopa.png", "bloopa.json"], 
    function(){
    
      Q.compileSheets("mario_small.png", "mario_small.json" );
      Q.compileSheets("goomba.png", "goomba.json" );
      Q.compileSheets("coin.png", "coin.json" );
      Q.compileSheets("bloopa.png","bloopa.json");

      
      Q.state.set({ score: 0, lives: 4, coins: 0, coins1Up: 100, //Points
        pause:false,enJuego:false, //States
        valCoin:10,valEnemy:100,valBandera:600,valFinNivel:400 // Points/action
      });
      
      Q.animations("mario_anim",{
         walk_right: {frames: [1,2,3],rate: 1/6, next: "parado_r" },
         walk_left: {frames: [15,16,17],rate: 1/6, next: "parado_l" },
         jump_right: {frames: [4],rate: 1/6, next: "parado_r" },
         jump_left: {frames: [18],rate: 1/6, next: "parado_l" },
         parado_r: {frames: [0] },
         parado_l: {frames: [14] },
         morir:{frames: [12],rate:1/8}
      });

      Q.animations('Coin', {
        coin: { frames: [0,1,2], rate: 1/2}
      });

      Q.animations('Goomba', {
        goomba: { frames: [0,1], rate: 1/3},
        goombaDie: { frames: [1,2,3], rate: 1/3}
      });

      Q.animations('Bloopa', {
        bloopa: { frames: [0,1], rate: 1/2 },
        bloopaDie: { frames: [2,3], rate: 1/3},
        bloopaDieStop: { frames: [2], rate: 1}
    });

      Q.scene("level1", function(stage){
        /*
        stage.insert(new Q.Repeater(
          {asset: "bg.png", speedX: 0.5, speedY: 0.5})
        );
        */
        Q.stageTMX("mapa.tmx", stage);

        mario = new Q.Mario();
        stage.insert(mario);

        stage.add("viewport").follow(mario, {x:true , y:false});
        stage.viewport.scale = .75;
        stage.viewport.offsetX = -200;

        stage.on("destroy", function(){
          mario.destroy();
        });
        
        
        Q.state.reset({lives: 2, coins: 0, score: 0});

        Q.audio.play("music_main.mp3", {loop:true});

      });

      Q.scene("hud", function(stage){
        label_lives = new Q.UI.Text({x:90, y:0, label: "Lives: 2"});
        stage.insert(label_lives);
        Q.state.on("change.lives", this, function(){
          label_lives.p.label = "Lives: " + Q.state.get("lives");
        });
        /*Hola, lo mismo la lio asi que mi codigo espagueti empieza desde aqui*/
        label_coins = new Q.UI.Text({x:400, y:0, label: "Coins: 0"});
        stage.insert(label_coins);
        Q.state.on("change.coins", this, function(){
          label_coins.p.label = "Coins: " + Q.state.get("coins");
        });
        label_score = new Q.UI.Text({x:700, y:0, label: "Score: 0"});
        stage.insert(label_score);
        Q.state.on("change.score", this, function(){
          label_score.p.label = "Score: " + Q.state.get("score");
        });
      });


      Q.scene("mainTitle", function(stage){
        var button = new Q.UI.Button({
          x:Q.width/2,
          y:Q.height/2,
          asset: "title-screen.png"
        }); 
        button.on("click", function(){
          Q.clearStages();
          Q.stageScene("level1", 1);
          Q.stageScene("hud", 2);
        });
        stage.insert(button);
      });

      Q.scene('endGame',function(stage) {
        var container = stage.insert(new Q.UI.Container({
          x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
        }));
        var button2 = container.insert(new Q.UI.Button({
          x: 0, y: 0, fill: "#CCCCCC", label: "Play Again"
        }));
        var label = container.insert(new Q.UI.Text({
          x:10, y: -10 - button2.p.h, label: "You Lose!"
        }));
        // When the button is clicked, clear all the stages
        // and restart the game.
        button2.on("click",function() {
          Q.clearStages();
          Q.stageScene('mainTitle');
        });
        // Expand the container to visibly fit it's contents
        // (with a padding of 20 pixels)
        container.fit(20);
      });

      Q.stageScene("mainTitle");
    
    });
}