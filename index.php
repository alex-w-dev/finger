<?php
$rand = mt_rand();
/*session_start();
print_r($_SESSION); */?>

<!DOCTYPE html>
<html ng-app="app">
<head>
    <meta charset="utf-8" />
    <title>FingerDefence</title>
    <!-- <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" /> -->
    <!-- <link href="/app-content/app.css" rel="stylesheet" /> -->
    <link href="/css/master.css?<?=$rand?>" rel="stylesheet" type="text/css">
</head>
<body>
    <div class="under_container">
        <div class="container">
            <div class="main_frame">
                <div ng-class="{ 'alert': flash, 'alert-success': flash.type === 'success', 'alert-danger': flash.type === 'error' }" ng-if="flash" ></div>

                <div class="popup" ng-show="flash">
                  <div class="popup_wall"  ng-click="flash = null"></div>
                  <div class="popup_flush_window">
                      <div class="popup_flush_window_message" ng-bind="flash.message"></div>
                      <div class="yellow_button popup_flush_window_ok" ng-click="flash = null"></div>
                  </div>
                </div>
                <div ng-view></div>
            </div>
        </div>
    </div>


    <script src="/library/jquery-2.0.3.min.js"></script>
    <script src="/library/angular.js"></script>
    <script src="/library/angular-route.js"></script>
    <script src="/library/angular-cookies.js"></script>
    <script src="/library/angular-utf8-base64.js"></script>

    <script src="/app.js"></script>
    <script src="/app-services/authentication.service.js?<?=$rand?>"></script>
    <script src="/app-services/flash.service.js?<?=$rand?>"></script>
    <script src="/app-services/functions.service.js?<?=$rand?>"></script>
    <script src="/app-services/http.service.js?<?=$rand?>"></script>
    <script src="/app-services/player.service.js?<?=$rand?>"></script>
    <script src="/app-services/solder.service.js?<?=$rand?>"></script>

    <!-- Real user service that uses an api -->
    <<script src="/app-services/user.service.js?<?=$rand?>"></script>

    <!-- Fake user service for demo that uses local storage
    <script src="/app-services/user.service.local-storage.js"></script>-->

    <script src="/battle/battle.controller.js?<?=$rand?>"></script>
    <script src="/home/home.controller.js?<?=$rand?>"></script>
    <script src="/login/login.controller.js?<?=$rand?>"></script>
    <script src="/register/register.controller.js?<?=$rand?>"></script>




    <script type="text/javascript" src="//userapi.com/js/api/openapi.js?34"></script>
    <script>VK.init({apiId: 5187712});</script>
</body>
</html>