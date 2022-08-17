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

<div class="message-text">
  <!--MISSING DIV-->
  <p>{message.what}</p>
</div>
