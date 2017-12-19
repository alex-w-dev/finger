(function () {
  'use strict';

  angular
      .module('app')
      .factory('Player', Player);

  //Player.$inject = [];

  function Player () {
    return {
      newPlayer : newPlayer
    }

    function newPlayer(data, vm){
      return{
        textIndex : data.textIndex,
        username : data.username,
        avatar : data.avatar,
        type : data.type,
        skin : data.skin,
        inputed_text : 't',
        error_text : 'e',
        task_text : 'xt',
        kombo : 0,
        chars : new Array(),
        army : new Array(),
        lastWord : 0,
        canvas : null,
        ctx : null,
        canvasWidht : 400,
        canvasHeight : data.canvasHeight,

        init : function(){
          this.canvas = document.getElementById(this.type+'_canvas');
          this.canvas.width = this.canvasWidht;
          this.canvas.height = this.canvasHeight;
          if (this.canvas.getContext){
            this.ctx = this.canvas.getContext('2d');
            this.ctx.font = "24px 'PT Serif'";
            // drawing code here
          } else {
            alert("Your can't play this game, renew your browser!");
          }
        },

        charEnter : function(char){
          this.chars.push(char);
          this.charValidate(char);
        },

        charValidate : function(char){
          if(vm.text[this.textIndex]!=undefined){
            if (vm.text[this.textIndex]==char) {
              this.textIndex++;
              if(this.kombo < 25)this.kombo++;
              this.renewText();
            }else{
              this.kombo = 0;
              this.renewText(true);
            }
          }
        },

        renewText : function(error){
          $(this.canvas).parent().find('.battle_canvas_kombo').text('x'+this.kombo);
          this.ctx.clearRect(0,0,this.canvasWidht,this.canvasHeight);
          this.inputed_text = '';
          this.error_text = '';
          this.task_text = '';
          var text_position = 100;
          for (var i = 0; i < this.textIndex; i++) {
            this.inputed_text += vm.text[i];
          };
          for (var i = this.textIndex; i < vm.text.length; i++) {
            this.task_text += vm.text[i];
          };
          this.ctx.textAlign="right";
          this.ctx.fillStyle = '#d3d3d3';
          this.ctx.fillText(this.inputed_text, text_position, this.canvasHeight-this.canvasHeight/4);
          this.ctx.textAlign="left";
          this.ctx.fillStyle = '#333333';
          this.ctx.fillText(this.task_text, text_position, this.canvasHeight-this.canvasHeight/4);
          if(error){
            this.error_text = this.task_text.charAt(0);
            this.ctx.fillStyle = 'red';
            this.ctx.fillText(((this.error_text==" ")?"_":this.error_text), text_position, this.canvasHeight-this.canvasHeight/4);
          }
          //jQuery('#'+this.type+'_text').toggle();
          /*jQuery('#'+this.type+'_text').find('.inputed_text').text(inputed_text).stop().animate({"margin-left":'-'+(inputed_text.length * 17.0313 - 100)+'px'}).next('.task_text').html((error)?'<span class="error_text">'+task_text.charAt(0)+'</span>' + task_text.substr(1):task_text);*/
        }
      }

      /*return function(data){

        this.name = data.name;
        this.textIndex = 0;
        this.type = data.type;
        this.game = data.game;
        this.chars = new Array();
        this.army = new Array();
        this.lastWord = 0;
        controller.textText = 'dasdasdasd' + data.name;

        this.charEnter = function(char){
          this.chars.push(char);
          if (this.game.text[this.textIndex]==char) {
            this.textIndex++;
            this.renewText();
          }else{
            this.renewText(true);
          }
        }

        this.renewText = function(error){
          controller.textText = 'dasdasdasd' + data.name;
          var inputed_text = '';
          for (var i = 0; i < this.textIndex; i++) {
            inputed_text += this.game.text[i];
          };
          var task_text = '';
          for (var i = this.textIndex; i < this.game.text.length; i++) {
            task_text += this.game.text[i];
          };
          $('#'+this.type+'_text').find('.inputed_text').text(inputed_text).stop().animate({"margin-left":'-'+(inputed_text.length * 17.0313 - 100)+'px'}).next('.task_text').html((error)?'<span class="error_text">'+task_text.charAt(0)+'</span>' + task_text.substr(1):task_text);
        }
      }*/
    }


  }
})();