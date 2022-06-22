  
  
    var gun = Gun(['http://localhost:8765/gun', 'https://gun-manhattan.herokuapp.com/gun']);
    var user = gun.user();

    $('#up').on('click', function(e){
      user.create($('#alias').val(), $('#pass').val());
    });

    $('#sign').on('submit', function(e){
      e.preventDefault();
      user.auth($('#alias').val(), $('#pass').val());
    });

    $('#said').on('submit', function(e){
      e.preventDefault();
      if(!user.is){ return }
      user.get('said').set($('#say').val());
      $('#say').val("");
    });

    function UI(say, id){
      var li = $('#' + id).get(0) || $('<li>').attr('id', id).appendTo('ul');
      $(li).text(say);
    };

    gun.on('auth', function(){
      $('#sign').hide();
      user.get('said').map().once(UI);
    });