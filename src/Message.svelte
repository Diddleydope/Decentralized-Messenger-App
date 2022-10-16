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
    left: 0.75vw;
    font-style: italic;
  }
  #message-content {
    position: relative;
    margin-right: 1vw;
    right: 0.7vw;
    bottom: 0.5vh;
    left: -0.1vw;
  }
  #time {
    position: relative;
    font-size: small;
    left: 0.5vw;
    margin-right: 0.75vw;
    scale: 0.8;
  }
</style>
