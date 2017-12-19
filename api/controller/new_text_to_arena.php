<?
  if ($_POST && isset($_POST['text'])) {

    $error = preg_match('~[^а-я\.\ё\,\;\:\-\s\d\"\'\?\!]~uism', $_POST['text'], $matches);

    if (!$error) {
      $text = $_POST['text'];

      $text = str_replace(array("\r", "\n", "\t", "  "), '', $text);
      $text = str_replace("—", '-', $text);

      $db->insert('text', array('text'=>$text));
    }else{
      echo $error ? "Неверный символ: ".$matches[0] : "Ok";
    }

    //
  }
?>

<form action="" method="POST">
  <textarea name="text" id="" cols="100" rows="30"></textarea>
  <input type="submit" value="Jnghfdbnm">
</form>