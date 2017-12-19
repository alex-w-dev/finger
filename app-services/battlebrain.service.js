(function () {
    'use strict';

    angular
        .module('app')
        .factory('Battlebrain', Battlebrain);

    Battlebrain.$inject = ['$http'];
    function Battlebrain(){
      var self = this;
      //vm.game = self;
      this.user;
      this.bot;
      this.userSoldersCount = 0;
      this.botSoldersCount = 0;
      this.solders = new Array();
      this.botStack = new Array();
      this.botInputedTextArray = new Array();
      this.botClickSpeed = 100;
      //this.text = global_text.split('');

      this.run = function(){
        this.user = new User({'type':'user','name':'Imya', 'game':self});
        this.bot = new User({'type':'bot','name':'Bot_name', 'game':self});
        this.user.renewText();
        this.bot.renewText();
        $(document).keypress(function(e){
          self.user.charEnter(String.fromCharCode((e.keyCode)?e.keyCode:e.which));
        });
        $(document).keydown(function(e){
          self.stopBackSpase(e);
        });
        /*bot action!*/
        this.botAction();
        /* server callback */
        this.serverSyncronize();
      }

      this.killSolder = function(i){
        this.solders.splice(i,1);
      }

      this.botAction = function(){
        if(this.botStack.length){
          this.bot.charEnter(this.botStack.splice(0,1));
        }
        setTimeout(function(){self.botAction()}, this.botClickSpeed);
      }

      this.addSolder = function(data){
        /*add to user*/
        if(data.user_solders > this.userSoldersCount){
          for (this.userSoldersCount; this.userSoldersCount < data.user_solders; this.userSoldersCount++) {
            var t = new Solder({'type':'user', 'speed': randomNumber(50,100), 'hits':1, 'game':this});
            t.burn();
            this.solders.push(t);
          };
        }
        /*add to bot*/
        if(data.bot_solders > this.botSoldersCount){
          for (this.botSoldersCount; this.botSoldersCount < data.bot_solders; this.botSoldersCount++) {
            var t = new Solder({'type':'bot', 'speed': randomNumber(50,100), 'hits':1, 'game':this});
            t.burn();
            this.solders.push(t);
          };
        }
      }

      this.serverSyncronize = function(){
        var chars = this.user.chars;
        this.user.chars = new Array;
        $http.post('/api/index.php?r=arena_battle', {'chars':chars}).then( function(response) {
          /*bot_action begin*/
          if(response.data.bot_chars.length && response.data.bot_chars[0]){
            $(eazyComparison(response.data.bot_chars, self.botInputedTextArray)).each(function(){
              self.botStack.push(this[0]);
              self.botInputedTextArray.push(this[0]);
            })
          }
          /*add new solders*/
          self.addSolder(response.data);
          //console.log(data);
        }, 'json')
        setTimeout(function(){self.serverSyncronize()}, 1800);
      }

      this.stopBackSpase = function(e){
        if (!e) var e = window.event;
        if (e.keyCode) var code = e.keyCode;
        else if (e.which) var code = e.which;
        if(code==8) {
          if(e.stopPropagation) e.stopPropagation();
          else e.cancelBubble = true;
          if(e.preventDefault) e.preventDefault();
          else e.returnValue = false;
        }
      }

    }
})();