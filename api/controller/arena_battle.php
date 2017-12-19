<?
  function calculate_statistic($battle, $t_u_n, $time_now, $text_array){
    $return = array();
    $return['name'] = $battle['username_'.$t_u_n];
    $return['points'] = 0;
    $t_textPosition  = 0;
    $t_bonus = 0;
    $t_char_log = explode(SQL_LOG_TOKEN,$battle['log_'.$t_u_n]);
    if(!$t_char_log[0])$t_char_log = array();
    //var_dump($t_char_log);
    foreach ($t_char_log as $char) {
      if($text_array[$t_textPosition] == $char){
        $t_textPosition++;
        if($t_bonus > 25)$t_bonus = 25;
        $return['points'] += (1 + $t_bonus);
        $t_bonus++;
      }else{
        $t_bonus = 0;
      }
    }
    $t = ($time_now - $battle['start']);
    $c = count($t_char_log);
    if($c && $t){
      $return['spm_clear'] = round(($battle['text_index_'.$t_u_n]/$t)*60);
      $return['spm_durty'] = round(($c/$t)*60);
      $return['procent'] =  round($battle['text_index_'.$t_u_n] * 100 / $c);
    }else{
      $return['spm_clear'] = 0;
      $return['spm_durty'] = 0;
      $return['procent'] =  0;
    }

    return $return;
  }

  function renew_battle($session_id, $chars, $user = true){
    global $db;

    $battle = $db->selectOne('battle', array(), "`session_id_1`='".$session_id."' OR `session_id_2`='".$session_id."'");
    if(!$battle)return false;/* tebya net v bitve!*/
    if($battle['session_id_1'] == $session_id){
      $u_n = 1;
      $b_n = 2;
    }else{
      $u_n = 2;
      $b_n = 1;
    }
    //$battle = $db->selectOne('battle',array(), array('session_id_'.$u_n => $session_id));

    $solders = $battle['solders_'.$u_n];
    /*when my enemy won ((( */
    if(
        $battle['session_id_'.$b_n]=='winner' ||
        ($user && isset($_POST['surrender'])) ||
        ($user && isset($_POST['solder_winner']) && $_POST['solder_winner'] == 'bot') ||
        ($user && $solders && in_array($battle['antihack_symbol'], $chars)) ||
        ($user && count($chars) > 100)
      ){
      $data['battle_end'] = 'looser';
      $db->update('battle', array('session_id_'.$u_n=>'looser'), array('session_id_'.$u_n => $session_id));
    }

    /*when my enemy looser )))) */
    if(
        $battle['session_id_'.$b_n]=='looser' ||
        ($user && isset($_POST['solder_winner']) && $_POST['solder_winner'] == 'user' && (($battle['solders_'.$u_n] - $battle['solders_'.$b_n]) >= 3))
      ){
      $data['battle_end'] = 'winner';
      $db->update('battle', array('session_id_'.$u_n=>'winner'), array('session_id_'.$u_n => $session_id));
    }

    /* i sad - victory!  need to validate!!!!!*/
/*    if($user && isset($_POST['solder_winner']) && $_POST['solder_winner'] == 'user'){
      if(($battle['solders_'.$u_n] - $battle['solders_'.$b_n]) >= 3){
        $data['battle_end'] = 'winner';
        $db->update('battle', array('session_id_'.$u_n=>'winner'), array('session_id_'.$u_n => $session_id));
      }
    }*/

    /* self write */
    if(!empty($chars) && !isset($data['battle_end'])){
      $text_index = $battle['text_index_'.$u_n];
      $text_array = preg_split('//u',$battle['text'],-1,PREG_SPLIT_NO_EMPTY);
      $end_of_text = false;

      for($i = 0; $i < count($chars); $i++){
        /* antihahck */
        if(strlen($chars[$i])>10)$chars[$i] = substr($chars[$i],0,2);
        /* char validation */
        if($text_array[$text_index] == $chars[$i]){
          $text_index++;
          if($chars[$i]==" "){
            $solders++;
          }
          if(!isset($text_array[$text_index])){
            $end_of_text = true;
            break;
          }
        }
      }

      /* chars into Base*/
      $new_chars_string = implode(SQL_LOG_TOKEN,$chars);

      $to_sqlArr = array(
        'log_'.$u_n => (($battle['log_'.$u_n])?$battle['log_'.$u_n].SQL_LOG_TOKEN.$new_chars_string:$new_chars_string),
        'text_index_'.$u_n => $text_index,
        'solders_'.$u_n => $solders,
        );

      /* may be win */
      if($end_of_text){
        $to_sqlArr['session_id_'.$u_n] = 'winner';
        $data['battle_end'] = 'winner';
      }

      $db->update('battle', $to_sqlArr, array('session_id_'.$u_n => $session_id));
    }



    if (isset($data['battle_end']) && $user) {
      $text_array = preg_split('//u',$battle['text'],-1,PREG_SPLIT_NO_EMPTY);
      $time_now = time();

      $data['user'] = calculate_statistic($battle, $u_n, $time_now, $text_array); /*$t_u_n*/
      $data['bot'] = calculate_statistic($battle, $b_n, $time_now, $text_array); /*$t_b_n*/

      if ($_SESSION['user']['username'] == 'Александр Чертков') {
        $data['user']['message_ko'] = $data['battle_end'];
      }

      if($data['battle_end'] == 'winner'){
        $data['user']['points'] = $data['user']['points'];
        $data['user']['gold'] = round($data['user']['points'] / 10);
        $data['bot']['points'] = round($data['bot']['points'] / 2);

        $data['user']['message_ko'] = $data['user']['points'].'d'.$data['user']['gold'].'d'.$_SESSION['user']['gold'];

        $_SESSION['user']['exp']++;
        $_SESSION['user']['gold'] = (int)$_SESSION['user']['gold'] + (int)$data['user']['gold'];

        if ($_SESSION['user']['password']!='it_s_demo') {
          $db->update(
            'user',
            array('gold'=>$_SESSION['user']['gold'],'exp'=>$_SESSION['user']['exp']),
            array('login'=>$_SESSION['user']['login'],'password'=>$_SESSION['user']['password'])
          );

          $db->insert('symbol_per_minute',
            array(
              'username'=>$_SESSION['user']['username'],
              'avatar'=>$_SESSION['user']['avatar'],
              'spm'=>$data['user']['spm_clear']
            )
          );
        }

      }else{
        $data['user']['points'] = round($data['user']['points'] / 2);
        $data['user']['gold'] = 0;
        $data['bot']['points'] = $data['bot']['points'];
      }
    }


    /* to_json answer */
    //$data['bot_chars'] = explode(SQL_LOG_TOKEN,$battle['log_'.$b_n]);
    $data['bot_text_index'] = $battle['text_index_'.$b_n];
    $data['bot_solders'] = $battle['solders_'.$b_n];
    $data['user_solders'] = $solders;

    if ($user) {
      echo json_encode($data);
    }

  }


  renew_battle($session_id,(!empty($_POST['chars'])?$_POST['chars']:array()));

  //$last_row = (isset($_SESSION['last_row']))?$_SESSION['last_row']:0;
  if(!empty($_POST['bot_chars'])){
    $session_id = 'bot_'.$session_id;

    renew_battle($session_id,$_POST['bot_chars'], false);
  }


  /*$string = 's    sss     ';
  $key = "1234";
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
    else $code_string.=$arry_srting[mt_rand(0,(count($arry_srting)-1))];;
    };
  }
  print_r($code_string);



var srting = "аС квктаеСв т ттвкк каС ";
var key = "1234";
var string_arr = srting.split('');
var key_arr = key.split('');
key_arr = key_arr.sort();
key_arr = key_arr.reverse();
//alert(key_arr);
//alert(string_arr);
var normal_text = new Array();
var temp_word = new Array();
var k = 0
//var wordLength = key_arr[1];
var wordIndex = key_arr[1]-1;
//alert(wordIndex);
for(var i = 0; i < string_arr.length; i++){
  if(i == wordIndex){
    temp_word.push(string_arr[i]);
    normal_text.push(temp_word[key_arr[3]]);

    //alert( wordIndex);
    if(k %  key_arr[2] == 0)wordIndex += parseInt(key_arr[0]);
    else wordIndex += parseInt(key_arr[1]);
    k++;
    temp_word = new Array();
  }else{
    temp_word.push(string_arr[i]);
  }
}

alert(normal_text);


  */
