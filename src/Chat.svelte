<script>
  /*document.getElementById("messages").hidden = true;

  //form submission
  document.querySelector("#messages").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!user.is) {
      return;
    }
    gun.get("messages").set(document.querySelector("#say").value); //List? append?
    document.querySelector("#say").value = "";
  });
  //display on the UI
  function UI(say, id) {
    var li = document.querySelector("#" + id);
    if (li == undefined) {
      var li = document.createElement("li");
      li.setAttribute("id", id);
      document.querySelector("ul").appendChild(li);
    }
    var username = user.get("alias");
    li.textContent = `${username}: ${say}`; //String interpolation
  }*/
</script>

<form id="messages">
  <div id="chatbox">
    <ul />
  </div>
  <div id="coms">
    <center>
      <input id="say" />
      <input id="speak" type="submit" value="send" />
    </center>
  </div>
</form>

<style>
  #messages {
    position: relative;
  }
  #coms {
    position: relative;
  }
  #say {
    position: relative;
    top: 2vh;
    align-content: center;
    scale: 1.5;
  }
  #speak {
    position: relative;
    top: 2vh;
    margin-left: 6vw;
    scale: 1.5;
  }
  /*how to make sth fix to sth else*/
  #chatbox {
    display: flex;
    border: 1vh solid black;
    border-style: inset;
    align-content: flex-start;
    margin: auto;
    width: 90vw;
    width: clamp(10vw, 70vw, 100vw);
    height: 70vh;
    height: clamp(20vh, 70vh, 80vh);
    overflow: scroll;
    background-color: #65b8bf;
  }
</style>
