class VideoPlayer {
  constructor(player) {
    this.$player = player;
    this.$video = select('.player__video', player);
    this.$playPauseBtn = select('.player__control-btn.play-pause', player);
    this.$theaterBtn = select('.player__control-btn.theatermode', player);
    this.$miniPlayerBtn = select('.player__control-btn.miniplayer', player);
    this.$fullscreenBtn = select('.player__control-btn.fullscreen', player);
    this.$muteBtn = select('.player__control-btn.volume', player);
    this.$volumeAdjust = select('.volume-slider', player);
    this.$currentTime = select('.player__duration-current', player);
    this.$duration = select('.player__duration-total', player);

    this.togglePlay = this.togglePlay.bind(this);
    this.toggleMiniPlayer = this.toggleMiniPlayer.bind(this);
    this.toggleTheaterMode = this.toggleTheaterMode.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.toggleMute = this.toggleMute.bind(this);
    this.formatDuration = this.formatDuration.bind(this);
    this.skipVideo = this.skipVideo.bind(this);

    this.state = {
      volumeLevel: "high"
    }

    this.addEventListeners();
  }

  addEventListeners() {
    document.addEventListener('keydown', (ev) => {
      switch (ev.key.toLowerCase()) {
        case ' ':
        case 'k':
          this.togglePlay();
          break;
        case 'f':
          this.toggleFullscreen();
          break;
        case 't':
          this.toggleTheaterMode();
          break;
        case 'i':
          this.toggleMiniPlayer();
          break;
        case 'm':
          this.toggleMute();
          break;
        case 'arrowleft':
        case 'j':
          this.skipVideo(-5);
          break;
        case 'arrowright':
        case 'l':
          this.skipVideo(5);
          break;
      }
    });

    this.$playPauseBtn.addEventListener('click', this.togglePlay);
    this.$video.addEventListener('click', this.togglePlay);
    this.$video.addEventListener('play', () => {
      this.$player.classList.remove("paused");
    });
    this.$video.addEventListener('pause', () => {
      this.$player.classList.add("paused");
    });

    this.$theaterBtn.addEventListener('click', this.toggleTheaterMode);
    this.$miniPlayerBtn.addEventListener('click', this.toggleMiniPlayer);
    this.$fullscreenBtn.addEventListener('click', this.toggleFullscreen);

    document.addEventListener("fullscreenchange", () => {
      this.$player.classList.toggle("full-screen", document.fullscreenElement);
    });
    this.$video.addEventListener("enterpictureinpicture", () => {
      this.$player.classList.add(".mini-player");
    });
    this.$video.addEventListener("leavepictureinpicture", () => {
      this.$player.classList.remove(".mini-player");
    });

    this.$muteBtn.addEventListener("click", this.toggleMute);
    this.$volumeAdjust.addEventListener("input", event => {
      this.$video.volume = event.target.value;
      this.$video.muted = event.target.value === 0;
    });
    this.$video.addEventListener("volumechange", () => {
      this.$volumeAdjust.value = this.$video.volume;
      if (this.$video.muted || this.$video.volume === 0) {
        this.$volumeAdjust.value = 0;
        this.state = { ...this.state, volumeLevel: "muted" };
      }
      else if (this.$video.volume >= 0.5) {
        this.state = { ...this.state, volumeLevel: "high" };
      }
      else {
        this.state = { ...this.state, volumeLevel: "low" };
      }
      this.$player.dataset.volumeLevel = this.state.volumeLevel;
    });

    this.$video.addEventListener("loadeddata", () => {
      this.$duration.textContent = this.formatDuration(this.$video.duration);
    });
    this.$video.addEventListener("timeupdate", () => {
      this.$currentTime.textContent = this.formatDuration(this.$video.currentTime);
    });
  }

  togglePlay() {
    this.$video.paused
      ? this.$video.play()
      : this.$video.pause()
  }

  toggleFullscreen() {
    console.log('fullscreen');
    if (document.fullscreenElement == null) {
      this.$player.requestFullscreen();
    }
    else {
      document.exitFullscreen();
    }
  }

  toggleTheaterMode() {
    this.$player.classList.toggle("theater");
  }

  toggleMiniPlayer() {
    if (this.$player.classList.contains("mini-player")) {
      document.exitPictureInPicture();
    }
    else {
      this.$video.requestPictureInPicture();
    }
  }

  toggleMute() {
    this.$video.muted = !this.$video.muted;
  }

  formatDuration(time) {
    const leadingZeroFormatter =
      new Intl.NumberFormat(
        undefined,
        { minimumIntegerDigits: 2 }
      );

    const seconds = Math.round(time % 60);
    const minutes = Math.round(time / 60) % 60;
    const hours = Math.round(time / 3600);

    return hours === 0
      ? `${minutes}:${leadingZeroFormatter.format(seconds)}`
      : `${hours}:${leadingZeroFormatter.format(minutes)}:${leadingZeroFormatter.format(seconds)}`;
  }

  skipVideo(duration) {
    this.$video.currentTime += duration;
  }
}

function select(html, target = document) {
  return target.querySelector(html);
}

function selectAll(html, target = document) {
  return target.querySelectorAll(html);
}

new VideoPlayer(select('.player'));