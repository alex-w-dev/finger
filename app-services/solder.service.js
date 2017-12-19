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

          self.animationSpeed = 100;

          self.game = data.game;
          self.speed = data.speed;
          self.hits = data.hits;
          self.type = data.type;
          self.position = 0;
          self.vector = 1;
          self.scaningEmemy = true;
          //self.mooving;
          self.animateInterval;
          self.moving = true;
          self.status = 'moving';
          self.movePosition = 0;
          self.standPosition = 0;
          self.fighting = false;
          //self.fightFnimation = false;
          self.myKick = true;
          self.enemy = null;
          self.enemyIndex = 0;

          self.folder = data.folder;
          self.json = data.skin;
          self.spritePostament = null;
          self.sprite = null;
          self.moveStyle = null;
          self.standingStyle = null;
          self.deathStyle = null;

          self.burn = function(){
            if(self.type =='bot'){
              self.vector=-1;
              self.position = self.game.battleGroundWidth;
            }else{
              self.game.userSoldersCountForCamera++;
            }

            self.position += FingerFunctions.randomNumber(-50, 50);

            self.spritePostament = $('<div />',{'class':'sprite_postament '+self.type+'_solder_postament'});
            self.sprite = $('<div />',{'class':'solder '+self.type+'_solder'});
            //self.sprite.appendTo(self.div);
            $('#battle_field').append(self.spritePostament);
            self.spritePostament.append(self.sprite);
            self.sprite.css('background',"url('/skins/"+self.folder+"/"+self.json.img+"') no-repeat");

            /*set move style*/
            self.moveStyle = self.json.move[FingerFunctions.randomNumber(0, self.json.move.length-1)];
            /*set standing style*/
            self.standingStyle = self.json.stay[FingerFunctions.randomNumber(0, self.json.stay.length-1)];
            /*set death style*/
            self.deathStyle = self.json.death[FingerFunctions.randomNumber(0, self.json.death.length-1)];

//console.log(self);
            /*moove*/
            //self.move();
            self.animateInterval = setInterval(function(){
              /*move*/
              self.move();
              /* enemy scan*/
              self.findEnemy();
            }, 100);
          }

          self.changeSprite = function(a){
            self.sprite.css({
              'background-position': +a[0]+'px '+a[1]+'px',
              'width': a[2]+'px',
              'height': a[3]+'px',
              'margin-left': a[4]+'px'
            });
            self.spritePostament.css({
              'left': self.position +'px',
              'bottom': a[5]+'px'
            });
          }

          self.move = function(){

            /*moving*/
            if(self.status == 'moving'){
              //console.log(self.moveStyle);
//return false;
              self.position += self.moveStyle.stepWidth/self.moveStyle.animation.length * self.vector;
              //if (self.type == 'user') {console.log(self.position);};
              //if (self.position < 500 ) {self.position = 500};
              //self.sprite.css('left',self.position+'px');
              self.changeSprite(self.moveStyle.animation[self.movePosition]);
              self.movePosition++;
              if(self.movePosition >= self.moveStyle.animation.length)self.movePosition=0;
              if (self.position > (self.game.battleGroundWidth+50) || self.position < -50 ) {
                self.game.solder_winner = self.type;
              };
            }else if(self.status == 'standing'){
              self.changeSprite(self.standingStyle.animation[self.standPosition]);
              self.standPosition++;
              if(self.standPosition >= self.standingStyle.animation.length)self.standPosition=0;
            }
          }

          self.findEnemy = function(){
            if (self != null && self.status == 'moving') {
              for (var i = 0; i < self.game.solders.length; i++) {
                if(
                  self.type != self.game.solders[i].type &&
                  self.game.solders[i].status == 'moving' &&
                  Math.abs(self.game.solders[i].position - self.position) < 20
                ){
                  if(self.game.solders[i].chellenge(self)){
                    self.status = 'standing';
                    self.enemyIndex = i;
                    self.enemy = self.game.solders[i];
                    if(
                      self.myKick ||
                      self.type == 'bot' && self.game.kickStack > 0 ||
                      self.type == 'user' && self.game.kickStack < 0
                    ){
                      self.kickEnemy();
                    }else{
                      self.enemy.kickEnemy();
                    }
                    break;
                  }
                }
              };
            };
      /*      $(self.game.solders).each(function(index, value){
              console.log(value);
            });*/
            //console.log(self.game.solders.length);
          }

          self.getDamage= function(){
            self.myKick = true;
            self.hits--;
            if(self.hits <= 0){
              self.enemy.status = 'moving';
              self.die();
            }else{
              self.kickEnemy();
            }
          }

          self.chellenge = function(enemy){
            if(self.status == 'moving'){
              self.status = 'standing';
              self.enemy = enemy;
              self.enemy.status = 'standing';
              /*add chellenge position, to game to centralize camera!*/
              self.game.chellengeCount++;
              self.game.chellengePositions.push(self.position);
              return true;
            }else{
              return false;
            }
          }


          self.kickEnemy = function(){
            self.myKick = false;
            self.status = 'kicking';
            var kick = self.json.kick[FingerFunctions.randomNumber(0, self.json.kick.length-1)];
            var kickAnimationCount = kick.animation.length;
            var ii = 0;
            var kickingInterval = setInterval(function(){
              //self.fightFnimation = true;

              self.changeSprite(kick.animation[ii]);

              if(++ii >= kickAnimationCount){

                clearInterval(kickingInterval);

                if (self.status == 'die') return false;


                self.status = 'standing';
                self.enemy.getDamage();

                if(self.type == 'bot'){
                  self.game.kickStack--;
                }else{
                  self.game.kickStack++;
                }

                //self.fightFnimation = false;
              }
            }, self.animationSpeed);
          }


          self.die = function(i){
            self.status = 'die';
            clearInterval(self.animateInterval);
            if (self.enemy) {
              self.enemy.enemy = null;
            };

            if(self.type =='user'){
              self.game.userSoldersCountForCamera--;
            }
            self.game.chellengeCount--;

            var deathPosition = 0;
            var interval = setInterval(function(){
              self.changeSprite(self.deathStyle.animation[deathPosition]);
              deathPosition++;
              if(deathPosition >= self.deathStyle.animation.length){
                self.sprite.remove();
                clearInterval(interval);
              }
            },100);

            //self = null;
          }

          return self;
      }
    }

  }
})();