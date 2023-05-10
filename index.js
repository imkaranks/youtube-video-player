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
    this.$timelineBar = select('.player__timeline-bar', player);

    this.volumeLevel = "high";

    this.addEventListeners();
  }

  addEventListeners() {
    document.addEventListener('keydown', (ev) => this.handleKeyDown(ev));

    this.$playPauseBtn.addEventListener('click', () => this.togglePlay());
    this.$video.addEventListener('click', () => this.togglePlay());

    this.$video.addEventListener('play', () => {
      this.$player.classList.remove("paused");
    });

    this.$video.addEventListener('pause', () => {
      this.$player.classList.add("paused");
    });

    this.$theaterBtn.addEventListener('click', () => this.toggleTheaterMode());
    this.$miniPlayerBtn.addEventListener('click', () => this.toggleMiniPlayer());
    this.$fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());

    document.addEventListener("fullscreenchange", () => {
      this.$player.classList.toggle("full-screen", document.fullscreenElement);
    });

    this.$video.addEventListener("enterpictureinpicture", () => {
      this.$player.classList.add(".mini-player");
      this.$miniPlayerBtn.firstElementChild.textContent = 'Exit Miniplayer';
    });

    this.$video.addEventListener("leavepictureinpicture", () => {
      this.$player.classList.remove(".mini-player");
      this.$miniPlayerBtn.firstElementChild.textContent = 'Enter Miniplayer';
    });

    this.$muteBtn.addEventListener("click", () => this.toggleMute());

    this.$volumeAdjust.addEventListener("input", event => {
      this.$video.volume = event.target.value;
      this.$video.muted = event.target.value === 0;
    });

    this.$video.addEventListener("volumechange", () => this.adjustVolume());

    this.$video.addEventListener("loadeddata", () => {
      this.$duration.textContent = this.formatDuration(this.$video.duration);
    });

    this.$video.addEventListener("timeupdate", () => {
      this.$currentTime.textContent = this.formatDuration(this.$video.currentTime);
      const timeSpent = this.$video.currentTime / this.$video.duration;
      this.$timelineBar.style.setProperty('--progress-position', timeSpent)

    });
  }

  handleKeyDown(ev) {
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
  }

  togglePlay() {
    if (this.$video.paused) {
      this.$video.play();
      this.$playPauseBtn.firstElementChild.textContent = 'Pause Video';
    } else {
      this.$video.pause();
      this.$playPauseBtn.firstElementChild.textContent = 'Play Video';
    }
  }

  toggleFullscreen() {
    if (document.fullscreenElement == null) {
      this.$player.requestFullscreen();
      this.$fullscreenBtn.firstElementChild.textContent = 'Exit Fullscreen';
    }
    else {
      document.exitFullscreen();
      this.$fullscreenBtn.firstElementChild.textContent = 'Enter Fullscreen';
    }
  }

  toggleTheaterMode() {
    this.$player.classList.toggle("theater");
    if (this.$player.classList.contains('theater')) {
      this.$theaterBtn.firstElementChild.textContent = 'Exit Theater Mode';
    } else {
      this.$theaterBtn.firstElementChild.textContent = 'Enter Theater Mode';
    }
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
    if (this.$video.muted) {
      this.$muteBtn.firstElementChild.textContent = 'Mute';
    } else {
      this.$muteBtn.firstElementChild.textContent = 'Unmute';
    }
    this.$video.muted = !this.$video.muted;
  }

  adjustVolume() {
    this.$volumeAdjust.value = this.$video.volume;
    if (this.$video.muted || this.$video.volume === 0) {
      this.$volumeAdjust.value = 0;
      this.volumeLevel = "muted";
    }
    else if (this.$video.volume >= 0.5) {
      this.volumeLevel = "high";
    }
    else {
      this.volumeLevel = "low";
    }
    this.$player.dataset.volumeLevel = this.volumeLevel;
    this.$muteBtn.firstElementChild.textContent = `volume ${this.volumeLevel}`;
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