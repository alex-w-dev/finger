(function () {
    'use strict';

    angular
        .module('app')
        .controller('BattleController', BattleController);

    BattleController.$inject = ['FingerFunctions', 'base64', 'UserService', '$rootScope', '$http', '$location', '$document', 'Solder', 'Player'];
    function BattleController(FingerFunctions, base64, UserService, $rootScope, $http, $location, $document, Solder, Player) {
        var vm = this;
        //vm.window = 'connecting';

        vm.reNewGame = function(){
          vm.ii = false;
          vm.surrender = false;

          vm.battleGroundWidth = 2000;
          vm.botDificult = 6; /* 180 символов в минуту ! */
          vm.battleGroundZoom = 1;
          vm.battleGroundPostamentPosition = 100;

          //vm.user = Player.newPlayer((UserService.GetUser()), vm);
          //vm.user.type = 'user';
          vm.user = null;
          vm.bot = null;
          vm.botClickSpeed = 100;
          /*need to input action bot */
          vm.botStack = new Array();
          /*all inputed chars of bot to clect chars to botCtack at next teme of sincronese ot server*/
          vm.botInputedTextArray = new Array();

          /* to correct camera*/
          vm.chellengeCount = 0;
          vm.chellengePositions = new Array();

          //vm.kickStack = 0;
          vm.userSoldersCount = 0;
          vm.botSoldersCount = 0;
          vm.renewSolders();

          vm.text  = null;
          vm.waitingApponentCount = 60;

          vm.game = null;
          vm.connecting = true;
          vm.sincronesing = false;

          vm.endBattleWindow = false;
          vm.endBattle = {};

          /* NEED TO FIX !!!!!!!!!!!!!!!!!!! */
          //vm.KOSTIL = $('#KOSTIL');
          //vm.KOSTIL.off();
          //vm.KOSTILFUNCTION = function(){;};
          vm.solder_winner = null;

          $(document).off();

          vm.battleConnecting();

        }

        vm.renewSolders = function(){
          if (vm.solders) {
            for (var i = 0; i < vm.solders.length; i++) {
              vm.solders[i].die();
            };
          };
          vm.userSoldersCountForCamera = 0;
          vm.solders = new Array();
          vm.soldersPower = new Array();
        }

        vm.battleConnecting = function(){
          console.log(!vm.connecting, $location.path()!='/battle');
          if(!vm.connecting || $location.path()!='/battle')return false;
          $http.get('/api/index.php?r=arena_prepare&command=here').then(function(response) {
            /*если запрос был уже отправлен*/
            if(!vm.connecting)return false;
            if (response.data.result == "to_battle") {
              vm.startGame();
            };
            if (response.data.result == "wait") {
              if(vm.waitingApponentCount <= 0){
                vm.ii = true;
                vm.startGame()
              }else{
                vm.waitingApponentCount--;
                setTimeout(vm.battleConnecting, 1000);
              }
            };
          });
        }

        vm.addTimeWaiting = function(){
          vm.waitingApponentCount += 60;
        }

        vm.goIiNow = function(){
          vm.waitingApponentCount = -1;
        }

        vm.startGame = function(){
          if($location.path()!='/battle')return false;
          vm.connecting = false;
          $http.get('/api/index.php?r=arena_run'+((vm.ii)?'&ii':"")).then(function(response) {
            //vm.window = 'battle';
            /*var text_array = FingerFunctions.decode64(response.data.text, response.data.key);
            vm.text = new Array();
            for (var i = 0; i < text_array.length; i++) {
              vm.text.push([text_array[i], 17.0313])
            };*/

            /*text encoding !!!!!!!  */
            vm.text = base64.decode(response.data.text);
            //console.log(response.data.user);
            response.data.user.type = 'user';
            response.data.user.canvasHeight = 50;
            response.data.bot.type = 'bot';
            response.data.bot.canvasHeight = 40;
            response.data.user.textIndex = parseInt(response.data.user_text_index);
            response.data.bot.textIndex = parseInt(response.data.bot_text_index);
            //response.data.bot.skin
            /* players create*/
            vm.user = Player.newPlayer(response.data.user, vm);
            vm.bot = Player.newPlayer(response.data.bot, vm);
            vm.user.init();
            vm.bot.init();
            vm.text = FingerFunctions.saveText(vm.text, response.data.key);

            for (var i = 0; i < vm.text.length; i++) {
              if (vm.text[i] == ' '){
                var soldr_power = 0;
                  //console.log(i);
                for (var j = i-1; j >= 0; j--){
                  soldr_power++;
                  if(j == 0 || vm.text[j] == ' '){
                    //console.log(soldr_power);
                    vm.soldersPower.push(soldr_power);
                    break;
                  }
                }
              }
            };
            vm.ii = response.data.ii;
            //var row = 0;


            vm.user.renewText();
            vm.bot.renewText();

            var time_wait = response.data.time_wait;
            function waitingStart(){
              if(time_wait > 0){
                //$('.battle_central_shield').hide();
                $('#timeWaiting').show();
                $('#timeWaiting').find('#waiting_ost').text(time_wait);
                time_wait--;
                setTimeout(waitingStart, 1000);
              }else{
                //$('.battle_central_shield').show();
                $('#timeWaiting').hide();
                vm.battleStart();
              }
            }
            waitingStart();
          });

        }

        vm.battleStart = function(){
          if(vm.user != null && vm.bot !=null ){

            $(document).keypress(function(e){
              vm.user.charEnter(String.fromCharCode((e.keyCode)?e.keyCode:e.which));
              /* NEED TO FIX !!!!!!!!!!!!!!!!!*/
              //vm.KOSTIL.trigger('click');
            });
            $(document).keydown(function(e){
              if (!e) var e = window.event;
              if (e.keyCode) var code = e.keyCode;
              else if (e.which) var code = e.which;
              // 32 пробел
              if (code==32) {
                vm.user.charEnter(String.fromCharCode(code));
                /* NEED TO FIX !!!!!!!!!!!!!!!!!*/
                //vm.KOSTIL.trigger('click');
              };

              if(code==8 || code==32) {
                if(e.stopPropagation) e.stopPropagation();
                else e.cancelBubble = true;
                if(e.preventDefault) e.preventDefault();
                else e.returnValue = false;
              }
              //vm.stopBackSpase(e);
            });
            /*go game*/
            $rootScope.gaming = true;
            /* bot (apponent) action simulate */
            vm.botAction();
            /* my game synchronized width server*/
            vm.sincronesing = true;
            vm.serverSyncronize();
          }else{
            alert('where are users?');
          }
        }

        vm.stopBackSpase = function(e){
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

        vm.botAction = function(){
          if(vm.botStack.length){
            vm.bot.charEnter(vm.botStack.splice(0,1));
          }
          setTimeout(function(){vm.botAction()}, vm.botClickSpeed);
        }


        vm.serverSyncronize = function(){
          if($location.path()!='/battle' || !vm.sincronesing)return false;
          var to_serv = {};
          to_serv.chars = vm.user.chars;
          vm.user.chars = new Array();

          /* simulate Intelect ! */
          if(vm.ii){
            to_serv.bot_chars = new Array();
            for (var i = 0; i < vm.botDificult; i++) {
              if(vm.text[vm.bot.textIndex+i] != undefined){
                to_serv.bot_chars.push(vm.text[vm.bot.textIndex+i]);
                vm.botStack.push(vm.text[vm.bot.textIndex+i]);
              }
            };
          }

          if(vm.solder_winner){
            to_serv.solder_winner = vm.solder_winner;
          }
          if (vm.surrender) {
            to_serv.surrender = 1;
          };

          $http.post('/api/index.php?r=arena_battle', to_serv).then( function(response) {
            /*bot_action begin*/
            /*if(!vm.ii && response.data.bot_chars.length && response.data.bot_chars[0]){
              $(FingerFunctions.eazyComparison(response.data.bot_chars, vm.botInputedTextArray)).each(function(){
                vm.botStack.push(this[0]);
                vm.botInputedTextArray.push(this[0]);
              })
            }*/
            if(!vm.ii && response.data.bot_text_index){
              for (var i = 0; i < (response.data.bot_text_index - vm.bot.textIndex); i++) {
                vm.botStack.push(vm.text[vm.bot.textIndex+i]);
              }
            }
            /*add new solders*/
            vm.addSolder(response.data);

            /*end of batle */
            if(response.data.battle_end){
              vm.sincronesing = false;
              if (response.data.battle_end == 'winner') {
                vm.endBattleWindow =  'winner';
              }else{ /*looser*/
                vm.endBattleWindow =  'looser';
              };
              vm.endBattle = response.data;
              vm.renewSolders();
            }
            //console.log(data);
          }, 'json')



          /*there we change battleGroundPostamentPosition to correct camera on battleField*/
          vm.correctBattleGroundPostamentPosition();




          setTimeout(function(){vm.serverSyncronize()}, 2000);
        }


        /* CORRECT AUTO CAMERA */
        vm.correctBattleGroundPostamentPosition = function(){
          //console.log(vm.chellengeCount);
          if (vm.chellengeCount) {
            var summChPos = 0;
            for (var i = 0; i < vm.chellengePositions.length; i++) {
              summChPos += vm.chellengePositions[i];
            };
            if(summChPos){
              vm.battleGroundPostamentPosition = summChPos/vm.chellengePositions.length;
            }
            vm.chellengePositions = [];
          }else if(vm.userSoldersCountForCamera == 0 && vm.solders.length){
            var min_bot_position = vm.battleGroundWidth;
            for (var i = 0; i < vm.solders.length; i++) {
              if (min_bot_position > vm.solders[i].position) {
                min_bot_position = vm.solders[i].position;
              };
            };
            vm.battleGroundPostamentPosition = min_bot_position;
          }else {
            var max_user_position = 0;
            for (var i = 0; i < vm.solders.length; i++) {
              if (vm.solders[i].type == 'user' && vm.solders[i].hits > 0 && max_user_position < vm.solders[i].position) {
                max_user_position = vm.solders[i].position;
              };
            };
            vm.battleGroundPostamentPosition = max_user_position;
          }
        }

        vm.killSolder = function(i){
          vm.solders.splice(i,1);
        }



        vm.solderCreating = function(type, index){
          var maxPower = 12;
          var power = vm.soldersPower[index];
          if (power > maxPower) {power = maxPower};
          if (power < 0) {power = 0};
          //console.log(vm.user.skin.solders.length);
          var numberSkin = Math.round(vm[type].skin.solders.length / (maxPower / power)) - 1;
          if (numberSkin < 0 ) {numberSkin = 0};
          //console.log(vm[type].skin);
          var t = Solder.newSolder({
            'type':type,
            'skin':vm[type].skin.solders[numberSkin],
            'folder':vm[type].skin.folder,
            'speed': FingerFunctions.randomNumber(50,100),
            'hits':power,
            'game':vm
          });
          t.burn();
          vm.solders.push(t);
        }

        vm.addSolder = function(data){
          /*add to user*/
          if(data.user_solders > vm.userSoldersCount){
            for (vm.userSoldersCount; vm.userSoldersCount < data.user_solders; vm.userSoldersCount++) {
              vm.solderCreating('user',vm.userSoldersCount);
            };
          }
          /*add to bot*/
          if(data.bot_solders > vm.botSoldersCount){
            for (vm.botSoldersCount; vm.botSoldersCount < data.bot_solders; vm.botSoldersCount++) {
              vm.solderCreating('bot',vm.botSoldersCount);
            };
          }
        }

        vm.goHome = function(){
          $http.get('/api/index.php?r=arena_prepare&command=by').then(function(response) {
            if (response.data.result == "go_uot") {
              $location.path('/');
            };
          });
        }

        vm.surrend = function(){
          vm.surrender = true;
        }

        vm.chageZoomBatleField = function(plus){
          if (vm.battleGroundZoom < 1 && plus) {vm.battleGroundZoom = FingerFunctions.toFixed(vm.battleGroundZoom + 0.1,1)};
          if (vm.battleGroundZoom > 0.3 && !plus) {vm.battleGroundZoom = FingerFunctions.toFixed(vm.battleGroundZoom - 0.1,1)};
        }


        vm.reNewGame();


    }

})();