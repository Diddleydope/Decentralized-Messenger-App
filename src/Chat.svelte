<script>
  import Login from "./Login.svelte";
  import ChatMessage from "./Message.svelte";
  import { onMount } from "svelte";
  import { username, user, gun } from "./user";

  import GUN from "gun";
  import { prevent_default } from "svelte/internal";
  const db = GUN();

  let newMessage;
  let messages = [];

  onMount(() => {
    // Get Messages
    db.get("testingg")
      .map()
      .on(async (data, id) => {
        if (data) {
          // Key for end-to-end encryption
          const key = "#dummeyKey";

          var message = {
            // transform the data
            who: await db.user(data).get("alias"), // a user might lie who they are! So let the user system detect whose data it is.
            what: data.msg, // force decrypt as text.
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
    db.get("testingg").set({
      sender: $username,
      timestamp: index,
      msg: newMessage,
    });
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
