// Golden Hands Massage & Spa — Kampot

// Paste your n8n Webhook URL here (Webhook node -> Production URL).
// Until this is set, the booking form will show a friendly message
// instead of trying to send anywhere.
var N8N_WEBHOOK_URL = 'https://n8n.srv873866.hstgr.cloud/webhook/21e3ebeb-3ec7-41d2-814e-a03a1d2a4f2a';

document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  var burger = document.getElementById('burger');
  var nav = document.getElementById('siteNav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Menu tab switching
  var tabs = document.querySelectorAll('.menu-tab');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = tab.getAttribute('data-tab');

      tabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');

      document.querySelectorAll('.menu-panel').forEach(function (panel) {
        panel.classList.toggle('active', panel.id === 'panel-' + target);
      });
    });
  });

  // Scroll reveal
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // Footer year
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  // Booking date: no same-day bookings, earliest selectable day is tomorrow
  var bookingDate = document.getElementById('bookingDate');
  var minBookingDate = null;
  if (bookingDate) {
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    minBookingDate = formatLocalDate(tomorrow);
    bookingDate.min = minBookingDate;
  }

  function formatLocalDate(d) {
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  // Booking form -> n8n webhook
  var bookingForm = document.getElementById('bookingForm');
  var bookingStatus = document.getElementById('bookingStatus');
  if (bookingForm && bookingStatus) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (bookingDate && bookingDate.value && minBookingDate && bookingDate.value < minBookingDate) {
        setStatus('error', 'We can\'t take same-day or back-dated bookings online — please choose a date from tomorrow onward, or call us at +855 12 847 747 for same-day requests.');
        bookingDate.focus();
        return;
      }

      if (!N8N_WEBHOOK_URL || N8N_WEBHOOK_URL.indexOf('REPLACE_WITH') === 0) {
        setStatus('error', 'Online booking isn\'t connected yet — please call or WhatsApp us at +855 12 847 747 to book.');
        return;
      }

      var submitBtn = bookingForm.querySelector('button[type="submit"]');
      var data = Object.fromEntries(new FormData(bookingForm).entries());
      data.source = 'goldenhands-website';
      data.submittedAt = new Date().toISOString();

      submitBtn.disabled = true;
      setStatus('pending', 'Sending your request…');

      fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed with status ' + res.status);
          setStatus('success', 'Thank you! Your booking request has been sent — we\'ll confirm by phone or WhatsApp shortly.');

          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: 'booking_request',
            booking_treatment: data.treatment,
            booking_guests: data.guests,
            booking_date: data.date,
            booking_time: data.time
          });

          bookingForm.reset();
        })
        .catch(function () {
          setStatus('error', 'Something went wrong sending your request. Please call or WhatsApp us at +855 12 847 747 to book directly.');
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  }

  function setStatus(kind, message) {
    bookingStatus.textContent = message;
    bookingStatus.className = 'form-status ' + kind;
  }
});
