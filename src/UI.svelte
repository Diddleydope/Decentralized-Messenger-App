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
  <link
    href="https://fonts.googleapis.com/css2?family=Bungee+Shade&display=swap"
    rel="stylesheet"
  />

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
  :global(body) {
    background-color: #242526;
    background-image: url("background.png");
    background-repeat: repeat;
  }
  #login-indicator {
    scale: 1.5;
    position: fixed;
    top: 30vh;
    left: 9.5vw;
    color: #202020;
  }
  #welcome {
    position: fixed;
    font-family: "Bebas Neue", cursive;
    scale: 12;
    top: 28vh;
    left: 45vw;
    color: #202020;
  }
  #to {
    position: fixed;
    font-family: "Bebas Neue", cursive;
    scale: 5;
    left: 72vw;
    top: 34vh;
    color: #202020;
  }
  #decentralized {
    position: fixed;
    font-family: "Codystar", cursive, bold;
    scale: 7;
    left: 55vw;
    top: 53vh;
    color: #202020;
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
    color: #202020;
  }
</style>
