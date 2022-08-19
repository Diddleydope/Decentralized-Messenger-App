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
    user.create(username, password, console.log("user already exists!"));
  }
</script>

<center>
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
  #alias {
    position: relative;
    top: 15vh;
    scale: 1.5;
    background-color: #e0e0e0;
  }
  #pass {
    position: relative;
    top: 15vh;
    scale: 1.5;
    background-color: #e0e0e0;
  }
  #in {
    position: relative;
    top: 20vh;
    scale: 1.5;
    margin-right: 2vw;
    background-color: #eee6e6;
  }
  #up {
    position: relative;
    top: 20vh;
    scale: 1.5;
    margin-left: 2vw;
    background-color: #eee6e6;
  }
</style>
