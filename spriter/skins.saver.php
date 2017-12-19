<?
  if (isset($_POST['json'])) {
    file_put_contents($_POST['folder'].'json.json', $_POST['json']);
  }