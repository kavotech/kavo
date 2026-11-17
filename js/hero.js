// ========================================
// Interactive hero: reactive dot field, spotlight, typed words,
// floating project previews, magnetic buttons and tilt cards.
// Everything degrades to a static hero with prefers-reduced-motion.
// ========================================
(function () {
    'use strict';

    const hero = document.querySelector('[data-hero]');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    function accentColour() {
        const value = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
        return value || '#0096c7';
    }

    function hexToRgb(hex) {
        const m = hex.replace('#', '').match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
        return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [0, 150, 199];
    }

    // ---------------------------------------------------------------- Dot field
    function initDotField() {
        const canvas = hero && hero.querySelector('[data-hero-canvas]');
        if (!canvas || !canvas.getContext) return;
        const ctx = canvas.getContext('2d');
        const GAP = window.innerWidth < 768 ? 26 : 30;
        const RADIUS = 170;
        let dots = [];
        let width = 0;
        let height = 0;
        let dpr = 1;
        let accent = hexToRgb(accentColour());
        const pointer = { x: -9999, y: -9999, active: false };
        const ripples = [];
        let running = false;
        let visible = true;
        let rafId = 0;

        function resize() {
            const rect = hero.getBoundingClientRect();
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = rect.width;
            height = rect.height;
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            dots = [];
            const offsetX = (width % GAP) / 2;
            const offsetY = (height % GAP) / 2;
            for (let y = offsetY; y < height; y += GAP) {
                for (let x = offsetX; x < width; x += GAP) {
                    dots.push({ x, y, ox: x, oy: y });
                }
            }
            if (!running) draw(performance.now());
        }

        function draw(time) {
            ctx.clearRect(0, 0, width, height);
            const [r, g, b] = accent;
            const t = time / 1000;
            for (let i = ripples.length - 1; i >= 0; i--) {
                ripples[i].radius += 9;
                ripples[i].life -= 0.018;
                if (ripples[i].life <= 0) ripples.splice(i, 1);
            }
            for (const dot of dots) {
                // gentle ambient wave so the field never looks static
                const wave = reduceMotion ? 0 : Math.sin(dot.ox * 0.012 + t * 0.9) * Math.cos(dot.oy * 0.014 + t * 0.7);
                let influence = 0;
                let dx = 0;
                let dy = 0;
                if (pointer.active) {
                    dx = dot.ox - pointer.x;
                    dy = dot.oy - pointer.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < RADIUS) influence = 1 - dist / RADIUS;
                }
                let rippleBoost = 0;
                for (const rp of ripples) {
                    const d = Math.abs(Math.hypot(dot.ox - rp.x, dot.oy - rp.y) - rp.radius);
                    if (d < 28) rippleBoost = Math.max(rippleBoost, (1 - d / 28) * rp.life);
                }
                // dots ease towards a position pushed away from the pointer
                const push = influence * influence * 14;
                const len = Math.hypot(dx, dy) || 1;
                const tx = dot.ox + (dx / len) * push;
                const ty = dot.oy + (dy / len) * push + wave * 2;
                dot.x += (tx - dot.x) * 0.18;
                dot.y += (ty - dot.y) * 0.18;

                const glow = Math.max(influence, rippleBoost);
                const size = 1.1 + glow * 2.6 + (wave + 1) * 0.25;
                if (glow > 0.02) {
                    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.25 + glow * 0.75})`;
                } else {
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.13)';
                }
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function loop(time) {
            if (!running) return;
            draw(time);
            rafId = requestAnimationFrame(loop);
        }

        function start() {
            if (running || reduceMotion || !visible || document.hidden) return;
            running = true;
            rafId = requestAnimationFrame(loop);
        }

        function stop() {
            running = false;
            cancelAnimationFrame(rafId);
        }

        function setPointer(clientX, clientY) {
            const rect = canvas.getBoundingClientRect();
            pointer.x = clientX - rect.left;
            pointer.y = clientY - rect.top;
            pointer.active = true;
        }

        hero.addEventListener('pointermove', (e) => setPointer(e.clientX, e.clientY), { passive: true });
        hero.addEventListener('pointerleave', () => { pointer.active = false; });
        hero.addEventListener('pointerdown', (e) => {
            if (reduceMotion) return;
            if (e.target.closest('a, button')) return;
            const rect = canvas.getBoundingClientRect();
            ripples.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, radius: 0, life: 1 });
            if (ripples.length > 4) ripples.shift();
        });
        // touch: let the field follow the finger while it is down
        hero.addEventListener('touchend', () => { pointer.active = false; }, { passive: true });

        new IntersectionObserver((entries) => {
            visible = entries[0].isIntersecting;
            if (visible) start(); else stop();
        }).observe(hero);
        document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

        // re-read the accent when the blue/red theme switch is used
        new MutationObserver(() => {
            accent = hexToRgb(accentColour());
            if (!running) draw(performance.now());
        }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(resize, 150);
        });
        resize();
        start();
    }

    // ---------------------------------------------------------------- Spotlight
    function initSpotlight() {
        const spot = hero && hero.querySelector('.hero-spotlight');
        if (!spot || !finePointer || reduceMotion) return;
        let raf = 0;
        hero.addEventListener('pointermove', (e) => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const rect = hero.getBoundingClientRect();
                spot.style.setProperty('--sx', `${e.clientX - rect.left}px`);
                spot.style.setProperty('--sy', `${e.clientY - rect.top}px`);
                spot.classList.add('is-on');
            });
        });
        hero.addEventListener('pointerleave', () => spot.classList.remove('is-on'));
    }

    // ------------------------------------------------------------- Typed words
    function initTyped() {
        const el = document.querySelector('[data-typed]');
        if (!el) return;
        const words = (el.dataset.words || '').split('|').filter(Boolean);
        if (words.length < 2 || reduceMotion) return;
        let wordIndex = 0;
        let charIndex = words[0].length;
        let deleting = false;

        function tick() {
            const word = words[wordIndex];
            if (!deleting) {
                charIndex++;
                el.textContent = word.slice(0, charIndex);
                if (charIndex >= word.length) {
                    deleting = true;
                    return setTimeout(tick, 1700);
                }
                return setTimeout(tick, 70 + Math.random() * 50);
            }
            charIndex--;
            el.textContent = word.slice(0, charIndex);
            if (charIndex <= 0) {
                deleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                return setTimeout(tick, 280);
            }
            return setTimeout(tick, 38);
        }
        setTimeout(() => { deleting = true; tick(); }, 2400);
    }

    // ----------------------------------------------- Floating project previews
    function initFloats() {
        const floats = hero ? Array.from(hero.querySelectorAll('.hero-float')) : [];
        if (!floats.length || !finePointer || reduceMotion) return;
        let raf = 0;
        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;

        function animate() {
            currentX += (targetX - currentX) * 0.08;
            currentY += (targetY - currentY) * 0.08;
            floats.forEach((el) => {
                const depth = Number(el.dataset.depth || 1);
                el.style.setProperty('--px', `${(currentX * 28 * depth).toFixed(2)}px`);
                el.style.setProperty('--py', `${(currentY * 22 * depth).toFixed(2)}px`);
            });
            if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
                raf = requestAnimationFrame(animate);
            } else {
                raf = 0;
            }
        }

        hero.addEventListener('pointermove', (e) => {
            const rect = hero.getBoundingClientRect();
            targetX = (e.clientX - rect.left) / rect.width - 0.5;
            targetY = (e.clientY - rect.top) / rect.height - 0.5;
            if (!raf) raf = requestAnimationFrame(animate);
        });
        hero.addEventListener('pointerleave', () => {
            targetX = 0;
            targetY = 0;
            if (!raf) raf = requestAnimationFrame(animate);
        });
    }

    // Entrance animations use fill-mode "both", which would override inline
    // transforms; once an element has finished entering, release it.
    function releaseAnimation(el) {
        const release = () => { el.style.animation = 'none'; };
        el.addEventListener('animationend', release, { once: true });
        el.addEventListener('pointerenter', () => {
            const anims = el.getAnimations ? el.getAnimations() : [];
            if (!anims.some((a) => a.playState === 'running')) release();
        });
    }

    // ---------------------------------------------------------- Magnetic buttons
    function initMagnetic() {
        if (!finePointer || reduceMotion) return;
        document.querySelectorAll('[data-magnetic]').forEach((el) => {
            releaseAnimation(el);
            el.addEventListener('pointermove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
                const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
                el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
            });
            el.addEventListener('pointerleave', () => { el.style.transform = ''; });
        });
    }

    // --------------------------------------------------------------- Tilt cards
    function initTilt() {
        if (!finePointer || reduceMotion) return;
        document.querySelectorAll('[data-tilt]').forEach((el) => {
            releaseAnimation(el);
            el.addEventListener('pointermove', (e) => {
                const rect = el.getBoundingClientRect();
                const px = (e.clientX - rect.left) / rect.width - 0.5;
                const py = (e.clientY - rect.top) / rect.height - 0.5;
                el.style.transform = `perspective(700px) rotateX(${(-py * 10).toFixed(2)}deg) rotateY(${(px * 12).toFixed(2)}deg) translateY(-4px)`;
                el.style.setProperty('--gx', `${((px + 0.5) * 100).toFixed(1)}%`);
                el.style.setProperty('--gy', `${((py + 0.5) * 100).toFixed(1)}%`);
            });
            el.addEventListener('pointerleave', () => { el.style.transform = ''; });
        });
    }

    initDotField();
    initSpotlight();
    initTyped();
    initFloats();
    initMagnetic();
    initTilt();
})();
