<script>
  import Chat from "./Chat.svelte";
  import UI from "./UI.svelte";

  function checkUserAuth(req, res, next) {
    if (req.session.user) return next();
    return next(new NotAuthorizedError());
  }

  app.get("/app/:id", checkUserAuth, findApp, renderView, sendJSON);
</script>

<main>
  <UI />
  <Chat />
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
