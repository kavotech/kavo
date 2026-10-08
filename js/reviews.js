/* Client reviews: renders live reviews and powers the private review form. */
(function () {
    'use strict';

    function el(tag, cls, text) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text != null) n.textContent = text;
        return n;
    }
    function stars(n) {
        var s = el('span', 'stars');
        s.setAttribute('role', 'img');
        s.setAttribute('aria-label', n + ' out of 5 stars');
        for (var i = 1; i <= 5; i++) s.appendChild(el('i', i <= n ? 'on' : '', '★'));
        return s;
    }

    /* ---------- public display ---------- */
    var host = document.querySelector('[data-reviews]');
    if (host) {
        fetch('data/reviews.json?_=' + Math.floor(Date.now() / 60000), { cache: 'no-cache' })
            .then(function (r) { return r.ok ? r.json() : []; })
            .then(function (list) {
                if (!Array.isArray(list) || !list.length) return;
                var track = host.querySelector('[data-reviews-list]');
                var sum = host.querySelector('[data-reviews-summary]');
                var total = 0;
                list.slice(0, 12).forEach(function (rv, i) {
                    total += rv.rating;
                    var card = el('article', 'review-card');
                    card.style.setProperty('--i', i);
                    card.appendChild(stars(rv.rating));
                    card.appendChild(el('p', 'review-text', '“' + rv.text + '”'));
                    var who = el('footer', 'review-who');
                    who.appendChild(el('strong', null, rv.name));
                    who.appendChild(el('span', null, [rv.role, rv.company].filter(Boolean).join(', ')));
                    who.appendChild(el('em', null, rv.kind + (rv.project ? ' · ' + rv.project : '')));
                    card.appendChild(who);
                    track.appendChild(card);
                });
                var avg = (list.reduce(function (a, r) { return a + r.rating; }, 0) / list.length).toFixed(1);
                sum.appendChild(el('b', null, avg));
                sum.appendChild(stars(Math.round(avg)));
                sum.appendChild(el('span', null, 'from ' + list.length + ' client review' + (list.length === 1 ? '' : 's')));
                host.hidden = false;
                requestAnimationFrame(function () { host.classList.add('in'); });
            })
            .catch(function () { /* no reviews yet */ });
    }

    /* ---------- private review form ---------- */
    var form = document.getElementById('reviewForm');
    if (!form) return;
    var state = document.getElementById('reviewState');
    var token = new URLSearchParams(location.search).get('t') || '';
    var msg = document.getElementById('reviewMsg');

    function show(kind, title, body) {
        form.hidden = true;
        state.hidden = false;
        state.className = 'review-state is-' + kind;
        state.querySelector('h2').textContent = title;
        state.querySelector('p').textContent = body;
    }

    if (!token) {
        show('bad', 'This link is incomplete', 'Please use the private review link we sent you.');
        return;
    }
    fetch('/api/review?t=' + encodeURIComponent(token))
        .then(function (r) { return r.json(); })
        .then(function (s) {
            if (!s.valid) return show('bad', 'This link is not valid', 'Please ask us for a new review link.');
            if (s.used) return show('done', 'Already received', 'This review link has already been used. Thank you!');
            if (s.label) form.elements.company.value = s.label;
            form.hidden = false;
        })
        .catch(function () { show('bad', 'Something went wrong', 'We could not check your link. Please try again shortly.'); });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        msg.textContent = '';
        var fd = new FormData(form);
        var payload = { token: token };
        fd.forEach(function (v, k) { payload[k] = v; });
        if (!payload.rating) { msg.textContent = 'Please choose a star rating.'; return; }
        var btn = form.querySelector('button[type=submit]');
        btn.disabled = true;
        btn.textContent = 'SENDING…';
        fetch('/api/review', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
            .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
            .then(function (res) {
                if (res.ok && res.j.ok) {
                    show('done', 'Thank you!', 'Your review has been received and will appear on kavotech.uk within a couple of minutes.');
                } else {
                    msg.textContent = res.j.error || 'Could not send your review.';
                    btn.disabled = false; btn.textContent = 'SUBMIT REVIEW';
                }
            })
            .catch(function () {
                msg.textContent = 'Network problem. Please try again.';
                btn.disabled = false; btn.textContent = 'SUBMIT REVIEW';
            });
    });
})();
