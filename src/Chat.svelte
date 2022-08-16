<script>
  import Login from "./Login.svelte";
  import Message from "./Message.svelte";
  import { onMount } from "svelte";
  import { username, user, gun } from "./user";

  let newMessage;
  let Messages = [];

  onMount(() =>
    //get Messages
    gun
      .get("chat")
      .map()
      .once(async (data, id) => {
        if (data) {
          let message = {
            who: gun.user(data).get("alias"),
            what: await data.what,
          };

          if (message.what) {
            messages = [...messages.slice(-100), message].sort(
              (a, b) => a.when - b.when //This, idk what this does
            );
          }
        }
      })
  );

  async function sendMessage() {
    const message = user.get("all").set({ what: newMessage });
    gun.get("chat").get(index).put(message); //Hm.
    newMessage = "";
  }
</script>

<form id="messages-container">
  {#if $username}
    <div id="chatbox">
      {#each Messages as message}
        <Message {message} sender={$username} />
      {/each}
      <ul />
    </div>
    <div id="coms">
      <center>
        <input
          type="text"
          placeholder="Type a message..."
          bind:value={newMessage}
          id="say"
        />
        <button
          on:submit|preventDefault={sendMessage}
          id="speak"
          type="submit"
          disabled={!newMessage}>✦</button
        >
      </center>
    </div>
  {:else}
    <main>
      <Login />
    </main>
  {/if}
</form>

<style>
  #messages-container {
    position: relative;
  }
  #coms {
    position: relative;
  }
  #say {
    position: relative;
    top: 2vh;
    align-content: center;
    scale: 1.5;
  }
  #speak {
    position: relative;
    top: 2vh;
    margin-left: 6vw;
    scale: 1.5;
  }
  /*how to make sth fix to sth else*/
  #chatbox {
    display: flex;
    border: 1vh solid black;
    border-style: inset;
    align-content: flex-start;
    margin: auto;
    width: 90vw;
    width: clamp(10vw, 70vw, 100vw);
    height: 70vh;
    height: clamp(20vh, 70vh, 80vh);
    overflow: scroll;
    background-color: #65b8bf;
  }
</style>
