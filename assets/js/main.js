/* Blade & Bloom — interface behaviour */
(function () {
  'use strict';

  /* ---- mobile navigation ---- */
  var toggle = document.querySelector('.nav__toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.getAttribute('data-open') === 'true';
      nav.setAttribute('data-open', String(!open));
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.textContent = open ? 'Menu' : 'Close';
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && window.matchMedia('(max-width: 52rem)').matches) {
        nav.setAttribute('data-open', 'false');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = 'Menu';
      }
    });
  }

  /* ---- highlight today in every hours list ---- */
  var today = new Date().getDay(); // 0 = Sunday
  document.querySelectorAll('.hours li[data-day]').forEach(function (li) {
    if (li.getAttribute('data-day').split(',').indexOf(String(today)) > -1) {
      li.setAttribute('data-today', '');
    }
  });

  /* ---- open / closed indicator ---- */
  var chip = document.querySelector('[data-openstate]');
  if (chip) {
    var now = new Date();
    var h = now.getHours() + now.getMinutes() / 60;
    var open =
      (today >= 1 && today <= 5 && h >= 9 && h < 20) ||
      (today === 6 && h >= 9 && h < 18);
    chip.textContent = open ? 'Open now' : 'Closed now';
  }

  /* ---- scroll reveal ---- */
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targets = document.querySelectorAll('[data-reveal]');
  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* ---- emblem: set true path lengths so the draw animation is even ---- */
  document.querySelectorAll('.emblem .draw').forEach(function (path) {
    if (typeof path.getTotalLength === 'function') {
      var len = Math.ceil(path.getTotalLength());
      if (len) { path.style.setProperty('--len', len); }
    }
  });

  /* ---- booking form ---- */
  var form = document.getElementById('booking-form');
  if (form) {
    var dateField = form.querySelector('#date');
    if (dateField) {
      var t = new Date();
      var iso = function (d) { return d.toISOString().slice(0, 10); };
      dateField.min = iso(t);
      dateField.max = iso(new Date(t.getTime() + 90 * 864e5));
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = document.getElementById('booking-status');
      var data = new FormData(form);

      var chosen = new Date(data.get('date') + 'T00:00:00');
      if (!isNaN(chosen) && chosen.getDay() === 0) {
        status.hidden = false;
        status.textContent = 'We are closed Sundays. Pick Monday to Saturday and we will hold the chair.';
        status.focus();
        return;
      }

      var when = data.get('date') + ' at ' + data.get('time');
      status.hidden = false;
      status.innerHTML =
        'Request received, ' + escapeHtml(data.get('name')) + '. ' +
        'You asked for <b>' + escapeHtml(data.get('service')) + '</b> with <b>' +
        escapeHtml(data.get('barber')) + '</b> on <b>' + escapeHtml(when) + '</b>. ' +
        'We confirm by text within one business hour. ' +
        'This is a demo form — nothing was sent. Call (555) 123-4567 to book for real.';
      status.focus();
      form.reset();
    });
  }

  /* ---- contact form ---- */
  var contact = document.getElementById('contact-form');
  if (contact) {
    contact.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = document.getElementById('contact-status');
      status.hidden = false;
      status.textContent =
        'Thanks — your message is queued. We reply weekdays within a day. ' +
        'This is a demo form, so nothing was sent. Call (555) 123-4567 if it is urgent.';
      status.focus();
      contact.reset();
    });
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---- current year ---- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
