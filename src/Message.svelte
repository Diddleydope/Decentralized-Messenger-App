<script>
  export let messenger;
  export let message;

  let messageType;

  if (message.who === messenger) {
    messageType = "sent";
  } else {
    messageType = "received";
  }
</script>

<div class="message ${messageType}">
  <div class="message-text">
    <ul />
  </div>
</div>
