<template>
  <div class="video">
    <video
      :poster="poster"
      ref="videoPlayer"
      class="video-js video-player vjs-sublime-skin"
      preload="auto"
      playsinline
      @canplay="playerReady = true"
      @play="trackingPlay()"
      @progress="trackingProgress()"
    >
      <source :src="source" type="video/mp4">
    </video>
  </div>
</template>

<script>
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

export default {
  name: 'VideoPlayer',
  props: {
    source: {
      type: String,
      required: true
    },
    poster: {
      type: String,
      default: null
    },
    autoPlay: {
      type: Boolean,
      default: false
    },
    controls: {
      type: Boolean,
      default: false
    },
    muted: {
      type: Boolean,
      default: false
    },
    paused: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      player: null,
      playerReady: false,
      playerOptions: {
        preload: true,
        controls: this.controls,
        autoplay: this.autoPlay,
        muted: this.muted,
        fluid: true,
        loop: false,
        playsinline: true
      },
      playing: false
    }
  },
  mounted () {
    this.playerInitialise()
  },
  methods: {
    playerInitialise () {
      const playerElement = this.$refs.videoPlayer
      this.player = videojs(playerElement, this.playerOptions)
    },
    playPause () {
      if (this.playing) {
        this.player.pause()
        this.playing = false
      } else {
        this.player.play()
        this.playing = true
      }
    },
    goToTime (time) {
      this.player.currentTime(time)
    },
    trackingPlay () {
      // if user not logged in
      // send tracking event
    },
    trackingProgress () {
      // if user not logged in
      // send progress event
    }
  }
}
</script>

<style lang="stylus">
@import '../css/sublime.css';

.video-player {
    width: 100%;
    height: 100%;
    background-size: cover;

    .vjs-big-play-button {
        display: none;
    }

  .vjs-poster {
    background-size: cover !important;
  }

  .vjs-loading-spinner {
    display: none !important;
  }

  video {
    object-fit: cover;
  }
}
</style>
