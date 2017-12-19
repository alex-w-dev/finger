<?php

  $result = $db->query("SELECT `username`,`avatar`,max(`spm`) AS spm  FROM  `symbol_per_minute`  GROUP BY  `username` ORDER BY `spm` DESC LIMIT 100", true);
  echo json_encode($result);