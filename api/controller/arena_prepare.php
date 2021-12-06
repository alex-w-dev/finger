<?
  $command = (isset($_GET['command']))?$_GET['command']:0;
  if($command == 'here'){
    /*get free slot to battle*/
    $result = $db->selectOne('battle', array('id','session_id_1'), "`session_id_1`!='' AND `session_id_2`=''");
    if($result){
      if($result['session_id_1'] == $session_id){
        /*if my game created (this is my game)*/
        echo json_encode(array('result'=>'wait'));
      }else{
        /*add me to battle*/
        $result_skin = $db->selectOne('skin',array('json'), array('id'=>$_SESSION['user']['active_skin']));
        $db->update('battle', array('session_id_2'=>$session_id, 'skin_2'=>$result_skin['json'], 'username_2'=>$_SESSION['user']['username'], 'avatar_2'=>$_SESSION['user']['avatar'],  'start'=>(time()+10)), array('id'=>$result['id']));
        //$_SESSION['battle_number'] = 2;
        echo json_encode(array('result'=>'to_battle'));
      }
    }else{
      /*Am i in battle, maybe?*/
      $result = $db->selectOne('battle', array('id'), "`session_id_1`='".$session_id."' OR `session_id_2`='".$session_id."'");
      if ($result) {
        /*yep*/
        echo json_encode(array('result'=>'to_battle'));
      }else{
        /*create slot and waiting*/
        $result_text = $db->selectOne('text',array('text'), "1 ORDER BY RAND()");
        $result_skin = $db->selectOne('skin',array('json'), array('id'=>$_SESSION['user']['active_skin']));
        //print_r($result_skin);
        //echo "string";
        //print_r($_SESSION['user']['active_skin']);
        $antihack_symbol = '×';
        foreach (array('а','x','с','a','х','c','•') as $value) {
          if(strripos($result_text['text'], $value) === false){
            $antihack_symbol = $value;
            break;
          }
        }

        $db->insert('battle', array(
          'session_id_1'=>$session_id,
          'skin_1'=>$result_skin['json'],
          'username_1'=>$_SESSION['user']['username'],
          'avatar_1'=>$_SESSION['user']['avatar'],
          'log_1'=>'',
          'session_id_2'=>'',
          'skin_2'=>'',
          'username_2'=>'',
          'avatar_2'=>'',
          'log_2'=>'',
          'start'=>null,
          'text'=>$result_text['text'],
          'antihack_symbol'=>$antihack_symbol,
        ));
        //$_SESSION['battle_number'] = 1;
        echo json_encode(array('result'=>'wait'));
      }
    }
  };
  if($command == 'waiting'){
    /*scan my game slot*/
    $result = $db->selectOne('battle', array('session_id_2'), array('session_id_1'=>$session_id));
    if($result && $result['session_id_2']){
      /*cath the enemy? go fight*/
      echo json_encode(array('result'=>'to_battle'));
    }else{
      /*more waiting ...*/
      echo json_encode(array('result'=>'wait'));
    }
  };
  if($command == 'by'){
    /*scan my game slot*/
    $result = $db->selectOne('battle', array('session_id_2'), array('session_id_1'=>$session_id));
    if($result && $result['session_id_2']){
      /* sorry - you  have enemy */
      echo json_encode(array('result'=>'to_battle'));
    }else{
      /*delete game ...*/
      $db->delete('battle', array('session_id_1'=>$session_id));
      echo json_encode(array('result'=>'go_uot'));
    }
  };
