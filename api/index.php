<?php
/*  if(strripos("finger.lost-portal.com", $_SERVER['HTTP_REFERER'])===false && isset($_GET['r'])){
    echo "Убирайся проч, маленький проныра!";
    exit();
  }*/
  ini_set('error_reporting', E_ALL);
  ini_set('display_errors', 1);
  ini_set('display_startup_errors', 1);

  /*WELCOME TO EASY CODE! */
  function renderPartial($path, $data = array()){
    extract($data);
    include SITE_ROOT . '/view/'.$path.'.tpl';
  }
  function render($path, $data = array()){
    include SITE_ROOT . '/controller/header.php';
    renderPartial($path, $data);
    include SITE_ROOT . '/controller/footer.php';
  }
  function redirect($path){
    header("HTTP/1.1 301 Moved Permanently");
    header("Location: ".$path);
    exit();
  }
  function vok($name, $array, $return = false){
   if(isset($array[$name])&&$array[$name]!=null)return $array[$name];
   else return $return;
  }

  define('SITE_ROOT', dirname(__FILE__));
  define('SQL_LOG_TOKEN', ";:");

  session_start();
  /* suffix number in BD */
  /* user */
  //$u_n = (isset($_SESSION['battle_number']))?$_SESSION['battle_number']:1;
  /* bot */
  //$b_n = ($u_n==1)?2:1;

  $session_id = (isset($_SESSION['user']['login']))?$_SESSION['user']['login']:session_id();
  //$last_row = (isset($_SESSION['last_row']))?$_SESSION['last_row']:0;
  include SITE_ROOT . '/system/DB.php';
  $db = new DB('localhost', 'root', '', 'u0110729_finger');
  $db->setCharset('UTF8');

  /*run controller*/
  include SITE_ROOT . '/controller/'.((isset($_GET['r']))?$_GET['r']:'home').'.php';