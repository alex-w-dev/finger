(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);
/*
    HomeController.$inject = ['UserService', '$rootScope', '$http', '$cookieStore', '$location'];
    function HomeController(UserService, $rootScope, $http, $cookieStore, $location) {*/
    HomeController.$inject = ['$rootScope','$http',  'FlashService', 'FingerFunctions', 'Solder', '$location'];
    function HomeController($rootScope, $http, FlashService, FingerFunctions, Solder, $location) {
        var vm = this;
        vm.lastBattleTable = null;
        vm.spmTable = null;

        $rootScope.Math = window.Math;

        vm.alert = function(mesage){
            FlashService.Success(mesage);
        };

        vm.goBattle = function(){
          vm.atTheBattle = true;
          vm.renewSolders();
          $location.path('/battle');
        };

        $http.get('/api/index.php?r=last_battle_list').then(function(response) {
          vm.lastBattleTable = response.data;
        });

        $http.get('/api/index.php?r=spm_table').then(function(response) {
          vm.spmTable = response.data;
        });


        vm.reNewGame = function(){
          vm.atTheBattle = false;
          vm.battleGroundWidth = 800;
          vm.botDificult = 6; /* 180 символов в минуту ! */
          vm.battleGroundZoom = 1;
          vm.battleGroundPostamentPosition = 100;

          //vm.user = Player.newPlayer((UserService.GetUser()), vm);
          //vm.user.type = 'user';
          vm.user = {};
          vm.bot = {};

          /* to correct camera*/
          vm.chellengeCount = 0;
          vm.chellengePositions = new Array();

          //vm.kickStack = 0;
          vm.userSoldersCount = 0;
          vm.botSoldersCount = 0;
          vm.renewSolders();


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
        }

        vm.battleConnecting = function(){
          $http.get('/api/index.php?r=get_random_skin').then(function(response) {
            vm.user.skin = response.data;

            $http.get('/api/index.php?r=get_random_skin').then(function(response) {
              vm.bot.skin = response.data;

              vm.goFilm();
            });
          });
        };

        vm.goFilm = function(){
          if (vm.atTheBattle) return false;

          if(vm.solder_winner){
            vm.reNewGame();
          }else{
            if(FingerFunctions.randomNumber(0,1))vm.solderCreating('user');
            if(FingerFunctions.randomNumber(0,1))vm.solderCreating('bot');
            setTimeout(function(){vm.goFilm()},2000);
          }
        };


        vm.solderCreating = function(type){
          var numberSkin = FingerFunctions.randomNumber(0,(vm[type].skin.solders.length-1));

          var t = Solder.newSolder({
            'type':type,
            'skin':vm[type].skin.solders[numberSkin],
            'folder':vm[type].skin.folder,
            'speed': FingerFunctions.randomNumber(50,100),
            'hits':FingerFunctions.randomNumber(2,4),
            'game':vm
          });
          t.burn();
          vm.solders.push(t);
        }

        vm.reNewGame();

    }

})();