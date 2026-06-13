(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');

    if (toggle && panel) {
        toggle.addEventListener('click', function () {
            panel.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var index = 0;
        var timer = null;

        var showSlide = function (next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        };

        var start = function () {
            timer = window.setInterval(function () {
                showSlide(index + 1);
            }, 5200);
        };

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                window.clearInterval(timer);
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
                start();
            });
        });

        if (slides.length > 1) {
            start();
        }
    }

    var searchBlocks = document.querySelectorAll('[data-page-search]');

    searchBlocks.forEach(function (block) {
        var input = block.querySelector('[data-filter-input]');
        var year = block.querySelector('[data-year-filter]');
        var region = block.querySelector('[data-region-filter]');
        var list = document.querySelector('[data-filter-list]');

        if (!list) {
            return;
        }

        var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get('q');

        if (input && initialQuery) {
            input.value = initialQuery;
        }

        var apply = function () {
            var query = input ? input.value.trim().toLowerCase() : '';
            var selectedYear = year ? year.value : '';
            var selectedRegion = region ? region.value : '';

            cards.forEach(function (card) {
                var haystack = [
                    card.getAttribute('data-title') || '',
                    card.getAttribute('data-year') || '',
                    card.getAttribute('data-region') || '',
                    card.getAttribute('data-genre') || '',
                    card.textContent || ''
                ].join(' ').toLowerCase();
                var yearMatch = !selectedYear || card.getAttribute('data-year') === selectedYear;
                var regionMatch = !selectedRegion || card.getAttribute('data-region') === selectedRegion;
                var queryMatch = !query || haystack.indexOf(query) !== -1;

                card.classList.toggle('is-filter-hidden', !(yearMatch && regionMatch && queryMatch));
            });
        };

        ['input', 'change'].forEach(function (eventName) {
            if (input) {
                input.addEventListener(eventName, apply);
            }
            if (year) {
                year.addEventListener(eventName, apply);
            }
            if (region) {
                region.addEventListener(eventName, apply);
            }
        });

        apply();
    });
})();
