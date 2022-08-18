<script>
  import Login from "./Login.svelte";
  import ChatMessage from "./Message.svelte";
  import { onMount } from "svelte";
  import { username, user } from "./user";

  import GUN from "gun";
  const gun = GUN();

  let newMessage;
  let messages = [];

  onMount(() => {
    // Get Messages
    gun
      .get("chat")
      .map()
      .once(async (data, id) => {
        if (data) {
          // Key for end-to-end encryption
          const key = "#foo";

          var message = {
            // transform the data
            who: await gun.user(data).get("alias"), //verifying user
            what: (await SEA.decrypt(data.what, key)) + "", // force decrypt as text.
          };

          if (message.what) {
            messages = [...messages.slice(-100), message].sort(
              (a, b) => a.when - b.when
            );
          }
        }
      });
  });

  async function sendMessage() {
    const secret = await SEA.encrypt(newMessage, "#foo");
    const message = user.get("all").set({ what: secret });
    const index = new Date().toISOString();
    gun.get("chat").get(index).put(message);
    newMessage = "";
  }
</script>

<div class="container">
  {#if $username}
    <main>
      {#each messages as message}
        <ChatMessage {message} sender={$username} />
      {/each}
    </main>
    <form on:submit|preventDefault={sendMessage}>
      <input
        type="text"
        placeholder="Type a message..."
        bind:value={newMessage}
        maxlength="100"
      />

      <button type="submit" disabled={!newMessage}>💥</button>
    </form>
  {:else}
    <main>
      <Login />
    </main>
  {/if}
</div>
