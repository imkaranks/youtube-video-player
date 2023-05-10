class VideoPlayer {
  constructor(player) {
    this.player = player;
    this.video = select('video', player);
    this.playPauseBtn = select();
    this.theatreBtn = select();
    this.miniPlayerBtn = select();
    this.fullscreenBtn = select();
    this.muteBtn = select();
    this.volumeAdjust = select();
    this.currentTime = select();
    this.duration = select();
  }
}

function select(html, target = document) {
  return target.querySelector(html);
}

function selectAll(html, target = document) {
  return target.querySelectorAll(html);
}