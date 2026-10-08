/* Projects & case-study interactions: device preview, auto-scroll, timeline, counters, filters. */
(function () {
    'use strict';
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

    function lazyImgs(root) {
        root.querySelectorAll('img[data-src]').forEach(function (img) {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
        });
    }

    /* ---------- Card previews: hover to scroll the full page ---------- */
    document.querySelectorAll('.phone-screen.peek').forEach(function (screen) {
        var img = screen.querySelector('img');
        var host = screen.closest('a, article') || screen;
        var swapped = false;
        function start() {
            if (reduce) return;
            if (!swapped && img.dataset.full) {
                swapped = true;
                var full = new Image();
                full.onload = function () {
                    img.src = full.src;
                    img.removeAttribute('width');
                    img.removeAttribute('height');
                    requestAnimationFrame(function () { screen.classList.add('is-scrolling'); });
                };
                full.src = img.dataset.full;
            } else if (swapped) {
                screen.classList.add('is-scrolling');
            }
        }
        function stop() { screen.classList.remove('is-scrolling'); }
        host.addEventListener('pointerenter', start);
        host.addEventListener('pointerleave', stop);
        host.addEventListener('focusin', start);
        host.addEventListener('focusout', stop);
    });

    /* ---------- Projects filters ---------- */
    var chips = document.querySelectorAll('.project-filters .chip');
    if (chips.length) {
        var cards = document.querySelectorAll('.project-card');
        var groups = document.querySelectorAll('.project-group');
        var empty = document.querySelector('.filter-empty');
        var state = { region: 'all', cat: 'all' };
        var regionKeys = { all: 1, uk: 1, intl: 1 };
        function apply() {
            var shown = 0;
            cards.forEach(function (card) {
                var ok = (state.region === 'all' || card.dataset.region === state.region) &&
                    (state.cat === 'all' || card.dataset.cat === state.cat);
                if (ok && card.hidden) { card.hidden = false; card.classList.remove('pop-in'); void card.offsetWidth; card.classList.add('pop-in'); }
                else if (!ok) card.hidden = true;
                if (ok) shown++;
            });
            groups.forEach(function (g) { g.hidden = !g.querySelector('.project-card:not([hidden])'); });
            if (empty) empty.hidden = shown !== 0;
        }
        chips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                var f = chip.dataset.filter;
                if (regionKeys[f]) state.region = f; else state.cat = state.cat === f ? 'all' : f;
                if (f === 'all') { state.region = 'all'; state.cat = 'all'; }
                chips.forEach(function (c) {
                    var k = c.dataset.filter;
                    c.classList.toggle('is-active', regionKeys[k] ? k === state.region && (k !== 'all' || state.cat === 'all') : k === state.cat);
                });
                apply();
            });
        });
    }

    /* ---------- Device stage ---------- */
    var stage = document.querySelector('[data-stage]');
    if (stage) {
        var modes = stage.querySelectorAll('[data-mode]');
        var devices = stage.querySelectorAll('[data-device]');
        var canvas = stage.querySelector('.stage-canvas');
        var autoBtn = stage.querySelector('[data-autoscroll]');
        var raf = 0, dir = 1, auto = false, lastT = 0;

        function activeScroller() {
            var d = stage.querySelector('.device.is-active');
            return d && d.querySelector('.scroller');
        }
        function stopAuto() {
            auto = false;
            cancelAnimationFrame(raf);
            if (autoBtn) { autoBtn.setAttribute('aria-pressed', 'false'); autoBtn.classList.remove('is-on'); }
        }
        function tick(t) {
            if (!auto) return;
            var s = activeScroller();
            if (!s) return stopAuto();
            var dt = Math.min(48, t - lastT); lastT = t;
            var max = s.scrollHeight - s.clientHeight;
            if (max <= 0) return stopAuto();
            s.scrollTop += dir * dt * 0.07 * (s.classList.contains('desk-screen') ? 1.6 : 1);
            if (s.scrollTop >= max - 1) { dir = -1; }
            else if (s.scrollTop <= 0) { dir = 1; }
            raf = requestAnimationFrame(tick);
        }
        function startAuto() {
            if (!activeScroller()) return;
            auto = true; dir = 1; lastT = performance.now();
            autoBtn.setAttribute('aria-pressed', 'true'); autoBtn.classList.add('is-on');
            raf = requestAnimationFrame(tick);
        }
        if (autoBtn) autoBtn.addEventListener('click', function () { auto ? stopAuto() : startAuto(); });
        stage.querySelectorAll('.scroller').forEach(function (s) {
            ['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach(function (ev) { s.addEventListener(ev, stopAuto, { passive: true }); });
        });

        function setMode(mode) {
            stopAuto();
            modes.forEach(function (b) {
                var on = b.dataset.mode === mode;
                b.classList.toggle('is-active', on);
                b.setAttribute('aria-selected', on ? 'true' : 'false');
            });
            devices.forEach(function (d) {
                var on = d.dataset.device === mode;
                d.hidden = !on;
                d.classList.toggle('is-active', on);
                if (on) { lazyImgs(d); d.classList.remove('swap-in'); void d.offsetWidth; d.classList.add('swap-in'); }
            });
            if (autoBtn) autoBtn.hidden = mode === 'app';
            if (mode === 'app') startApp(); else stopApp();
        }
        modes.forEach(function (b) { b.addEventListener('click', function () { setMode(b.dataset.mode); }); });

        /* App walkthrough */
        var slides = stage.querySelectorAll('.app-slide');
        var steps = stage.querySelectorAll('.app-step');
        var cur = 0, appTimer = 0;
        function show(i) {
            cur = (i + slides.length) % slides.length;
            slides.forEach(function (s, k) { s.classList.toggle('is-on', k === cur); });
            steps.forEach(function (s, k) { s.classList.toggle('is-on', k === cur); });
        }
        function stopApp() { clearInterval(appTimer); appTimer = 0; }
        function startApp() {
            stopApp();
            if (!slides.length || reduce) return;
            appTimer = setInterval(function () { show(cur + 1); }, 3200);
        }
        steps.forEach(function (b) {
            b.addEventListener('click', function () { show(parseInt(b.dataset.step, 10)); stopApp(); });
        });

        /* 3D tilt on the active device */
        if (!reduce && !coarse && canvas) {
            canvas.addEventListener('pointermove', function (e) {
                var d = stage.querySelector('.device.is-active .phone-mock, .device.is-active .browser-frame');
                if (!d) return;
                var r = canvas.getBoundingClientRect();
                var x = (e.clientX - r.left) / r.width - 0.5;
                var y = (e.clientY - r.top) / r.height - 0.5;
                d.style.transform = 'perspective(1100px) rotateY(' + (x * 9).toFixed(2) + 'deg) rotateX(' + (-y * 6).toFixed(2) + 'deg)';
            });
            canvas.addEventListener('pointerleave', function () {
                stage.querySelectorAll('.phone-mock, .browser-frame').forEach(function (d) { d.style.transform = ''; });
            });
        }

        /* Nudge the phone to hint that it scrolls */
        var phoneScroller = stage.querySelector('.device-phone .scroller');
        if (phoneScroller && !reduce && 'IntersectionObserver' in window) {
            var hinted = false;
            new IntersectionObserver(function (es, io) {
                es.forEach(function (e) {
                    if (e.isIntersecting && !hinted) {
                        hinted = true; io.disconnect();
                        setTimeout(function () {
                            if (phoneScroller.scrollTop > 0) return;
                            phoneScroller.scrollTo({ top: 220, behavior: 'smooth' });
                            setTimeout(function () { if (phoneScroller.scrollTop < 260) phoneScroller.scrollTo({ top: 0, behavior: 'smooth' }); }, 900);
                        }, 600);
                    }
                });
            }, { threshold: 0.5 }).observe(phoneScroller);
        }
    }

    /* ---------- Stagger reveal ---------- */
    var staggers = document.querySelectorAll('[data-stagger], [data-timeline]');
    /* ---------- Counters ---------- */
    var counters = document.querySelectorAll('[data-count]');
    function runCounter(el) {
        var target = parseInt(el.dataset.count, 10) || 0;
        if (reduce) { el.textContent = target; return; }
        var t0 = performance.now(), dur = 1100;
        (function step(t) {
            var p = Math.min(1, (t - t0) / dur);
            el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(step);
        })(t0);
    }
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (!e.isIntersecting) return;
                e.target.classList.add('in');
                io.unobserve(e.target);
            });
        }, { threshold: 0.2 });
        staggers.forEach(function (el) { io.observe(el); });
        var io2 = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (!e.isIntersecting) return;
                runCounter(e.target); io2.unobserve(e.target);
            });
        }, { threshold: 0.6 });
        counters.forEach(function (el) { io2.observe(el); });
    } else {
        staggers.forEach(function (el) { el.classList.add('in'); });
        counters.forEach(runCounter);
    }

    /* ---------- Timeline line draws as you scroll ---------- */
    var tl = document.querySelector('[data-timeline]');
    if (tl) {
        function onScroll() {
            var r = tl.getBoundingClientRect();
            var p = (window.innerHeight * 0.6 - r.top) / r.height;
            tl.style.setProperty('--progress', Math.max(0, Math.min(1, p)).toFixed(3));
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        onScroll();
    }
})();
