var gun = Gun();
var user = gun.user();
//smth else??

document.getElementById("said").hidden=true;

document.querySelector('#up').addEventListener('click', (e) => {
  user.create(document.querySelector('#alias').value,
               document.querySelector('#pass').value);
});

document.querySelector('#sign').addEventListener('click', (e) => {
  e.preventDefault();
  user.auth(document.querySelector('#alias').value,
               document.querySelector('#pass').value);
});

//form submission
document.querySelector('#said').addEventListener('submit', (e) => {
  e.preventDefault();
  if(!user.is){return}
  user.get('said').set(document.querySelector('#say').value); //List? append?
  document.querySelector('#say').value = ("");
});

//display on the UI
function UI(say, id){
  var li = document.querySelector('#' + id);
  if(li == undefined) {
    var li = document.createElement('li');
    li.setAttribute('id', id);
    document.querySelector('ul').appendChild(li);
    }
  var username = user.get('alias');
  (li).textContent = `${username}: ${say}`; //String interpolation
};

gun.on('auth', function(){
  document.getElementById("sign").hidden=true;  
  document.getElementById("said").hidden=false;
  user.get('said').map().once(UI);
});
