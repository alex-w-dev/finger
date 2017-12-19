<?php
  $result = $db->selectOne('skin', array('json'), '1 ORDER BY RAND()');
  echo $result['json'];