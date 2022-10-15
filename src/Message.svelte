<script>
  export let message;
</script>

<div>
  <div class="message-text">
    <div id="wholemessage">
      <span id="message-sender">{message.who}</span>
      <br />
      <span id="message-content">{message.what} </span>
      <span id="time">{message.when}</span>
    </div>
  </div>
</div>

<style>
  #wholemessage {
    padding-right: 1vw;
    padding-left: 1vw;
  }
  #message-sender {
    position: absolute;
    color: darkgray;
    left: 0.3vw;
    font-style: italic;
    font-size: 2.75vh;
  }
  #message-content {
    position: relative;
    margin-right: 1vw;
    right: 0.7vw;
    bottom: 0.5vh;
  }
  #time {
    position: relative;
    font-size: small;
    left: 0.5vw;
  }
</style>
