<script>
  import Login from "./Login.svelte";
  import ChatMessage from "./Message.svelte";
  import { onMount } from "svelte";
  import { username, gun, user } from "./user";
  import debounce from "lodash.debounce";
  import SEA from "gun/sea";

  /*
  TODO: MESSAGES NOT ORDERED UPON LOADING IN
        ADD CHATROOMS
        ENCRYPTION
        RELAY SERVERS
        UI
        GET A SERVER RUNNING AND LAUNCH IT AND TEST ON MOBILE
  */
  let newMessage;
  let messages = new Array();
  let ids = new Array();
  let listeners = new Array();
  let chatroom = "General Chat"; //Set default chatroom to general
  let modal;
  let chatroomSelect;
  let temp;
  let scrollBottom;
  let lastScrollTop;
  let canAutoScroll = true;
  let unreadMessages;

  function autoScroll() {
    setTimeout(() => scrollBottom?.scrollIntoView({ behavior: "auto" }), 50);
    unreadMessages = false;
  }

  function watchScroll(e) {
    canAutoScroll = (e.target.scrollTop || Infinity) > lastScrollTop;
    lastScrollTop = e.target.scrollTop;
  }

  $: debouncedWatchScroll = debounce(watchScroll, 1000);

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

  function openChatSelect() {
    chatroomSelect.showModal();
  }

  function closeChatSelect() {
    chatroomSelect.close();
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
    console.log("It was called here");
    gun
      .get("chat")
      .get(chatroom)
      .map()
      .on(async (data, id, _msg, _ev) => {
        listeners.push(_ev);
        //console.log("garbage");
        listeners.push(_ev);
        //console.log("garbage");

        if (data) {
          // Key for end-to-end encryption
          //var msg = await SEA.verify(data, pair.pub);
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
            displayType: 0,
          };

          if (ids.indexOf(id) != -1) {
            return;
          } else {
            ids.push(id);
          }

          if (message.what) {
            messages = [...messages, message].sort((a, b) => a.when - b.when);
            for (let i = 0; i < messages.length; i++) {
              if (messages[i].who == $username) {
                messages[i].displayType = 0;
              } else {
                messages[i].displayType = 1;
              }
            }
            for (let i = 0; i < messages.length - 1; i++) {
              if (messages[i].who != messages[i + 1].who) {
                messages[i].displayType += 2;
              }
            }

            if (canAutoScroll) {
              autoScroll();
            } else {
              unreadMessages = true;
            }
          }
        }
      }, true);
  }
  onMount(() => {
    buildMessage();
  });

  async function sendMessage() {
    let minute = new Date().getMinutes();
    if (minute < 10) {
      minute = "0" + minute;
    }
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
    canAutoScroll = true;
    autoScroll();
  }
</script>

<div class="container">
  {#if $username}
    <button id="openChatSelect" on:click={openChatSelect}
      >change chatroom</button
    >

    <dialog class="chatroomMenu" bind:this={chatroomSelect}>
      <button on:click={closeChatSelect} id="chatroomSelectClose">close</button>
      <div id="chatroomContainer">
        <button
          on:click={() => changeChatroom("General Chat")}
          class="chatSelect">General Chat</button
        >
        <button
          on:click={() => changeChatroom("VideoGame Chat")}
          class="chatSelect">VideoGame Chat</button
        >
        <button
          on:click={() => changeChatroom("Random Chat")}
          class="chatSelect">Random Chat</button
        >
      </div>
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
    </dialog>
    <div id="lineDiv">
      <div id="chatIndicator">{chatroom}</div>
      <div id="chatbox" on:scroll={debouncedWatchScroll}>
        {#each messages as message}
          {#if message.displayType == 0}
            <div id="messageSentClose">
              <ChatMessage {message} sender={$username} />
            </div>
          {:else if message.displayType == 2}
            <div id="messageSentSpace">
              <ChatMessage {message} sender={$username} />
            </div>
          {:else if message.displayType == 1}
            <div id="messageReceivedClose">
              <ChatMessage {message} sender={message.who} />
            </div>
          {:else if message.displayType == 3}
            <div id="messageReceivedSpace">
              <ChatMessage {message} sender={message.who} />
            </div>
          {/if}
        {/each}
        <div class="dummy" bind:this={scrollBottom} />
      </div>
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
  .chatroomMenu {
    width: 90vw;
    height: 90vh;
    background-color: #292929;
  }
  ::-webkit-scrollbar {
    width: 0px;
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

  #chatbox {
    position: fixed;
    top: 12.5vh;
    width: 96vw;
    height: auto;
    overflow-y: scroll;
    background-color: transparent;
    height: 76vh;
    border: 5px solid #1d1d1d;
    border-style: dotted;
  }
  .typeBox {
    position: absolute;
    bottom: 1vh;
    left: 20.5vw;
    width: 73vw;
  }
  .sendButton {
    position: absolute;
    bottom: 1vh;
    left: 93.75vw;
    width: 6vw;
  }
  #openChatSelect {
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

  #messageReceivedClose {
    font-size: large;
    position: relative;
    color: darkgrey;
    text-align: left;
    margin-left: 1vw;
    background-color: #292929;
    border-radius: 8px;
    width: fit-content;
    padding-left: 1vw;
    padding-right: 1vw;
    margin-bottom: 0.25vh;
  }

  #messageReceivedSpace {
    font-size: large;
    position: relative;
    color: darkgrey;
    text-align: left;
    margin-left: 1vw;
    background-color: #292929;
    border-radius: 8px;
    width: fit-content;
    padding-left: 1vw;
    padding-right: 1vw;
    margin-bottom: 1.5vh;
  }

  #messageSentClose {
    font-size: large;
    position: relative;
    color: darkgrey;
    width: fit-content;
    margin-right: 1vw;
    text-align: right;
    margin-left: auto;
    border-radius: 8px;
    background-color: #292929;
    padding-right: 1vw;
    padding-left: 1vw;
    margin-bottom: 0.25vh;
  }
  #messageSentSpace {
    font-size: large;
    position: relative;
    color: darkgrey;
    width: fit-content;
    margin-right: 1vw;
    text-align: right;
    margin-left: auto;
    border-radius: 8px;
    background-color: #292929;
    padding-right: 1vw;
    padding-left: 1vw;
    margin-bottom: 1.5vh;
  }

  #lineDiv {
    position: relative;
    border-bottom: 5px solid #1d1d1d;
    width: 95vw;
  }

  #chatIndicator {
    position: relative;
    scale: 1.5;
    color: #1d1d1d;
    font-weight: bold;
    left: 80vw;
    margin-bottom: 1vh;
    width: fit-content;
  }
  #chatroomSelectClose {
    position: fixed;
    right: 5vw;
    top: 2.5vh;
  }
  #addChatroom {
    position: fixed;
    right: 5vw;
    bottom: 2vh;
    width: 90vw;
  }
  #chatroomContainer {
    position: relative;
    left: 3vw;
    top: 6vh;
    bottom: 1vh;
    height: 75vh;
    width: 85vw;
    overflow: scroll;
    display: grid;
    row-gap: 4vw;
    column-gap: 2vh;
    grid-template-columns: repeat(4, auto);
    align-items: center;
    justify-items: center;
  }
</style>
