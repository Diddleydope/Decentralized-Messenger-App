<script>
  import Login from "./Login.svelte";
  import ChatMessage from "./Message.svelte";
  import { onMount } from "svelte";
  import { username, gun } from "./user";
  // Importiere gun von user.js. Wir müssen hier keine neue Instanz von Gun
  // erzeugen, weil wir diese bereits in user erstellt haben. Wir möchten hier
  // unbedingt die gleiche Instanz verwenden, ansonsten müssen wir die
  // Konfiguration nochmals angeben.
  //gun.get("chat").get(chatroom).off();

  let newMessage;
  let messages = new Array(); //Declaring Map
  let ids = new Array();
  let listeners = new Array();
  let chatroom = "chat-general"; //Set default chatroom to general

  function toggleGeneral() {
    chatroom = "chat-general";
    //console.log(chatroom);
    resetMessages();
  }

  function toggleGames() {
    chatroom = "chat-games";
    //console.log(chatroom);
    resetMessages();
  }

  function togglePolitics() {
    chatroom = "chat-politics";
    //console.log(chatroom);
    resetMessages();
  }

  function resetMessages() {
    listeners.forEach((l) => {
      l.off();
    });
    listeners = new Array();
    messages = new Array(); //Empty Array behind the Key, just like i cleared
    ids = new Array();
    buildMessage();
    //the array before.
  }

  let navWidth = 0;

  const openNav = () => {
    navWidth = 30;
  };

  const closeNav = () => {
    navWidth = 0;
  };

  function buildMessage() {
    gun
      .get("chat")
      .get(chatroom)
      .map()
      .on(async (data, id, _msg, _ev) => {
        listeners.push(_ev);
        console.log("garbage");
        listeners.push(_ev);
        console.log("garbage");

        if (data) {
          // Key for end-to-end encryption
          const key = "#dummeyKey";

          var message = {
            // transform the data
            /* who: await gun.user(data).get("alias"), // a user might lie who they are! So let the user system detect whose data it is. */
            // Zur Zeit muss hier der sender von data verwendet werden. Das
            // sollte auch nicht kritisch sein, da ein Benutzer keine
            // Möglichkeit hat die Daten in der Datenbank zu ändern.
            who: data.sender,
            what: (await SEA.decrypt(data.what, key)) + "", // force decrypt as text.
            when: data.timestamp,
          };

          if (ids.indexOf(id) != -1) {
            return;
          } else {
            ids.push(id);
          }

          if (message.what) {
            messages = [...messages, message].sort((a, b) => a.when - b.when);
          }
        }
      }, true);
  }
  onMount(() => {
    // Get Messages
    // Damit erhalten wir alle Einträge die in der Datenbank unter "chat"
    // stehen. `map()` iteriert über all die Einträge. Mit der Funktion
    // `once()` können wir dann auf jedem Dateneintrag die callback funktion
    // genau einmal aufrufen. Das machen wir weil jeder Eintrag nur einmal im
    // Chat auftauchen soll.
    buildMessage();
  });

  async function sendMessage() {
    const minute = new Date().getMinutes();
    const hour = new Date().getHours();
    const index = hour + ":" + minute;
    // Stelle einfach die Nachricht in den gesamten Chat. Dann können alle
    // aus dem Chatroom die Nachrichten abhören.
    // TODO: Erstelle einzelne Chatrooms. Die könnte man einfach mit
    // "chat-<name>" benennen, dann kann man einfach die Rooms unterscheiden.
    // TODO: Verschlüsselung pro Chatroom einführen. Jeder Room hat einen
    // eigenen Schlüssel, damit kann man sicher stellen das nur Personen die
    // den Schlüssel kennen den Chatroom auch lesen können.
    const temp = {
      sender: $username,
      what: await SEA.encrypt(newMessage, "#dummeyKey"),
      timestamp: index,
    };
    gun.get("chat").get(chatroom).set(temp);
    newMessage = "";
  }
</script>

{#if $username}
  <button on:click={toggleGeneral} class="chatSelect">General Chat</button>
  <button on:click={toggleGames} class="chatSelect">VideoGame Chat</button>
  <button on:click={togglePolitics} class="chatSelect">Politics Chat</button>

  <div class="chatbox">
    {#each messages as message}
      {#if message.who === username}
        <div class="messageSent">
          <ChatMessage {message} sender={$username} />
        </div>
      {:else}
        <div class="messageReceived">
          <ChatMessage {message} sender={$username} />
        </div>
      {/if}
    {/each}
  </div>

  <form on:submit|preventDefault={sendMessage} class="typeBox">
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

<style>
  .chatSelect {
    margin: 0;
    height: 10vh;
    width: 20vw;
    font-size: 25px;
    display: block;
    color: #c7b7b7;
    background-color: #f5f0f0;
    border: none;
    outline: none;
  }

  .chatbox {
    position: relative;
    align-content: flex-start;
    margin-top: -34.5vh;
    margin-left: 20vw;
    width: clamp(10vw, 70vw, 100vw);
    height: clamp(20vh, 70vh, 80vh);
    overflow: scroll;
    background-color: #d8c3a5;
  }

  .typeBox {
    position: relative;
    margin-left: 25vw;
    margin-top: 1vh;
  }
</style>
