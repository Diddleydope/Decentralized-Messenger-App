<script>
  /*document.querySelector("#up").addEventListener("click", (e) => {
    user.create(
      document.querySelector("#alias").value,
      document.querySelector("#pass").value
    );
  });

  document.querySelector("#sign").addEventListener("click", (e) => {
    e.preventDefault();
    user.auth(
      document.querySelector("#alias").value,
      document.querySelector("#pass").value
    );
  });*/
</script>

<form id="sign">
  <center>
    <input type="text" id="alias" placeholder="username" />
    <p />
    <input type="password" id="pass" placeholder="password" />
    <p />
    <input type="submit" id="in" value="sign in" />
    <input type="button" id="up" value="sign up" />
  </center>
</form>

<style>
  #alias {
    position: relative;
    top: 15vh;
    scale: 1.5;
  }
  #pass {
    position: relative;
    top: 15vh;
    scale: 1.5;
  }
  #in {
    position: relative;
    top: 20vh;
    scale: 1.5;
    margin-right: 2vw;
  }
  #up {
    position: relative;
    top: 20vh;
    scale: 1.5;
    margin-left: 2vw;
  }
</style>
