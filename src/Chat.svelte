<script>
  import Login from "./Login.svelte";
  import ChatMessage from "./Message.svelte";
  import { onMount } from "svelte";
  import { username, user, gun } from "./user";

  import { prevent_default } from "svelte/internal";

  let newMessage;
  let messages = [];

  onMount(() => {
    // Get Messages
    gun.get("chat")
      .map()
      .once(async (data, id) => {
        if (data) {
          // Key for end-to-end encryption
          const key = "#dummeyKey";

          var message = {
            // transform the data
            /* who: await gun.user(data).get("alias"), // a user might lie who they are! So let the user system detect whose data it is. */
            who: data.sender,
            what: data.what, // force decrypt as text.
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
      const index = new Date().toISOString();
      gun.get("chat").set({
          sender: $username,
          what: newMessage,
          timestamp: index
      })
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

      <button type="submit" disabled={!newMessage}>✉</button>
    </form>
  {:else}
    <main>
      <Login />
    </main>
  {/if}
</div>
