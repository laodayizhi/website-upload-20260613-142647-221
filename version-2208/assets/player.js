(function () {
    var players = document.querySelectorAll('[data-video]');

    players.forEach(function (player) {
        var video = player.querySelector('video');
        var button = player.querySelector('.play-cover');
        var src = player.getAttribute('data-video');
        var hls = null;

        if (!video || !button || !src) {
            return;
        }

        var load = function () {
            if (!video.getAttribute('data-ready')) {
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = src;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(src);
                    hls.attachMedia(video);
                    hls.on(window.Hls.Events.ERROR, function (eventName, data) {
                        if (data && data.fatal) {
                            if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                                hls.startLoad();
                            } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                                hls.recoverMediaError();
                            }
                        }
                    });
                } else {
                    video.src = src;
                }

                video.setAttribute('data-ready', '1');
            }

            button.classList.add('is-hidden');
            video.setAttribute('controls', 'controls');
            var request = video.play();

            if (request && typeof request.catch === 'function') {
                request.catch(function () {
                    button.classList.remove('is-hidden');
                });
            }
        };

        button.addEventListener('click', load);
        video.addEventListener('click', function () {
            if (!video.getAttribute('data-ready')) {
                load();
            }
        });

        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    });
})();
