<?php

  $result = $db->query("SELECT * FROM `battle` WHERE (session_id_1 = 'looser' OR session_id_1 = 'winner') AND (session_id_2 = 'looser' OR session_id_2 = 'winner') ORDER BY id DESC LIMIT 10", true);
  echo json_encode($result);