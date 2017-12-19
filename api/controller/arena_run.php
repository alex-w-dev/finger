<?
  if(isset($_GET['ii'])){
    $string_ii = "Аксолотль, Аллигатор, Баклан, Барсук, Белка, Бобёр, Броненосец, Буйвол, Бурундук, Верблюд, Вволк, Вомбат, Ворона, Выдра, Гепард, Гиена, Гиппопотам, Гризли, Дельфин, Динго, Енот, Ёж, Жираф, Землеройка, Зубр, Игуана, Ифрит, Квагга, Коала, Козерог, Койот, Кракен, Кролик, Лама, Ламантин, Лемур, Леопард, Летучая мышь, Лисица, Лягушка, Муравьед, Морж, Нарвал, Норка, Носорог, Няшка, Обезьяна, Овца, Орангутан, Панда, Пингвин, Питон, Росомаха, Слон, Скунс, Суслик, Толстый лори, Тыква, Утка, Утконос, Хамелеон, Хорёк, Чупакабра, Черепаха, Шакал, Шиншилла";
    $array_ii = explode(',', $string_ii);


    $result_skin = $db->selectOne('skin',array('json'), "`id`='2' ORDER BY RAND()");
    $db->update('battle', array( 'start'=>(time()+10),'username_2'=>$array_ii[mt_rand(0, (count($array_ii)-1))], 'session_id_2'=>'bot_'.$session_id, 'skin_2'=>$result_skin['json']), "`session_id_1` = '".$session_id."' AND `session_id_2` = ''");
  }
  $result = $db->selectOne('battle', array(), "`session_id_1`='".$session_id."' OR `session_id_2`='".$session_id."'");
  if($result['session_id_1'] == $session_id){
    $u_n = 1;
    $b_n = 2;
  }else{
    $u_n = 2;
    $b_n = 1;
  }
  //$result = $db->selectOne('battle', array(), "`session_id_".$u_n."` = '".$session_id."'");
  //if(!$result)redirect('/');
  //$b_n = ($u_n==1)?2:1;

  $string = $result['text'];
  $key = "7215";
  $arry_srting = preg_split('//u',$string,-1,PREG_SPLIT_NO_EMPTY);;
  $arry_key = preg_split('//u',$key,-1,PREG_SPLIT_NO_EMPTY);;
  rsort($arry_key);

  $code_string = '';
  foreach($arry_srting as $k=>$v){
    $length = $arry_key[1];
    if($k %  $arry_key[2]-1 == 0)$length = $arry_key[0];
    //print_r($length);
    for($i = 0; $i < $length; $i++){
      if($i == $arry_key[3])$code_string.=$v;
      elseif(mt_rand(1,150)==1)$code_string.=$result['antihack_symbol']; /*antihack symbol*/
      else $code_string.=$arry_srting[mt_rand(0,(count($arry_srting)-1))];
    };
  }
  $data['text'] = base64_encode($code_string);
  $data['key'] = $key;
  //print_r($code_string);


  $data['user_chars'] = array();
  if($result['log_'.$u_n])$data['user_chars'] =  explode(SQL_LOG_TOKEN,$result['log_'.$u_n]);
  $data['bot_chars'] = array();
  if($result['log_'.$b_n])$data['bot_chars'] =  explode(SQL_LOG_TOKEN,$result['log_'.$b_n]);

  $data['user_text_index'] = 0;
  if($result['text_index_'.$u_n])$data['user_text_index'] =  $result['text_index_'.$u_n];
  $data['bot_text_index'] = 0;
  if($result['text_index_'.$b_n])$data['bot_text_index'] = $result['text_index_'.$b_n];

  if($result['session_id_'.$b_n] == 'bot_'.$session_id)$data['ii'] = true;
  else $data['ii'] = false;

  $data['time_wait'] = $result['start'] - time();



  $data['user'] = $_SESSION['user'];
  $data['bot'] = array('username' => $result['username_'.$b_n], 'avatar' => $result['avatar_'.$b_n]);


  $data['user']['skin'] = json_decode($result['skin_'.$u_n]);
  $data['bot']['skin'] = json_decode($result['skin_'.$b_n]);



  echo json_encode($data);

  //render('arena', $data);