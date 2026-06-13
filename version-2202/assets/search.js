(function () {
  var input = document.getElementById('globalSearchInput');
  var button = document.getElementById('globalSearchButton');
  var results = document.getElementById('globalSearchResults');
  var list = window.MovieSearchIndex || [];

  if (!input || !button || !results) {
    return;
  }

  function getQuery() {
    var params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  }

  function render(query) {
    var normalized = query.trim().toLowerCase();
    var matched = list.filter(function (movie) {
      if (!normalized) {
        return true;
      }

      var text = [
        movie.title,
        movie.region,
        movie.type,
        movie.year,
        movie.genre,
        (movie.tags || []).join(' '),
        movie.oneLine
      ].join(' ').toLowerCase();

      return text.indexOf(normalized) !== -1;
    }).slice(0, 120);

    results.innerHTML = matched.map(function (movie) {
      return [
        '<article class="search-result-card">',
        '<div>',
        '<h2><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h2>',
        '<p>' + escapeHtml(movie.year + ' · ' + movie.region + ' · ' + movie.type + ' · ' + movie.genre) + '</p>',
        '<p>' + escapeHtml(movie.oneLine || '') + '</p>',
        '</div>',
        '<a class="btn primary" href="' + movie.url + '">进入详情</a>',
        '</article>'
      ].join('');
    }).join('');
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"]/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[char];
    });
  }

  function search() {
    render(input.value);
  }

  button.addEventListener('click', search);
  input.addEventListener('input', search);
  input.value = getQuery();
  render(input.value);
})();
