<script>
  import Login from "./Login.svelte";
  import Chat from "./Chat.svelte";
  import UI from "./UI.svelte";
  /*
  gun.on("auth", function () {
    document.getElementById("sign").hidden = true;
    document.getElementById("messages").hidden = false;
    gun.get("messages").map().once(UI);
  });*/
</script>

<main>
  <UI />
  <Login />
  <!--<Chat />-->
</main>

<style>
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
