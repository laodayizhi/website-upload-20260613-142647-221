function initializeMoviePlayer(streamUrl) {
  var video = document.getElementById('movieVideo');
  var overlay = document.getElementById('playerOverlay');
  var hlsInstance = null;
  var prepared = false;

  if (!video || !overlay || !streamUrl) {
    return;
  }

  function prepareVideo() {
    if (prepared) {
      return;
    }

    prepared = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90
      });
      hlsInstance.loadSource(streamUrl);
      hlsInstance.attachMedia(video);
      return;
    }

    video.src = streamUrl;
  }

  function startPlayback() {
    prepareVideo();
    overlay.classList.add('is-hidden');
    video.setAttribute('controls', 'controls');
    var playPromise = video.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        overlay.classList.remove('is-hidden');
      });
    }
  }

  overlay.addEventListener('click', startPlayback);
  video.addEventListener('click', function () {
    if (video.paused) {
      startPlayback();
    }
  });

  window.addEventListener('pagehide', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  });
}
