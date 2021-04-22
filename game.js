var game = function() {

    var Q = window.Q = Quintus()
            .include(["Sprites", "Scenes", "Input", "2D", "UI", "Anim", "TMX"])
            .setup("myGame")
            .controls();
    
    
        Q.Sprite.extend("Mario", {
            
            init: function(p) {
              this._super(p,{
                sheet: "marioR",
                x: 250,
                y: 250,
                frame: 0,
                scale: 3
              });
              Q.input.on("left", this, function() { this.p.x -= 10; });
              Q.input.on("right", this, function() { this.p.x += 10; });
              Q.input.on("up", this, function() { this.p.y -= 10; });
              Q.input.on("down", this, function() { this.p.y += 10; });
    
            }
          });
    
        Q.Sprite.extend("OneUp", {
            init: function(p) {
              this._super(p,{
                asset: "1up.png",
                scale: 0.3,
                 x: 20,
                 y: -10
              });
            }
          });
    
    
        Q.load([ "mario_small.png","mario_small.json", "1up.png", "bg.png", "mapa2021.tmx", "tiles.png" ], function() {
         
          Q.compileSheets("mario_small.png","mario_small.json");
          
           Q.scene("level1", function(stage) {
                 /*
                   stage.insert(
                       new Q.Repeater({asset: "bg.png", speedX: 0.5, speedY: 0.5})
                   );
                   */
                   Q.stageTMX("mapa2021.tmx", stage);
    
                 mario = new Q.Mario();
                 stage.insert(mario);
                 stage.insert(new Q.OneUp(), mario);
                  
                 stage.add("viewport").follow(mario,{x:true, y:false});
                 stage.viewport.scale = .75;
                 stage.viewport.offsetX = -200;
                stage.on("destroy",function() {
                    mario.destroy();
                });
           });
    
           Q.stageScene("level1");
    
        });
    }