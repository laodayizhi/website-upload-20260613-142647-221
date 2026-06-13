(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var menuButton = document.querySelector('.menu-toggle');
    var nav = document.querySelector('.main-nav');
    if (menuButton && nav) {
      menuButton.addEventListener('click', function () {
        var open = nav.classList.toggle('is-open');
        menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
      var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
      var dots = Array.prototype.slice.call(carousel.querySelectorAll('.hero-dot'));
      if (!slides.length) {
        return;
      }
      var current = 0;
      function show(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle('is-active', i === current);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle('is-active', i === current);
        });
      }
      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
          show(i);
        });
      });
      window.setInterval(function () {
        show(current + 1);
      }, 5600);
    });

    document.querySelectorAll('.filter-input').forEach(function (input) {
      var scope = input.closest('.content-section').querySelector('.filter-scope') || document;
      var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
      input.addEventListener('input', function () {
        var value = input.value.trim().toLowerCase();
        cards.forEach(function (card) {
          var text = card.textContent.toLowerCase();
          var matched = !value || text.indexOf(value) !== -1;
          card.style.display = matched ? '' : 'none';
        });
      });
    });

    document.querySelectorAll('.movie-player').forEach(function (player) {
      var video = player.querySelector('video');
      var cover = player.querySelector('.player-cover');
      var loaded = false;
      var hlsInstance = null;
      function loadVideo() {
        if (!video || loaded) {
          return;
        }
        var src = video.getAttribute('data-video');
        if (!src) {
          return;
        }
        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(src);
          hlsInstance.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src;
        } else {
          video.src = src;
        }
        loaded = true;
      }
      function playVideo() {
        loadVideo();
        if (cover) {
          cover.hidden = true;
        }
        if (video) {
          var action = video.play();
          if (action && typeof action.catch === 'function') {
            action.catch(function () {});
          }
        }
      }
      if (cover) {
        cover.addEventListener('click', playVideo);
      }
      if (video) {
        video.addEventListener('play', function () {
          if (cover) {
            cover.hidden = true;
          }
        });
        video.addEventListener('click', function () {
          loadVideo();
        });
      }
      window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    });

    var searchInput = document.getElementById('siteSearchInput');
    var searchResults = document.getElementById('searchResults');
    var searchPanel = document.getElementById('searchPanel');
    if (searchInput && searchResults && window.SITE_MOVIES) {
      var params = new URLSearchParams(window.location.search);
      var initial = params.get('q') || '';
      searchInput.value = initial;
      function render(query) {
        var q = query.trim().toLowerCase();
        var list = window.SITE_MOVIES.filter(function (item) {
          if (!q) {
            return true;
          }
          return [item.title, item.region, item.year, item.genre, item.tags, item.one_line].join(' ').toLowerCase().indexOf(q) !== -1;
        }).slice(0, 120);
        if (!list.length) {
          searchResults.innerHTML = '<div class="empty-state">没有找到匹配的影片，请换个关键词。</div>';
          return;
        }
        searchResults.innerHTML = list.map(function (item) {
          return '<article class="movie-card">' +
            '<a class="poster-link" href="' + item.url + '">' +
            '<img src="' + item.image + '" alt="' + escapeHtml(item.title) + '" loading="lazy">' +
            '<span class="card-badge">' + escapeHtml(item.year) + '</span>' +
            '</a>' +
            '<div class="card-body">' +
            '<a class="card-title" href="' + item.url + '">' + escapeHtml(item.title) + '</a>' +
            '<div class="card-meta">' + escapeHtml(item.region) + ' · ' + escapeHtml(item.genre) + '</div>' +
            '<p>' + escapeHtml(item.one_line) + '</p>' +
            '</div>' +
            '</article>';
        }).join('');
      }
      function escapeHtml(text) {
        return String(text).replace(/[&<>"]/g, function (char) {
          return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[char];
        });
      }
      if (searchPanel) {
        searchPanel.addEventListener('submit', function (event) {
          event.preventDefault();
          var value = searchInput.value.trim();
          var url = value ? 'search.html?q=' + encodeURIComponent(value) : 'search.html';
          window.history.replaceState(null, '', url);
          render(value);
        });
      }
      searchInput.addEventListener('input', function () {
        render(searchInput.value);
      });
      render(initial);
    }
  });
})();
