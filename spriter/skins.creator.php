<?
  $folder =  '../skins/'.$_GET['folder'].'/';

  $json = file_get_contents($folder.'json.json');
  //echo $json;
?>


<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="/spriter/style.css">
</head>
<body>
<div id="sprite_ground"></div>
<!-- <div class="rule_line"></div> -->
<div ng-app="app" ng-controller="myCtrl">

<input id="save_json" type="button" ng-click="save_json()" value="Save">

<form action="" class="all_json">
  <div>Sprite name: <input type="text" ng-model="json.name"></div>
  <div>Sprite folder: <input type="text" ng-model="json.folder"></div>
  <div><button ng-click="add_solder()">Добавить солдата</button></div>
  <div ng-repeat="(solder_key, solder) in json.solders">
    <div><button ng-click="json.solders.splice(solder_key,1)">Удалить это солдата</button></div>
    <div>Имя солдата: <input type="text" ng-model="solder.name"></div>
    <div>Изображение: <input type="text" ng-model="solder.img"> <a href="/skins/{{json.folder}}/{{solder.img}}" target="_blank"><img src="/skins/{{json.folder}}/{{solder.img}}" alt=""></a></div>
    <div ng-repeat="(part_key, part) in ['stay','move','kick','death']">
      <div>
        <div>
          {{part}}:<button ng-click="add_solder_part(solder, part)">Добавить {{part}}</button>
        </div>
        <div ng-repeat="(par_key ,par) in solder[part]">

          <div><button ng-click="solder[part].splice(par_key,1)">Удалить это {{part}}</button></div>

          <div>sample: <input type="text" ng-model="par.sample"></div>
          <div>samplePosition: <input type="number" ng-model="par.samplePosition"></div>
          <div ng-if="part=='kick'">damagePosition: <input type="number" ng-model="par.damagePosition"></div>
          <div ng-if="part=='move'">stepWidth: <input type="number" ng-model="par.stepWidth"></div>
          <div>
            Анимация:
            <button ng-click="par.animation.reverse()">
              Перевернуть
            </button>
            <button ng-click="do_animation($event, '/skins/'+json.folder+'/'+solder.img, par, part)">
              Анимировать
            </button>
            <div class="sprite_ground"></div>
          </div>

          <div ng-repeat="(p_key, p) in par.animation">
            <div>
              <button ng-click="par.animation.splice(p_key,1)">удалить эту позицию</button>
            </div>
            <div>
              x: <input type="number" ng-model="p[0]">
              y: <input type="number" ng-model="p[1]">
              width: <input type="number" ng-model="p[2]">
              height: <input type="number" ng-model="p[3]">
              left: <input type="number" ng-model="p[4]">
              bottom: <input type="number" ng-model="p[5]">
              <div class="animation_position_single" ><div style="
                background: url('/skins/{{json.folder}}/{{solder.img}}') {{p[0]}}px {{p[1]}}px no-repeat;
                width: {{p[2]}}px;
                height: {{p[3]}}px;
                margin-left: {{p[4]}}px;
                margin-bottom: {{p[5]}}px;
              "></div></div>
            </div>
          </div>
          <div><button ng-click="add_position(par.animation)">добавить позицию</button></div>
        </div>

      </div>
    </div>


  </div>
  <hr>
</form>
<br>

</div>


<script src="/library/jquery-2.0.3.min.js"></script>
<script src="/library/angular.js"></script>
<script src="/library/angular-route.js"></script>
<script src="/library/angular-cookies.js"></script>
<script src="/library/angular-utf8-base64.js"></script>

<script src="/spriter/app_skin.js" ></script>
<script src="/app-services/authentication.service.js?<?=$rand?>"></script>
<script src="/app-services/flash.service.js?<?=$rand?>"></script>
<script src="/app-services/functions.service.js?<?=$rand?>"></script>
<script src="/app-services/http.service.js?<?=$rand?>"></script>
<script src="/app-services/player.service.js?<?=$rand?>"></script>
<script src="/app-services/sprite_solder.service.js?<?=$rand?>"></script>


<script>
(function () {
  'use strict';

  var json = '<?=$json?>';
  var FOLDER = '<?=$folder?>';

  var app = angular.module('app');
  app.controller('myCtrl', function($scope, $http, Solder) {
    var self = this;
    $scope.json = JSON.parse(json);

    $scope.save_json = function(){
      //console.log(angular.toJson($scope.json));
      $http.post('/spriter/skins.saver.php', {'json':angular.toJson($scope.json),"folder":FOLDER}).then(function(response) {
        window.location.reload();
      })
    }

    $scope.add_solder = function(){
      //console.log(angular.toJson($scope.json));
      //console.log(typeof($scope.json.solders));
      if(typeof($scope.json.solders) != 'object'){
        $scope.json.solders = new Array();
      }

      $scope.json.solders.push({"name":"name"});
      console.log($scope.json.solders);
    }

    $scope.remove_solder = function(solder){
      console.log(true);
      solder = null;
    }

    $scope.add_solder_part = function(solder,name){
      if(typeof(solder[name]) != 'object'){
        solder[name] = new Array();
      }
      var animation = new Array();
      animation.push([0,0,0,0,0,0]);
      solder[name].push({
        "sample":"sample",
        "samplePosition":0,
        "animation":animation,
      });
    }

    $scope.do_animation = function(evt, img, animation, part){
      //angular.element(evt.target).addClass('active');
      console.log(Solder);
      var anim_solder = Solder.newSolder({'img':img, 'div':angular.element(evt.target), 'animation':animation, part});
      anim_solder.burn();
    }

    $scope.add_position = function(animation){
      /*if(typeof(animation) != 'object'){
        animation = new Array();
      }*/
      if (typeof(animation[animation.length-1])!='undefined') {
        var t = animation[animation.length-1];
        //console.log(t);
        animation.push([t[0],t[1],t[2],t[3],t[4],t[5]]);
      }else{
        animation.push([0,0,0,0,0,0]);
      }

    }
  });

})();
</script>

</body>
</html>

<!-- <!DOCTYPE html>
<html lang="en">
    <head>
        <title>JSON maker</title>
        <style type="text/css">
            #editor {
                width: 600px;
                height: 500px;
            }
        </style>
    </head>
    <body>
        <h1><?=$folder?></h1>

        <div id="editor"><?=$json?></div>
        <table id="visual_test"></table>
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
        <script src="http://d1n0x3qji82z53.cloudfront.net/src-min-noconflict/ace.js" type="text/javascript" charset="utf-8"></script>
        <script>
            var editor = ace.edit("editor");
            editor.getSession().setMode("ace/mode/json");
            editor.getSession().setTabSize(2);
        </script>
        <script>
          $('#save_json').click(function(){
            $('#hidden_json').val(editor.getValue());
            $('#form_json').submit();
          });
          $('#test_json').click(function(){
            var json = JSON.parse(editor.getValue());
            for (var i = 0; i < json.length; i++) {
              var solder_json = json[i];
              /* KICKING */
              if(typeof(solder_json['kick']) != 'undefined'){
                for (var i = 0; i < solder_json['kick'].length; i++) {
                  if (typeof(solder_json['kick'][i]) != 'undefined') {
                    var kick = solder_json['kick'][i];
                  };
                };
              }
            };

          });
        </script>
    </body>
</html> -->