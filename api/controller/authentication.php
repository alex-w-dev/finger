<?
if(isset($_POST['password'])){
  $data = array();
  $data['success'] = false;
  $data['message'] = 'Неверный логин или пароль';
  if($_POST['password']=='it_s_demo'){
    $_SESSION['user'] = array(
        'username'=>$_POST['username'],
        'login'=>$_POST['username'].mt_rand(),
        'password'=>$_POST['password'],
        'avatar'=>'/image/default_user.png',
        'gold'=>0,
        'level'=>0,
        'exp'=>0,
        'active_skin'=>1
      );
    $data['success'] = true;
  }else{
    $result = $db->selectOne('user',array(),array('login'=>$_POST['username'], 'password'=>md5($_POST['password'])));
    if ($result) {
      $data['message'] = '[vvvvvv]';
      $_SESSION['user'] = $result;
      $data['success'] = true;
    }
  }
  echo json_encode($data);
}else  if(vok("uid", $_GET) || vok("viewer_id", $_GET)){
  /* тут получаем данные с контакта          */
  $uid = "vkk_".((vok("uid", $_GET))?$_GET['uid']:$_GET['viewer_id']);
  $user = $db->selectOne('user',array(),array('login'=>$uid));
  if($user){
    $_SESSION["user"] = $user;
  }else{
    /* данные с контакта преобразоываем в ассоциативный массив            */
    $to_base = array(
      'login'=>$uid,
      'password'=>$uid,
      'username'=>$_GET['first_name'].' '.$_GET['last_name'],
      'avatar'=>$_GET['photo'],
      'skins'=>'1'
    );
    $db->insert('user',$to_base);
    $_SESSION["user"] = $db->selectOne('user',array(),array('login'=>$uid));
  }
    //print_r($_SESSION);
  header("Location: /");
};