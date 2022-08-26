<script>
  import { username } from "./user";
  export let message;
  export let sender;

  const messageClass = message.who === sender ? "sent" : "received";
</script>

<div class={`message ${messageClass}`}>
  <div class="message-text">
    <p>{`${message.who}: ${message.what}`}</p>
  </div>
</div>
