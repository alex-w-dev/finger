(function () {
  'use strict';

  angular
      .module('app')
      .factory('Solder', Solder);

  Solder.$inject = ['FingerFunctions'];
  function Solder(FingerFunctions){
    return {
      newSolder : function(data){
          var self = {};

          self.img = data.img;
          self.div = data.div;
          self.part = data.part;
          self.par = data.animation;
          self.animationPosition = 0;
          self.position = 100;
          self.type = 'front';

          self.burn = function(){
            self.spritePostament = $('<div />',{'class':'sprite_postament'});
            self.sprite = $('<div />',{'class':'solder'});
            //self.sprite.appendTo(self.div);
            $('#sprite_ground').html('').append(self.spritePostament);
            self.spritePostament.append(self.sprite);
            self.sprite.css('background',"url('"+self.img+"') no-repeat");

            /*moove*/
            //self.move();
            self.animateInterval = setInterval(function(){
              if(self.part == 'move')self.move();
              self.animate();
            }, 100);
          }

          self.changeSprite = function(a){

            //console.log(self.sprite);
            //self.sprite.text(a[0]);
            self.sprite.css({
              'background-position': +a[0]+'px '+a[1]+'px',
              'width': a[2]+'px',
              'height': a[3]+'px',
              'margin-left': a[4]+'px'
            });
            self.spritePostament.css({
              'right': self.position +'px',
              'bottom': a[5]+'px'
            });
          }

          self.animate = function(){
              self.changeSprite(self.par.animation[self.animationPosition]);
              self.animationPosition++;
              if(self.animationPosition >= self.par.animation.length)self.animationPosition=0;
          }

          self.move = function(){
              var stepPartWidth = self.par.stepWidth / self.par.animation.length;
              //console.log(self.par.animation.length);
              if(self.type == 'back'){
                self.position += stepPartWidth;
                if(self.position > 300){
                  self.type = 'front';
                  self.spritePostament.removeClass('back_sprite_postament');
                }
              }else{
                self.position -= stepPartWidth;
                if(self.position < -100){
                  self.type = 'back';
                  self.spritePostament.addClass('back_sprite_postament');
                }
              }
          }


          return self;
      }
    }

  }
})();