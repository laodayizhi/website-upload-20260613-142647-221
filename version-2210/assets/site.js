(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function normalizeText(value) {
        return String(value || '').toLowerCase().trim();
    }

    function setupMenu() {
        var button = document.querySelector('.menu-toggle');
        var menu = document.querySelector('.mobile-nav');
        if (!button || !menu) {
            return;
        }
        button.addEventListener('click', function () {
            var isOpen = menu.classList.toggle('is-open');
            button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            button.textContent = isOpen ? '×' : '☰';
        });
    }

    function setupHeroSlider() {
        var slider = document.querySelector('[data-hero-slider]');
        if (!slider) {
            return;
        }
        var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dot'));
        if (!slides.length) {
            return;
        }
        var current = 0;
        var timer = null;
        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }
        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5600);
        }
        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                var index = Number(dot.getAttribute('data-slide')) || 0;
                show(index);
                start();
            });
        });
        slider.addEventListener('mouseenter', stop);
        slider.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function setupLocalFilter() {
        var input = document.querySelector('[data-local-filter]');
        var container = document.querySelector('[data-filter-container]');
        if (!input || !container) {
            return;
        }
        var cards = Array.prototype.slice.call(container.querySelectorAll('.movie-card'));
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get('q');
        if (initialQuery) {
            input.value = initialQuery;
        }
        function applyFilter() {
            var query = normalizeText(input.value);
            cards.forEach(function (card) {
                var haystack = normalizeText(card.getAttribute('data-keywords') + ' ' + card.textContent);
                var matched = !query || haystack.indexOf(query) !== -1;
                card.classList.toggle('is-filter-hidden', !matched);
            });
        }
        input.addEventListener('input', applyFilter);
        applyFilter();
    }

    function setupBackToTop() {
        var button = document.createElement('button');
        button.className = 'back-to-top';
        button.type = 'button';
        button.setAttribute('aria-label', '返回顶部');
        button.textContent = '↑';
        document.body.appendChild(button);
        function refresh() {
            button.classList.toggle('is-visible', window.scrollY > 360);
        }
        button.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        window.addEventListener('scroll', refresh, { passive: true });
        refresh();
    }

    ready(function () {
        setupMenu();
        setupHeroSlider();
        setupLocalFilter();
        setupBackToTop();
    });
})();

function setupMoviePlayer(videoId, buttonId, sourceUrl) {
    var video = document.getElementById(videoId);
    var button = document.getElementById(buttonId);
    var hlsInstance = null;
    var loaded = false;
    if (!video || !sourceUrl) {
        return;
    }

    function attachSource() {
        if (loaded) {
            return;
        }
        loaded = true;
        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hlsInstance.loadSource(sourceUrl);
            hlsInstance.attachMedia(video);
            hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
                if (!data || !data.fatal) {
                    return;
                }
                if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                    hlsInstance.startLoad();
                } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                    hlsInstance.recoverMediaError();
                } else {
                    hlsInstance.destroy();
                    hlsInstance = null;
                    video.src = sourceUrl;
                }
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = sourceUrl;
        } else {
            video.src = sourceUrl;
        }
    }

    function startPlayback() {
        attachSource();
        if (button) {
            button.classList.add('is-hidden');
        }
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {});
        }
    }

    if (button) {
        button.addEventListener('click', startPlayback);
    }
    video.addEventListener('click', function () {
        if (video.paused) {
            startPlayback();
        }
    });
    video.addEventListener('play', function () {
        if (button) {
            button.classList.add('is-hidden');
        }
    });
}
