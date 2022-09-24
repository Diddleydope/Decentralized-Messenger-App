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

  /*
  TODO: FIX SPACING BETWEEN MESSAGES
        AUTOSCROLL
        ENCRYPTION
        RELAY SERVERS
        MAKE ADD CHATROOM AND CHAT SELECT INTO SIDEBAR
  */

  /*
  Fragen für Herr Geissmann: Wie kann in in Javascript einem HTML Element eine Klasse zuordnen?
                            Wie kann ich den Lifetime eines HTML Elements, welches in einer JS
                            Funktion erstellt wurde kontrollieren?
                            Quellen?
                            Etwas zu sagen?
  */
  let newMessage;
  let messages = new Array();
  let ids = new Array();
  let listeners = new Array();
  let chatroom = "General Chat"; //Set default chatroom to general
  let modal;
  let temp;
  //  let lastMessage;

  function changeChatroom(input) {
    chatroom = input;
    //console.log(chatroom);
    resetMessages();
  }

  function openNewChat() {
    /*TODO: Implement this function*/
    modal.showModal();
  }

  function closeNewChat() {
    modal.close();
  }

  function createNewChat() {
    let btn = document.createElement("button");
    btn.innerHTML = temp;
    btn.classList.add("chatSelect");
    btn.onclick = changeChatroom(btn.innerHTML);
    document.getElementById("chatroomContainer").appendChild(btn);
    chatroom = temp;
    closeNewChat();
  }

  function resetMessages() {
    listeners.forEach((l) => {
      l.off();
    });
    listeners = new Array();
    messages = new Array();
    ids = new Array();
    buildMessage();
  }

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
    let minute = new Date().getMinutes();
    if (minute < 10) {
      minute = "0" + minute;
    }
    const hour = new Date().getHours();
    const index = hour + ":" + minute;
    // Stelle einfach die Nachricht in den gesamten Chat. Dann können alle
    // aus dem Chatroom die Nachrichten abhören.
    // TODO: Verschlüsselung pro Chatroom einführen. Jeder Room hat einen
    // eigenen Schlüssel, damit kann man sicher stellen das nur Personen die
    // den Schlüssel kennen den Chatroom auch lesen können.
    const temp = {
      sender: $username,
      what: await SEA.encrypt(newMessage, "#dummeyKey"),
      timestamp: index,
    };
    gun.get("chat").get(chatroom).set(temp);
    /*if(temp.sender==lastMessage){
      messages.classList.add("sameSender");
    }
    lastMessage = temp.sender;*/
    newMessage = "";
  }
</script>

<div class="container">
  {#if $username}
    <div id="chatroomContainer">
      <button on:click={() => changeChatroom("General Chat")} class="chatSelect"
        >General Chat</button
      >
      <button
        on:click={() => changeChatroom("VideoGame Chat")}
        class="chatSelect">VideoGame Chat</button
      >
      <button on:click={() => changeChatroom("Random Chat")} class="chatSelect"
        >Random Chat</button
      >

      <button on:click={openNewChat} id="addChatroom">Add Chatroom</button>

      <dialog id="newChatWindow" bind:this={modal}>
        <input
          bind:value={temp}
          type="text"
          placeholder="Enter chatroom name..."
        />
        <button id="closeWindow" on:click={closeNewChat}>Close</button>
        <button id="createChat" on:click={createNewChat}>Create</button>
      </dialog>
    </div>
    <div class="chatbox">
      {#each messages as message}
        {#if message.who == $username}
          <div id="messageSent">
            <div class="chatBubble">
              <ChatMessage {message} sender={$username} />
            </div>
          </div>
        {:else}
          <div id="messageReceived">
            <div class="chatBubble">
              <ChatMessage {message} sender={$username} />
            </div>
          </div>
        {/if}
      {/each}
    </div>
    <form on:submit|preventDefault={sendMessage}>
      <input
        type="text"
        placeholder="Type a message..."
        bind:value={newMessage}
        maxlength="100"
        class="typeBox"
      />

      <button type="submit" disabled={!newMessage} class="sendButton">✉</button>
    </form>
  {:else}
    <main>
      <Login />
    </main>
  {/if}
</div>

<style>
  #chatroomContainer {
    position: absolute;
    margin: 0;
    width: 20vw;
    height: 80vh;
    left: 0;
    top: 10vh;
    overflow: scroll;
  }
  .chatSelect {
    position: relative;
    margin: 0;
    top: 0;
    left: 0.5vw;
    margin: 0;
    height: 10vh;
    width: 19.5vw;
    font-size: 25px;
    color: darkgrey;
    background-color: #333333;
    border: none;
    border-radius: 3px;
    outline: none;
    box-shadow: inset 0 0 0 0 #333333;
    transition: ease-out 0.2s;
    display: block;
  }
  .chatSelect:hover {
    box-shadow: inset 20vw 0 0 0 #1d1d1d;
  }
  /*
  .chatSelect:focus {
    background-color: #eae7dc;
  }*/

  .chatbox {
    position: fixed;
    top: 14vh;
    left: 20vw;
    width: clamp(10vw, 70vw, 100vw);
    height: clamp(20vh, 70vh, 80vh);
    overflow: scroll;
    background-color: transparent;
    height: 76vh;
    width: 73.5vw;
  }
  .typeBox {
    position: fixed;
    bottom: 1vh;
    left: 20.5vw;
    width: 73vw;
  }
  .sendButton {
    position: fixed;
    bottom: 1vh;
    left: 93.75vw;
    width: 6vw;
  }
  #addChatroom {
    position: fixed;
    bottom: 1vh;
    height: 6.5vh;
    left: 0.5vw;
    width: 19.5vw;
    color: darkgrey;
    background-color: #333333;
    border: none;
    outline: none;
    box-shadow: inset 0 0 0 0 #333333;
    transition: ease-out 0.2s;
  }
  #addChatroom:hover {
    box-shadow: inset 10vw 0 0 10vw #1d1d1d;
  }
  #messageReceived {
    position: relative;
    color: darkgrey;
    text-align: left;
    margin-left: 1vw;
    background-color: #292929;
    border-radius: 8px;
    width: fit-content;
    padding-left: 1vw;
    padding-right: 1vw;
  }
  #messageSent {
    position: relative;
    color: darkgrey;
    text-align: center;
    width: fit-content;
    margin-right: 1vw;
    text-align: right;
    margin-left: auto;
    border-radius: 8px;
    background-color: #292929;
    padding-right: 1vw;
    padding-left: 1vw;
  }
  /*.sameSender{
    
  }*/
</style>
