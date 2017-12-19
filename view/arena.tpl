<?
$string = "аввыаууцау";
echo strlen($string);
echo 1;?>
<div id="time_wait"><?=$time_wait?></div>моепа
<div id="user_text" class="global_text"><span class="inputed_text">text</span><span class="task_text">text</span></div>
<div id="bot_text" class="global_text"><span class="inputed_text">text</span><span class="task_text">text</span></div>
<div id="battle_field"></div>
<div id="footer_guarantor">&nbsp;</div>
<script>
function randomNumber (m,n){
  m = parseInt(m);
  n = parseInt(n);
  return Math.floor( Math.random() * (n - m + 1) ) + m;
}

function сomparison (a1,a2){
  var a=[], diff=[];
  for(var i=0;i<a1.length;i++)
    a[a1[i]]=true;
  for(var i=0;i<a2.length;i++)
    if(a[a2[i]]) delete a[a2[i]];
    else a[a2[i]]=true;
  for(var k in a)
    diff.push(k);
  return diff
}

function eazyComparison (a1,a2){
  var a=[], diff=[];
  for(var i=a2.length;i<a1.length;i++){
    diff.push(a1[i]);
  }
  return diff
}
</script>
<script>
  var time_wait = <?=$time_wait?>;
  var ii = <?=($ii)?'true':'false'?>;
  var row = 0;
  var run_game = false;
  var global_text = '<?=$text?>';
  var game = null;

  function Solder(data){
    var self = this;
    this.game = data.game;
    this.speed = data.speed;
    this.hits = data.hits;
    this.type = data.type;
    this.position = 0;
    this.vector = 1;
    this.scaningEmemy;
    this.mooving;

    this.burn = function(){
      if(this.type =='bot'){
        this.vector=-1;
        this.position=800;
      }
      this.sprite = $('<div />',{'class':this.type+'_solder solder'});
      this.sprite.appendTo('#battle_field');

      /*moove*/
      self.mooving = setInterval(self.move, 45);

      /* enemy scan*/
      self.scaningEmemy = setInterval(self.findEnemy, 100);
    }

    this.move = function(){
      /*mooving*/
      self.position += self.speed / 100 * self.vector;
      self.sprite.css('left',self.position+'px');
    }

    this.findEnemy = function(){
      for (var i = 0; i < self.game.solders.length; i++) {
        if(
          self.type != self.game.solders[i].type &&
          Math.abs(self.game.solders[i].position - self.position) < 20
        ){
          self.game.solders[i].die(i);
          self.die(self.game.solders.indexOf(self));
        }
      };
/*      $(self.game.solders).each(function(index, value){
        console.log(value);
      });*/
      //console.log(self.game.solders.length);
    }


    this.kickEnemy = function(){

    }


    this.die = function(i){
      self.sprite.remove();
      self.game.killSolder(i);
      clearInterval(self.mooving);
      clearInterval(self.scaningEmemy);
      self = null;
      delete self;
    }

  }

  function User (data) {
    this.name = data.name;
    this.textIndex = 0;
    this.type = data.type;
    this.game = data.game;
    this.chars = new Array();
    this.army = new Array();
    this.lastWord = 0;
    this.charEnter = function(char){
      this.chars.push(char);
      if (this.game.text[this.textIndex]==char) {
        this.textIndex++;
        this.renewText();
      }else{
        this.renewText(true);
      }
    }

    this.renewText = function(error){
      var inputed_text = '';
      for (var i = 0; i < this.textIndex; i++) {
        inputed_text += this.game.text[i];
      };
      var task_text = '';
      for (var i = this.textIndex; i < this.game.text.length; i++) {
        task_text += this.game.text[i];
      };
      $('#'+this.type+'_text').find('.inputed_text').text(inputed_text).stop().animate({"margin-left":'-'+(inputed_text.length * 17.0313 - 100)+'px'}).next('.task_text').html((error)?'<span class="error_text">'+task_text.charAt(0)+'</span>' + task_text.substr(1):task_text);
    }

  }

  function Game(){
    var self = this;
    this.user;
    this.bot;
    this.userSoldersCount = 0;
    this.botSoldersCount = 0;
    this.solders = new Array();
    this.botStack = new Array();
    this.botInputedTextArray = new Array();
    this.botClickSpeed = 100;
    this.text = global_text.split('');

    this.run = function(){
      this.user = new User({'type':'user','name':'Imya', 'game':self});
      this.bot = new User({'type':'bot','name':'Bot_name', 'game':self});
      this.user.renewText();
      this.bot.renewText();
      $(document).keypress(function(e){
        self.user.charEnter(String.fromCharCode((e.keyCode)?e.keyCode:e.which));
      });
      $(document).keydown(function(e){
        self.stopBackSpase(e);
      });
      /*bot action!*/
      this.botAction();
      /* server callback */
      this.serverSyncronize();
    }

    this.killSolder = function(i){
      this.solders.splice(i,1);
    }

    this.botAction = function(){
      if(this.botStack.length){
        this.bot.charEnter(this.botStack.splice(0,1));
      }
      setTimeout(function(){self.botAction()}, this.botClickSpeed);
    }

    this.addSolder = function(data){
      /*add to user*/
      if(data.user_solders > this.userSoldersCount){
        for (this.userSoldersCount; this.userSoldersCount < data.user_solders; this.userSoldersCount++) {
          var t = new Solder({'type':'user', 'speed': randomNumber(50,100), 'hits':1, 'game':this});
          t.burn();
          this.solders.push(t);
        };
      }
      /*add to bot*/
      if(data.bot_solders > this.botSoldersCount){
        for (this.botSoldersCount; this.botSoldersCount < data.bot_solders; this.botSoldersCount++) {
          var t = new Solder({'type':'bot', 'speed': randomNumber(50,100), 'hits':1, 'game':this});
          t.burn();
          this.solders.push(t);
        };
      }
    }

    this.serverSyncronize = function(){
      var chars = this.user.chars;
      this.user.chars = new Array;
      $.post('?r=arena_battle', {'chars':chars} , function(data) {
        /*bot_action begin*/
        if(data.bot_chars.length && data.bot_chars[0]){
          $(eazyComparison(data.bot_chars, self.botInputedTextArray)).each(function(){
            self.botStack.push(this[0]);
            self.botInputedTextArray.push(this[0]);
          })
        }
        /*add new solders*/
        self.addSolder(data);
        //console.log(data);
      }, 'json')
      setTimeout(function(){self.serverSyncronize()}, 1800);
    }

    this.stopBackSpase = function(e){
      if (!e) e = window.event;
      if (e.keyCode) code = e.keyCode;
      else if (e.which) code = e.which;
      if(code==8) {
        if(e.stopPropagation) e.stopPropagation();
        else e.cancelBubble = true;
        if(e.preventDefault) e.preventDefault();
        else e.returnValue = false;
      }
    }

  }

  function battleStart(){
    if (game != null) return false;
    game = new Game();
    game.run();
  }/* */



  function waitingStart(){
    if(time_wait > 0){
      $('#time_wait').text(time_wait);
      time_wait--;
      setTimeout(waitingStart, 1000);
    }else{
      battleStart();
    }
  }

  waitingStart()


</script>