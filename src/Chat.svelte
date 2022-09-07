<script>
  import Login from "./Login.svelte";
  import ChatMessage from "./Message.svelte";
  import { onMount } from "svelte";
  import { username, gun } from "./user";
  // Importiere gun von user.js. Wir müssen hier keine neue Instanz von Gun
  // erzeugen, weil wir diese bereits in user erstellt haben. Wir möchten hier
  // unbedingt die gleiche Instanz verwenden, ansonsten müssen wir die
  // Konfiguration nochmals angeben.

  let newMessage;
  let messages = [];
  let chatroom = "chat-general"; //Set default chatroom to general
  let state1 = gun.get(chatroom);
  let state2;

  function toggleGeneral() {
    state1 = gun.get(chatroom);
    chatroom = "chat-general";
    //console.log(chatroom);
    resetMessages();
  }

  function toggleGames() {
    state1 = gun.get(chatroom);
    chatroom = "chat-games";
    //console.log(chatroom);
    resetMessages();
  }

  function togglePolitics() {
    state1 = gun.get(chatroom);
    chatroom = "chat-politics";
    //console.log(chatroom);
    resetMessages();
  }

  function resetMessages() {
    state2 = gun.get(chatroom);
    if (state1 == state2) {
      return;
    } else {
      buildMessage();
    }
    messages = [];
    console.log(messages);
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
      .once(async (data, id) => {
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

          if (message.what) {
            messages = [...messages.slice(-100), message].sort(
              (a, b) => a.when - b.when
            );
          }
        }
      });
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

<div class="container">
  {#if $username}
    <div id="mySidenav" class="sidenav" style="width: {navWidth}%">
      <button class="closebtn" on:click={closeNav}>close</button>
      <button on:click={toggleGeneral} class="chatSelect">General Chat</button>
      <button on:click={toggleGames} class="chatSelect">VideoGame Chat</button>
      <button on:click={togglePolitics} class="chatSelect">Politics Chat</button
      >
    </div>

    <button on:click={openNav} class="openButton">open</button>
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

<style>
  .openButton {
    position: absolute;
    right: 10vw;
  }
  /* The side navigation menu */
  .sidenav {
    height: 100%; /* 100% Full-height */
    width: 0; /* 0 width - change this with JavaScript */
    position: fixed; /* Stay in place */
    z-index: 1; /* Stay on top */
    top: 0;
    left: 0;
    background-color: #f5f0f0; /* Black*/
    overflow-x: hidden; /* Disable horizontal scroll */
    padding-top: 60px; /* Place content 60px from the top */
    transition: 0.5s; /* 0.5 second transition effect to slide in the sidenav */
  }

  /* The navigation menu links */
  .chatSelect {
    padding: 8px 8px 8px 32px;
    margin-top: 10vh;
    margin-bottom: 10vh;
    text-decoration: none;
    font-size: 25px;
    display: block;
    transition: 0.3s;
    color: #c7b7b7;
    background-color: #f5f0f0;
  }

  /* When you mouse over the navigation links, change their color */
  .sidenav .chatSelect:hover {
    color: #f1f1f1;
  }

  /* Position and style the close button (top right corner) */
  .sidenav .closebtn {
    position: absolute;
    top: 0;
    right: 25px;
    font-size: 36px;
    margin-left: 50px;
    color: #c7b7b7;
    background-color: #f5f0f0;
  }

  /* On smaller screens, where height is less than 450px, change the style of the sidenav (less padding and a smaller font size) */
  @media screen and (max-height: 450px) {
    .sidenav {
      padding-top: 15px;
    }
    .sidenav .chatSelect {
      font-size: 18px;
    }
  }
</style>
