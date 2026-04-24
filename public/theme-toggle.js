(function () {
    var root = document.documentElement;
    var SCHEMES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
    var SCHEME_COLORS = {
        A: '#4a7c59', B: '#4a6fa5', C: '#c0622a', D: '#c06070',
        E: '#c07818', F: '#2a8c62', G: '#7848cc', H: '#1848cc',
        I: '#141414', J: '#507838', K: '#b86030'
    };

    function getStoredScheme() {
        try { return localStorage.getItem('colorScheme') || 'C'; } catch { return 'C'; }
    }

    function storeScheme(scheme) {
        try { localStorage.setItem('colorScheme', scheme); } catch { }
    }

    function getStoredDark() {
        try {
            var v = localStorage.getItem('darkMode');
            if (v !== null) return v === 'true';
        } catch { }
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function storeDark(isDark) {
        try { localStorage.setItem('darkMode', String(isDark)); } catch { }
    }

    function applyTheme(scheme, isDark) {
        root.setAttribute('data-theme', scheme);
        root.classList.toggle('dark', isDark);
    }

    function updateSchemeDots(scheme) {
        SCHEMES.forEach(function (s) {
            var dot = document.getElementById('scheme-dot-' + s);
            if (!dot) return;
            var active = s === scheme;
            dot.setAttribute('aria-pressed', active ? 'true' : 'false');
            var ring = dot.querySelector('span') || dot;
            if (active) {
                ring.classList.add('ring-accent');
                ring.classList.remove('ring-transparent');
            } else {
                ring.classList.add('ring-transparent');
                ring.classList.remove('ring-accent');
            }
        });
        var icon = document.getElementById('scheme-indicator-icon');
        if (icon && SCHEME_COLORS[scheme]) {
            icon.style.color = SCHEME_COLORS[scheme];
        }
    }

    function updateDarkModeIcon(isDark) {
        var lightIcon = document.getElementById('dark-mode-icon-light');
        var darkIcon = document.getElementById('dark-mode-icon-dark');
        if (lightIcon) lightIcon.classList.toggle('hidden', isDark);
        if (darkIcon) darkIcon.classList.toggle('hidden', !isDark);
    }

    function setupSchemePicker() {
        var dropdown = document.getElementById('scheme-dropdown');
        var trigger = document.getElementById('scheme-trigger');
        var picker = document.getElementById('theme-scheme-picker');

        if (trigger && dropdown) {
            trigger.addEventListener('click', function (e) {
                e.stopPropagation();
                dropdown.classList.toggle('hidden');
            });
            document.addEventListener('click', function (e) {
                if (!dropdown.contains(e.target) && e.target !== trigger) {
                    dropdown.classList.add('hidden');
                }
            });
        }

        if (picker) {
            picker.addEventListener('click', function (e) {
                var sw = e.target.closest('[data-scheme]');
                if (!sw) return;
                var clicked = sw.dataset.scheme;
                var curDark = root.classList.contains('dark');
                storeScheme(clicked);
                applyTheme(clicked, curDark);
                updateSchemeDots(clicked);
                if (dropdown) dropdown.classList.add('hidden');
            });
        }
    }

    function setupDarkModeToggle() {
        var btn = document.getElementById('dark-mode-toggle');
        if (!btn) return;
        btn.addEventListener('click', function () {
            var curScheme = root.getAttribute('data-theme') || 'C';
            var curDark = root.classList.contains('dark');
            var newDark = !curDark;
            storeDark(newDark);
            applyTheme(curScheme, newDark);
            updateDarkModeIcon(newDark);
        });
    }

    function setup() {
        var scheme = getStoredScheme();
        var isDark = getStoredDark();
        applyTheme(scheme, isDark);
        updateSchemeDots(scheme);
        updateDarkModeIcon(isDark);
        setupSchemePicker();
        setupDarkModeToggle();
    }

    applyTheme(getStoredScheme(), getStoredDark());
    document.addEventListener('astro:page-load', setup);
    document.addEventListener('astro:after-swap', function () {
        applyTheme(getStoredScheme(), getStoredDark());
        setup();
    });
})();
