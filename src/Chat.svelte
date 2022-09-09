<script>
  import Login from "./Login.svelte";
  import ChatMessage from "./Message.svelte";
  import { onMount } from "svelte";
  import { username, gun } from "./user";
  import { get } from "svelte/store";
  // Importiere gun von user.js. Wir müssen hier keine neue Instanz von Gun
  // erzeugen, weil wir diese bereits in user erstellt haben. Wir möchten hier
  // unbedingt die gleiche Instanz verwenden, ansonsten müssen wir die
  // Konfiguration nochmals angeben.

  let newMessage;
  let messages = new Array(); //Declaring Map
  let ids = new Array();
  let listeners = new Array()
  let chatroom = "chat-general"; //Set default chatroom to general

  function toggleGeneral() {
    chatroom = "chat-general";
    resetMessages();
  }

  function toggleGames() {
    chatroom = "chat-games";
    resetMessages();
  }

  function togglePolitics() {
    chatroom = "chat-politics";
    resetMessages();
  }

  function resetMessages() {
    listeners.forEach((l) => {l.off()})
    listeners = new Array()
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
        listeners.push(_ev)
        console.log("garbage")
        if (data) {
          // Key for end-to-end encryption
          const key = "#dummeyKey";

          var message = {
            // Zur Zeit muss hier der sender von data verwendet werden. Das
            // sollte auch nicht kritisch sein, da ein Benutzer keine
            // Möglichkeit hat die Daten in der Datenbank zu ändern.
            who: data.sender,
            what: (await SEA.decrypt(data.what, key)) + "", // force decrypt as text.
            when: data.timestamp,
          };

          if (ids.indexOf(id) != -1) { return }
          else { ids.push(id) }

          if (message.what) {
            messages = [...messages, message].sort(
              (a, b) => a.when - b.when
            );
            /* messages = temp; //Changing Array through seperate Variable since it */
            //doesn't seem to work directly. Removed .slice since it
            //was causing problems. TODO: This may be causing problems somehow.
            //Messages aren't showing up when sent
            //          old version |
          }
        }
      }, true);
  }
  onMount(() => {
    buildMessage();
  });

  async function sendMessage() {
    const minute = new Date().getMinutes();
    const hour = new Date().getHours();
    const index = hour + ":" + minute;
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
        <!--Reference Array behind index and loop over it-->
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
