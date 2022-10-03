<script>
  import { user } from "./user";

  let username, password;

  function login() {
    user.auth(
      username,
      password,
      console.log("username or password incorrect")
    );
  }
  function signup() {
    user.create(username, password);
  }
</script>

<center id="login">
  <input type="text" id="alias" placeholder="username" bind:value={username} />
  <p />
  <input
    type="password"
    id="pass"
    placeholder="password"
    bind:value={password}
  />
  <p />
  <!--<input type="submit" id="in" value="sign in" />-->
  <!--<input type="button" id="up" value="sign up" />-->
  <button on:click={login} id="in">Login</button>
  <button on:click={signup} id="up">Sign up</button>
</center>

<style>
  #login {
    position: fixed;
    scale: 0.8;
    top: 25vh;
    left: 3vw;
  }
  #alias {
    position: relative;
    top: 15vh;
    scale: 1.5;
    background-color: #eae7dc;
  }
  #pass {
    position: relative;
    top: 15vh;
    scale: 1.5;
    background-color: #eae7dc;
  }
  #in {
    position: relative;
    top: 20vh;
    scale: 1.5;
    margin-right: 2vw;
    background-color: #eae7dc;
  }
  #up {
    position: relative;
    top: 20vh;
    scale: 1.5;
    margin-left: 2vw;
    background-color: #eae7dc;
  }
</style>
