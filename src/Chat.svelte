<script>
  import Login from "./Login.svelte";
  import ChatMessage from "./Message.svelte";
  import { onMount } from "svelte";
  // Importiere gun von user.js. Wir müssen hier keine neue Instanz von Gun
  // erzeugen, weil wir diese bereits in user erstellt haben. Wir möchten hier
  // unbedingt die gleiche Instanz verwenden, ansonsten müssen wir die
  // Konfiguration nochmals angeben.
  import { username, user, gun } from "./user";

  import { prevent_default } from "svelte/internal";

  let newMessage;
  let messages = [];

  onMount(() => {
    // Get Messages
    // Damit erhalten wir alle Einträge die in der Datenbank unter "chat"
      // stehen. `map()` iteriert über all die Einträge. Mit der Funktion
      // `once()` können wir dann auf jedem Dateneintrag die callback funktion
      // genau einmal aufrufen. Das machen wir weil jeder Eintrag nur einmal im
      // Chat auftauchen soll.
    gun.get("chat")
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
      // Stelle einfach die Nachricht in den gesamten Chat. Dann können alle
      // aus dem Chatroom die Nachrichten abhören.
      // TODO: Erstelle einzelne Chatrooms. Die könnte man einfach mit
      // "chat-<name>" benennen, dann kann man einfach die Rooms unterscheiden.
      // TODO: Verschlüsselung pro Chatroom einführen. Jeder Room hat einen
      // eigenen Schlüssel, damit kann man sicher stellen das nur Personen die
      // den Schlüssel kennen den Chatroom auch lesen können.
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
