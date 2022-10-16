<script>
  import Login from "./Login.svelte";
  import ChatMessage from "./Message.svelte";
  import { onMount } from "svelte";
  import { username, gun, user } from "./user";
  import debounce from "lodash.debounce";
  import SEA from "gun/sea";
  /*FRAGEN HERR GEISSMANN:
    image.png-QUELLENANGABE: LOOKS UGLY UND WELCHE LIBRARY/ANGABEN?
    -RELAY SERVERS/ DAS GANZE OHNE LOCAL SERVER LAUFEN LASSEN
    -DOMAIN?
    -ENCRYPTION?
    -FEEDBACK, WAS ZU SAGEN?
  */

  /*
  TODO: MESSAGES NOT ORDERED UPON LOADING IN
        ADD CHATROOMS
        ENCRYPTION
        RELAY SERVERS
        GET A SERVER RUNNING AND LAUNCH IT AND TEST ON MOBILE
  */
  let newMessage;
  let messages = new Array();
  let chatrooms = new Array();
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
    gun.get("chat").get("chatrooms").set(temp);
    closeNewChat();
    temp = "";
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

  function buildChatrooms() {
    console.log("Hey");
    gun
      .get("chat")
      .get("chatrooms")
      .map()
      .on(async (data, id, _msg, _ev) => {
        listeners.push(_ev);
        //console.log("garbage");
        listeners.push(_ev);
        //console.log("garbage");

        if (data) {
          var tempChatroom = data;

          //chatrooms.push(tempChatroom);
          if (!chatrooms.includes(tempChatroom)) {
            chatrooms = [...chatrooms, tempChatroom].sort(
              (a, b) => a.when - b.when
            );
          }

          if (ids.indexOf(id) != -1) {
            return;
          } else {
            ids.push(id);
          }
        }
      }, true);
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
          const key = "#dummeyKey";

          var message = {
            // transform the data
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
              console.log($username);
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
    buildChatrooms();
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
          class="chatSelect"
          id="defaultbutton">General Chat</button
        >
        <button
          on:click={() => changeChatroom("Sports Chat")}
          class="chatSelect">Sports Chat</button
        >
        <button
          on:click={() => changeChatroom("VideoGame Chat")}
          class="chatSelect">VideoGame Chat</button
        >
        {#each chatrooms as tempChatroom}
          <button
            on:click={() => changeChatroom(tempChatroom)}
            class="chatSelect">{tempChatroom}</button
          >
        {/each}
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
    <div id="lineDivBottom">
      <div id="lineDivTop">
        <div id="chatIndicator">{chatroom}</div>
        <h1 id="h1"><i>Dappr</i></h1>
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
  <link
    href="https://fonts.googleapis.com/css2?family=Bungee+Shade&display=swap"
    rel="stylesheet"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Codystar&display=swap"
    rel="stylesheet"
  />
</div>

<style>
  .chatroomMenu {
    width: 90vw;
    height: 90vh;
    background-color: #242526;
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
    height: 15vh;
    width: 19.5vw;
    font-size: 25px;
    color: whitesmoke;
    background-color: #3a3b3c;
    border: none;
    border-radius: 3px;
    outline: none;
    box-shadow: inset 0 0 0 0 #b0b3b8;
    transition: ease-out 0.2s;
    display: block;
  }
  .chatSelect:hover {
    box-shadow: inset 20vw 0 0 0 #b0b3b8;
  }
  /*
  .chatSelect:focus {
    background-color: #eae7dc;
  }*/

  #chatbox {
    position: fixed;
    top: 13.5vh;
    width: 96vw;
    height: auto;
    overflow-y: scroll;
    background-color: transparent;
    height: 76vh;
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
    font-size: medium;
    bottom: 1vh;
    height: 6.5vh;
    left: 0.5vw;
    width: 19.5vw;
    color: whitesmoke;
    background-color: #18191a;
    border: none;
    outline: none;
    transition: ease 0.3s;
  }
  #openChatSelect:hover {
    font-size: large;
  }

  #messageReceivedClose {
    font-size: large;
    position: relative;
    color: whitesmoke;
    text-align: left;
    margin-left: 1vw;
    background-color: #3a3b3c;
    border-radius: 8px;
    width: fit-content;
    margin-bottom: 0.25vh;
  }

  #messageReceivedSpace {
    font-size: large;
    position: relative;
    color: whitesmoke;
    text-align: left;
    margin-left: 1vw;
    background-color: #3a3b3c;
    border-radius: 8px;
    width: fit-content;
    margin-bottom: 2vh;
  }

  #messageSentClose {
    font-size: large;
    position: relative;
    color: whitesmoke;
    width: fit-content;
    margin-right: 1vw;
    text-align: right;
    margin-left: auto;
    border-radius: 8px;
    background-color: #3a3b3c;
    margin-bottom: 0.25vh;
  }
  #messageSentSpace {
    font-size: large;
    position: relative;
    color: whitesmoke;
    width: fit-content;
    margin-right: 1vw;
    text-align: right;
    margin-left: auto;
    border-radius: 8px;
    background-color: #3a3b3c;
    margin-bottom: 2vh;
  }
  #chatIndicator {
    position: relative;
    scale: 1.5;
    color: #e4e6eb;
    font-weight: bold;
    left: 75vw;
    margin-bottom: 1vh;
    width: fit-content;
    font-family: "Bungee Shade", cursive;
    top: 10vh;
    transition: ease 0.3s;
  }
  #chatIndicator:hover {
    scale: 1.7;
  }
  #h1 {
    position: fixed;
    left: 5vw;
    right: 85vw;
    top: -5vh;
    font-family: "Bungee Shade", cursive;
    scale: 1.3;
    color: #e4e6eb;
    transition: ease-out 0.3s;
  }
  #h1:hover {
    letter-spacing: 0.3vw;
  }

  #lineDivBottom {
    position: relative;
    border-bottom: 5px solid #b0b3b8;
    width: 95vw;
    bottom: 2.5vh;
  }
  #lineDivTop {
    position: relative;
    border-bottom: 5px solid #b0b3b8;
    width: 95vw;
    bottom: 9vh;
  }
  #chatroomSelectClose {
    position: fixed;
    right: 5vw;
    top: 2.5vh;
    background-color: #b0b3b8;
    color: black;
  }
  #addChatroom {
    position: fixed;
    right: 5vw;
    bottom: 2vh;
    width: 90vw;
    background-color: #b0b3b8;
    color: black;
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
    row-gap: 2vw;
    column-gap: 2vh;
    grid-template-columns: repeat(4, auto);
    align-items: center;
    justify-items: center;
  }
  /*------------------------------------------*/
  /*------------------------------------------*/
  /*------------------------------------------*/
  /*------------------------------------------*/
  @media all and (max-width: 700px) {
    .chatroomMenu {
      width: 90vw;
      height: 90vh;
      background-color: #242526;
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
      height: 12vh;
      width: 25vw;
      font-size: 15px;
      color: whitesmoke;
      background-color: #3a3b3c;
      border: none;
      border-radius: 3px;
      outline: none;
      display: block;
    }
    /*
  .chatSelect:focus {
    background-color: #eae7dc;
  }*/

    #chatbox {
      position: fixed;
      top: 11vh;
      width: 96vw;
      height: auto;
      overflow-y: scroll;
      background-color: transparent;
      height: 83.5vh;
    }
    .typeBox {
      position: absolute;
      left: 2vw;
      width: 80vw;
      bottom: 0vh;
    }
    .sendButton {
      position: absolute;
      bottom: 0vh;
      left: 83vw;
      width: 15vw;
    }
    #openChatSelect {
      position: absolute;
      font-size: medium;
      top: 6vh;
      height: 4vh;
      left: 3vw;
      width: 95vw;
      color: whitesmoke;
      background-color: #18191a;
      border: none;
      outline: none;
      transition: ease 0.3s;
    }
    #openChatSelect:hover {
      font-size: large;
    }

    #messageReceivedClose {
      font-size: large;
      position: relative;
      color: whitesmoke;
      text-align: left;
      margin-left: 1vw;
      background-color: #3a3b3c;
      border-radius: 8px;
      width: fit-content;
      margin-bottom: 0.25vh;
    }

    #messageReceivedSpace {
      font-size: large;
      position: relative;
      color: whitesmoke;
      text-align: left;
      margin-left: 1vw;
      background-color: #3a3b3c;
      border-radius: 8px;
      width: fit-content;
      margin-bottom: 2vh;
    }

    #messageSentClose {
      font-size: large;
      position: relative;
      color: whitesmoke;
      width: fit-content;
      margin-right: 1vw;
      text-align: right;
      margin-left: auto;
      border-radius: 8px;
      background-color: #3a3b3c;
      margin-bottom: 0.25vh;
    }
    #messageSentSpace {
      font-size: large;
      position: relative;
      color: whitesmoke;
      width: fit-content;
      margin-right: 1vw;
      text-align: right;
      margin-left: auto;
      border-radius: 8px;
      background-color: #3a3b3c;
      margin-bottom: 2vh;
    }
    #chatIndicator {
      position: relative;
      scale: 1.1;
      color: #e4e6eb;
      font-weight: bold;
      left: 52vw;
      margin-bottom: 1vh;
      width: fit-content;
      font-family: "Bungee Shade", cursive;
      top: 11.3vh;
      transition: ease 0.3s;
    }
    #chatIndicator:hover {
      scale: 1.7;
    }
    #h1 {
      position: fixed;
      left: 3vw;
      right: 85vw;
      top: -5vh;
      font-family: "Bungee Shade", cursive;
      scale: 0.9;
      color: #e4e6eb;
      transition: ease-out 0.3s;
    }
    #h1:hover {
      letter-spacing: 0.3vw;
    }

    #lineDivBottom {
      position: relative;
      border-bottom: 5px solid #b0b3b8;
      width: 95vw;
      bottom: 4.8vh;
      right: 16vw;
    }
    #lineDivTop {
      position: relative;
      border-bottom: 5px solid #b0b3b8;
      width: 95vw;
      bottom: 9vh;
    }
    #chatroomSelectClose {
      position: fixed;
      right: 5vw;
      top: 4vh;
      background-color: #b0b3b8;
      color: black;
    }
    #addChatroom {
      position: fixed;
      right: 5vw;
      bottom: 2vh;
      width: 90vw;
      background-color: #b0b3b8;
      color: black;
    }
    #chatroomContainer {
      position: relative;
      left: 0vw;
      top: 6vh;
      bottom: 1vh;
      height: 75vh;
      width: 90vw;
      overflow: scroll;
      display: grid;
      row-gap: 1vw;
      column-gap: 1vh;
      grid-template-columns: repeat(3, auto);
      align-items: center;
      justify-items: center;
    }
  }
</style>
