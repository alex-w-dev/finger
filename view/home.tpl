
Соединение с серврером ...
<div id="message"></div>
<button id="wait_more">Ждать еще</button>
<script>
  var count_waiting = 60;
  function arenaConnecting(){
    $.getJSON('/?r=arena_prepare', {'command': 'here'} , function(data) {
      console.log(data);
      if (data.result == "to_battle") {
        location = '/?r=arena';
      };
      if (data.result == "wait") {
        if(count_waiting <= 0)location = '/?r=arena&ii';
        $('#message').html('Ожидание противника (зови скорей друзей!)<br />Игра с ИИ начнется через '+count_waiting);
        count_waiting--;
        setTimeout(arenaConnecting, 1000);
      };
    });
  }
  arenaConnecting();

  $('#wait_more').click(function(){
    count_waiting +=60;
  })
</script>