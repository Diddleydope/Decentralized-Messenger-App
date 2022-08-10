<script>
  import Login from "./Login.svelte";
  import Chat from "./Chat.svelte";
  import GUN from "gun";
  import "gun/sea";
  import "gun/axe";

  var gun = Gun();
  var user = gun.user();
  gun.on("auth", function () {
    document.getElementById("sign").hidden = true;
    document.getElementById("messages").hidden = false;
    gun.get("messages").map().once(UI);
  });
</script>

<main>
  <center><h1 id="h1">Dappr</h1></center>
  <Login />
  <!--<Chat />-->
</main>

<style>
  #h1 {
    scale: 2;
  }
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }
  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
