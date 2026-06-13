(function () {
  var toggle = document.querySelector('[data-nav-toggle]');
  var nav = document.querySelector('[data-site-nav]');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  var slider = document.querySelector('[data-hero-slider]');

  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function startTimer() {
      clearInterval(timer);
      timer = setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        startTimer();
      });
    });

    showSlide(0);
    startTimer();
  }

  var grid = document.querySelector('[data-filter-grid]');
  var keywordInput = document.querySelector('[data-filter-input]');
  var yearSelect = document.querySelector('[data-filter-year]');

  if (grid && keywordInput) {
    var items = Array.prototype.slice.call(grid.querySelectorAll('.filter-item'));

    function filterItems() {
      var keyword = keywordInput.value.trim().toLowerCase();
      var yearValue = yearSelect ? yearSelect.value : '';

      items.forEach(function (item) {
        var searchable = [
          item.getAttribute('data-title'),
          item.getAttribute('data-region'),
          item.getAttribute('data-genre'),
          item.getAttribute('data-type'),
          item.getAttribute('data-year')
        ].join(' ').toLowerCase();
        var itemYear = Number(item.getAttribute('data-year')) || 0;
        var matchedKeyword = !keyword || searchable.indexOf(keyword) !== -1;
        var matchedYear = true;

        if (yearValue === '1990') {
          matchedYear = itemYear > 0 && itemYear < 1990;
        } else if (yearValue) {
          matchedYear = String(itemYear) === yearValue;
        }

        item.classList.toggle('is-hidden-by-filter', !(matchedKeyword && matchedYear));
      });
    }

    keywordInput.addEventListener('input', filterItems);

    if (yearSelect) {
      yearSelect.addEventListener('change', filterItems);
    }
  }
})();
