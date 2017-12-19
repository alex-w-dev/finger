<?php
/*
  EXAMPLE:

	include	'classes/DB.php';

 	$db = new DB("localhost", "root", "", "testing_class");
  $db->insert("pages",array('title'=>"fadasd<>adsf$; DELETE FROM `pages`;fa'sf'",'text'=>'jhga,sdasdherg','parent_id'=>4));
  $row = $db->query("SELECT * FROM pages WHERE id='1';",true); // true - returns assoc!: false - not returns
  $row = $db->select("pages",array(), array('parent_id'=>3));
  $db->update("pages",array('title'=>"qqqqqqqqqqq"), array('id'=>2, 'more'=>"OR id='3'"));
  $db->delete("pages", array('id'=>1));
*/

	class DB{
		private $link;
		private $dbname;
		public function __construct($dbhost, $dbuser, $password, $dbname){
      $this->dbname = $dbname;
			$this->link = mysqli_connect($dbhost, $dbuser, $password, $dbname) or die("Не могу соединиться");
		}

		/* //  other methods: */
    private function toMysqlArray($array){
      for($i = 0; $i < count($array); $i++){
        $array[$i] = mysqli_real_escape_string($this->link, $array[$i]);
      };
      return $array;
    }
    private function isMore($array){
      if(isset($array['more'])&&$array['more']!=null)return " ".$array['more'];
      else return '';
    }
    private function assocToFetch($array){
      $retArray = array();
      $retArray['k']= array_keys($array);
      $retArray['v']= $this->toMysqlArray(array_values($array));
      return $retArray;
    }
    private function whereString($where){
      if(is_string($where))return $where;
      $where_ = $this->assocToFetch($where);
      $where_string = '';
      $temp_where_ = array();
      for ($i=0; $i < count($where_['k']); $i++) {
        if($where_['k'][$i]!='more')$temp_where_[] = $where_['k'][$i]."='".$where_['v'][$i]."'";
      }
      $where_string = implode(' AND ', $temp_where_);
      return $where_string.$this->isMore($where);
    }

    /* // public methods */
		public function setCharset($set){
			mysqli_query($this->link, "SET NAMES '".$set."'");
			mysqli_query($this->link, "SET CHARACTER SET '".$set."'");
		}

		public function query($query, $return = false){
      //echo $query;
			$result = mysqli_query($this->link, $query)or die("Ваш запрос: ".$query." Ответ сервера: ".mysqli_error($this->link));
			if($return){
        $retArr = array();
        while ($row = mysqli_fetch_assoc($result)){
          $retArr[] = $row;
        };
        return $retArr;
      }
      return $result;
		}

		public function checkTable($tableName){
			$table_status = $this->query('CHECK TABLE '.$tableName, true);/* // проверяем наличие таблицы */
      if (($table_status[0]['Msg_type'] == 'Error') && ($table_status[0]['Msg_text'] == "Table '".$this->dbname.".".$tableName."' doesn't exist")){
        return false;
      }else{
        return true;
      }
		}

		public function countRows($table, $where = "1"){
      $query = "SELECT COUNT(*) FROM ".$table." WHERE ".$this->whereString($where).";";
      $result = $this->query($query, true);
      return $result[0]["COUNT(*)"];
		}



    public function insert($table, $array){
      $array_ = $this->assocToFetch($array);

      $query = "INSERT INTO ".$table." (`".implode("`, `", $array_['k'])."`) VALUES ('".implode("', '", $array_['v'])."');";
      $this->query($query);
    }

    public function update($table, $array, $where = "1"){
      $array_ = $this->assocToFetch($array);

      $updateArr = array();
      for($i = 0; $i < count($array); $i++){
        if($array_['k'][$i])$updateArr[$i] = "`".$array_['k'][$i]."` = '".$array_['v'][$i]."'";
      };
      $query = "UPDATE ".$table." SET ".implode(", ", $updateArr)." WHERE ".$this->whereString($where).";";
      $this->query($query);
    }

    public function select($table, $array = array(), $where = "1"){
      $array_ = $this->assocToFetch($array);

      $select = "*";
      if(!empty($array))$select = implode(", ", $array_['v']);


      $query = "SELECT ".$select." FROM ".$table." WHERE ".$this->whereString($where).";";
      return $this->query($query, true);
    }

    public function selectOne($table, $array = array(), $where = "1"){
      if(is_array($where)){
        if(isset($where['more']))$where['more'].=" LIMIT 1";
        else $where['more'] = " LIMIT 1";
      }else if(is_string($where) || is_int()){
        $where.=" LIMIT 1";
      }
      $return = $this->select($table, $array, $where);
      return (empty($return))?$return:$return[0];
    }

    public function delete($table, $where){
      $query = "DELETE FROM ".$table." WHERE ".$this->whereString($where).";";
      $this->query($query);
    }


	}