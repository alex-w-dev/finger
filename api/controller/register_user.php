<?
  $data = array();
  $data['success'] = true;

  $result = $db->selectOne('user',array(),array('login'=>$_POST['login']));
  if ($result) {
    $data['success'] = false;
    $data['message'] = 'Такой пользователь уже зарегистрирован!';
  }else{
    $db->insert('user',array('username'=>$_POST['login'],'login'=>$_POST['login'], 'password'=>md5($_POST['password']), 'email'=>$_POST['email'], 'skins'=>'1'));
    $_SESSION["user"] = $db->selectOne('user',array(),array('login'=>$_POST['login']));
  }
  echo json_encode($data);