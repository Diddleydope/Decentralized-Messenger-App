<script>
  import { username } from "./user";
</script>

<div>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Rubik+Maze&display=swap"
    rel="stylesheet"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Silkscreen:wght@700&display=swap"
    rel="stylesheet"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Codystar&display=swap"
    rel="stylesheet"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
    rel="stylesheet"
  />
  <h1 id="h1"><i>ᴅᴀᴘᴘʀ</i></h1>

  {#if !$username}
    <div id="login-indicator">Login⏎</div>
    <div id="welcome">Welcome</div>
    <div id="to">To</div>
    <div id="decentralized">Decentralized</div>
    <!--<div id="decentralized2"></div>-->
    <div id="messaging">Messaging</div>
  {/if}
</div>

<style>
  #h1 {
    position: fixed;
    scale: 1.5;
    color: #c7b7b7;
    left: 3vw;
    top: -3vh;
  }
  :global(body) {
    background-color: #f5f0f0;
  }
  #login-indicator {
    scale: 1.5;
    position: fixed;
    top: 30vh;
    left: 9vw;
  }
  #welcome {
    position: fixed;
    font-family: "Rubik Maze", cursive;
    scale: 10;
    top: 20vh;
    left: 45vw;
  }
  #to {
    position: fixed;
    font-family: "Silkscreen", cursive;
    scale: 5;
    left: 65vw;
    top: 36vh;
  }
  #decentralized {
    position: fixed;
    font-family: "Codystar", cursive, bold;
    scale: 7;
    left: 55vw;
    top: 53vh;
  }
  /*#decentralized2 {
    position: fixed;
    font-family: "Codystar", cursive, bold;
    scale: 7;
    left: 77vw;
    top: 45vh;
  }*/
  #messaging {
    position: fixed;
    font-family: "Bebas Neue", cursive;
    scale: 6;
    top: 73vh;
    left: 80vw;
  }
</style>
