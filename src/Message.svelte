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
