<script>
  export let message;
  export let sender;

  const messageClass = message.who === sender ? "sent" : "received";
</script>

<div class={`message ${messageClass}`}>
  <div class="message-text">
    <div>
      {message.who}: {message.what} <span id="time">{message.when}</span>
    </div>
    <p />
  </div>
</div>

<style>
</style>
