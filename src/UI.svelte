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
    left: 9vw;
    font-family: "Bungee Shade", cursive;
    color: whitesmoke;
  }
  #welcome {
    position: fixed;
    font-family: "Bungee Shade", cursive;
    scale: 7;
    top: 28vh;
    left: 45vw;
    color: whitesmoke;
  }
  #to {
    position: fixed;
    font-family: "Bungee Shade", cursive;
    scale: 4;
    left: 77vw;
    top: 33vh;
    color: whitesmoke;
  }
  #decentralized {
    position: fixed;
    font-family: "Codystar", cursive, bold;
    letter-spacing: 0.04vw;
    scale: 7;
    left: 55vw;
    top: 53vh;
    color: #b0b3b8;
    transition: ease 0.3s;
  }
  #decentralized:hover {
    letter-spacing: 0.08vw;
  }
  #messaging {
    position: fixed;
    font-family: "Bungee Shade", cursive;
    scale: 6;
    top: 70vh;
    left: 65vw;
    color: whitesmoke;
  }

  @media all and (max-width: 900px) {
    #login-indicator {
      scale: 1.5;
      position: fixed;
      top: 33vh;
      left: 44vw;
      font-family: "Bungee Shade", cursive;
      color: whitesmoke;
    }
    #welcome {
      position: fixed;
      font-family: "Bungee Shade", cursive;
      scale: 4;
      top: 10vh;
      left: 38.5vw;
      color: whitesmoke;
    }
    #to {
      position: fixed;
      font-family: "Bungee Shade", cursive;
      scale: 5;
      left: 46vw;
      top: 22vh;
      color: whitesmoke;
    }
    #decentralized {
      position: fixed;
      font-family: "Codystar", cursive, bold;
      scale: 2.8;
      left: 34vw;
      top: 60vh;
      color: #b0b3b8;
      transition: ease 0.3s;
    }
    #messaging {
      position: fixed;
      font-family: "Bungee Shade", cursive;
      scale: 3;
      top: 70vh;
      left: 35.5vw;
      color: whitesmoke;
    }
  }
</style>
