(function () {
  "use strict";

  var SITE = window.SITE || {};
  var BRAND = "jelisavvveta";

  var contactLabel = document.getElementById("contact-label");
  var brand = document.getElementById("brand");
  var labelArch = document.getElementById("label-arch");
  var labelPhoto = document.getElementById("label-photo");
  var taglineAbove = document.getElementById("tagline-above");
  var taglineBelow = document.getElementById("tagline-below");
  var taglinesShown = false;
  var TAGLINE_FADE_MS = 1500;
  var cursorMark = document.getElementById("cursor-mark");
  var cursorMarkImg = cursorMark.querySelector("img");
  var contactLinks = document.getElementById("contact-links");
  var contactHeading = document.getElementById("contact-heading");
  var contactPhoto = document.getElementById("contact-photo");
  var contactInner = document.querySelector(".contact-inner");
  var galleryArch = document.getElementById("gallery-arch");
  var galleryPhoto = document.getElementById("gallery-photo");
  var gallerySection = document.getElementById("gallery");
  var galleryColumns = gallerySection.querySelector(".columns");
  var ctaArch = document.getElementById("cta-arch");
  var ctaPhoto = document.getElementById("cta-photo");
  var servicesSection = document.getElementById("services");
  var servicesInner = servicesSection.querySelector(".services-inner");
  var servicesArch = document.getElementById("services-arch");
  var servicesPhoto = document.getElementById("services-photo");
  var contactSection = document.getElementById("contact");

  var PDF_ARCH = "data/portf/arch_JelisavetaDjokovic_portfolio.pdf";
  var PDF_PHOTO = "data/portf/ph_JelisavetaDjokovic_portfolio.pdf";

  // Where the visitor was before a refresh. We restore this ourselves
  // (instead of letting the browser do it) so that the intro only plays
  // when the page comes back on the home screen.
  var SCROLL_KEY = "jelisavvveta:scrollY";

  var introDone = false;

  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function smoothstep(t) {
    return t * t * (3 - 2 * t);
  }

  function shuffle(items) {
    var copy = items.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function fillServices() {
    var services = SITE.services || {};
    document.querySelectorAll(".services-list").forEach(function (list) {
      var key = list.getAttribute("data-services");
      list.innerHTML = "";
      (services[key] || []).forEach(function (phrase, index) {
        if (index > 0) {
          var sep = document.createElement("li");
          sep.className = "sep";
          sep.setAttribute("aria-hidden", "true");
          list.appendChild(sep);
        }
        var li = document.createElement("li");
        li.className = "phrase";
        li.textContent = phrase;
        list.appendChild(li);
      });
    });
  }

  function makeLink(link) {
    var a = document.createElement("a");
    a.href = link.href || "#";
    a.textContent = link.text || link.href || "";
    if (/^https?:/i.test(link.href || "")) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    return a;
  }

  function fillContact() {
    var contact = SITE.contact || {};

    contactHeading.textContent = contact.heading || "";

    contactLinks.innerHTML = "";
    (contact.items || []).forEach(function (item) {
      var wrap = document.createElement("div");
      wrap.className = "contact-item";

      var term = document.createElement("strong");
      term.className = "contact-term";
      term.textContent = item.label || "";
      wrap.appendChild(term);

      var value = document.createElement("span");
      value.className = "contact-value";
      (item.links || []).forEach(function (link, index) {
        if (index > 0) {
          value.appendChild(document.createTextNode(" / "));
        }
        value.appendChild(makeLink(link));
      });
      wrap.appendChild(value);

      contactLinks.appendChild(wrap);
    });

    var img = contactPhoto.querySelector("img");
    contactPhoto.classList.add("is-empty");
    if (contact.image) {
      img.addEventListener("load", function () {
        contactPhoto.classList.remove("is-empty");
      });
      img.addEventListener("error", function () {
        contactPhoto.classList.add("is-empty");
      });
      img.src = contact.image;
    }
  }

  function applyConfig() {
    var font = SITE.font === "helvetica" ? "helvetica" : "courier";
    document.documentElement.setAttribute("data-font", font);

    var highlight = SITE.servicesHighlight === "dim" ? "dim" : "bold";
    document.documentElement.setAttribute("data-highlight", highlight);

    fillServices();
    fillContact();

    if (SITE.enableContactShortcut) {
      contactLabel.classList.add("is-link");
      contactLabel.href = "#contact";
    } else {
      contactLabel.classList.remove("is-link");
      contactLabel.removeAttribute("href");
      contactLabel.setAttribute("role", "text");
    }
  }

  function splitBrand() {
    brand.textContent = "";
    BRAND.split("").forEach(function (ch) {
      var span = document.createElement("span");
      span.className = "letter";
      span.textContent = ch;
      brand.appendChild(span);
    });
    return Array.prototype.slice.call(brand.querySelectorAll(".letter"));
  }

  function runIntro() {
    var letters = splitBrand();
    var order = shuffle(letters.map(function (_letter, index) {
      return index;
    }));

    contactLabel.style.opacity = "0";
    if (contactLabel.classList.contains("is-link")) {
      contactLabel.style.pointerEvents = "none";
    }
    labelArch.style.opacity = "0";
    labelPhoto.style.opacity = "0";
    cursorMark.style.opacity = "0";
    taglinesShown = false;
    taglineAbove.style.transition = "none";
    taglineBelow.style.transition = "none";
    taglineAbove.style.opacity = "0";
    taglineBelow.style.opacity = "0";

    var delay = 70;
    order.forEach(function (index) {
      delay += 55 + Math.floor(Math.random() * 85);
      setTimeout(function () {
        letters[index].classList.add("blink-in");
      }, delay);
    });

    var doneAt = delay + 450;
    return new Promise(function (resolve) {
      setTimeout(function () {
        contactLabel.style.transition = "opacity 1.5s ease";
        labelArch.style.transition = "opacity 1.5s ease";
        labelPhoto.style.transition = "opacity 1.5s ease";
        contactLabel.style.opacity = "1";
        labelArch.style.opacity = "1";
        labelPhoto.style.opacity = "1";
        cursorMark.style.opacity = "1";
        cursorMarkImg.classList.add("is-on");
        fadeInTaglines();
        setTimeout(resolve, 500);
      }, doneAt);
    });
  }

  // After the letter blink, the two lines around the name fade in together.
  function fadeInTaglines() {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      taglinesShown = true;
      taglineAbove.style.opacity = "1";
      taglineBelow.style.opacity = "1";
      taglineAbove.setAttribute("aria-hidden", "false");
      taglineBelow.setAttribute("aria-hidden", "false");
      return;
    }

    taglineAbove.style.transition = "opacity " + TAGLINE_FADE_MS + "ms ease";
    taglineBelow.style.transition = "opacity " + TAGLINE_FADE_MS + "ms ease";
    void taglineAbove.offsetWidth;
    taglineAbove.style.opacity = "1";
    taglineBelow.style.opacity = "1";
    taglineAbove.setAttribute("aria-hidden", "false");
    taglineBelow.setAttribute("aria-hidden", "false");

    setTimeout(function () {
      if (!taglinesShown) {
        taglineAbove.style.transition = "none";
        taglineBelow.style.transition = "none";
        taglinesShown = true;
      }
      if (introDone) {
        onScroll();
      }
    }, TAGLINE_FADE_MS);
  }

  // Puts the overlay straight into its post-intro state (no blinking).
  function skipIntro() {
    splitBrand().forEach(function (letter) {
      letter.style.opacity = "1";
    });
    cursorMarkImg.classList.add("is-on", "is-instant");
    taglinesShown = true;
  }

  function savedScroll() {
    try {
      var value = parseFloat(window.sessionStorage.getItem(SCROLL_KEY));
      return isNaN(value) ? 0 : Math.max(0, value);
    } catch (err) {
      return 0;
    }
  }

  function rememberScroll() {
    try {
      window.sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
    } catch (err) {
      /* storage unavailable: the page simply reloads on the home screen */
    }
  }

  // A hash such as #contact wins over the remembered position.
  function hashTarget() {
    var hash = window.location.hash;
    if (!hash || hash.length < 2) {
      return null;
    }
    var el = document.getElementById(hash.slice(1));
    return el ? el.offsetTop : null;
  }

  // Jumps without the smooth scrolling that the stylesheet enables.
  function jumpTo(top) {
    var root = document.documentElement;
    var previous = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    // Force the style change to apply before scrolling.
    void root.offsetHeight;
    try {
      window.scrollTo({ top: top, left: 0, behavior: "instant" });
    } catch (err) {
      window.scrollTo(0, top);
    }
    root.style.scrollBehavior = previous;
  }

  function setShortcut(el, enabled) {
    var on = !!enabled;
    if (el.classList.contains("is-link") === on) {
      return;
    }
    el.classList.toggle("is-link", on);
    if (on) {
      el.setAttribute("role", "link");
      el.tabIndex = 0;
    } else {
      el.removeAttribute("role");
      el.removeAttribute("tabindex");
    }
  }

  function setBrandShortcut(enabled) {
    setShortcut(brand, enabled);
  }

  function setColumnShortcuts(enabled) {
    setShortcut(labelArch, enabled);
    setShortcut(labelPhoto, enabled);
  }

  function clampFontPx(minRem, vw, maxRem) {
    var root = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    return clamp(minRem * root, (vw / 100) * window.innerWidth, maxRem * root);
  }

  // Same size as "click above for the portfolio" under the frames.
  function portfolioCaptionPx() {
    var text = ctaArch.querySelector(".cta-text");
    var size = text ? parseFloat(getComputedStyle(text).fontSize) : 0;
    return size > 0 ? size : clampFontPx(0.5, 1, 0.875);
  }

  // Distance from a frame edge to the caption, so the column words can
  // sit just as close on the other side of the box.
  function frameGapPx() {
    var gap = parseFloat(getComputedStyle(ctaArch).marginTop);
    return gap > 0 ? gap : window.innerHeight * 0.015;
  }

  function layoutLabels(progress, servicesFade, contactFade, applyOpacity) {
    var t = smoothstep(progress);
    // Second stage: as the services page arrives the column words slide
    // from just above the gallery frames to just under the text boxes.
    // The crosshair stays in the page center.
    var s = smoothstep(servicesFade);
    // Third stage: as the contact page arrives the column words and the
    // crosshair travel back to the home arrangement at the bottom of the
    // page (words at 25% / 75%, crosshair between them), where the words
    // act as links back to the gallery.
    var c = smoothstep(contactFade);
    var homeLabelTop = 85;
    var homeBrandTop = 50;
    var homeLabelPx = clampFontPx(0.6875, 1.2, 2.25);
    var captionPx = portfolioCaptionPx();
    var gapPx = frameGapPx();
    var imageTop = galleryArch.getBoundingClientRect().top - gallerySection.getBoundingClientRect().top;
    var boxBottom = servicesArch.getBoundingClientRect().bottom - servicesSection.getBoundingClientRect().top;
    var galleryLabelTop = ((imageTop - gapPx - captionPx / 2) / window.innerHeight) * 100;
    // Always under the text box: the top of the word clears the frame.
    var servicesLabelTop = ((boxBottom + gapPx + captionPx / 2) / window.innerHeight) * 100;
    var top = lerp(lerp(lerp(homeLabelTop, galleryLabelTop, t), servicesLabelTop, s), homeLabelTop, c);
    // Same small size as the gallery and services pages once the home
    // page is left behind, including the contact-page links.
    var sizePx = lerp(homeLabelPx, captionPx, t);
    var brandSize = lerp(4.25, 1.2, t);
    var brandTop = lerp(homeBrandTop, 7, t);
    var homeOpacity = 1 - t;
    var contactTop = 2 * homeBrandTop - homeLabelTop;

    labelArch.style.left = "25%";
    labelPhoto.style.left = "75%";
    labelArch.style.top = top + "vh";
    labelPhoto.style.top = top + "vh";
    labelArch.style.fontSize = sizePx + "px";
    labelPhoto.style.fontSize = sizePx + "px";
    brand.style.left = "50%";
    brand.style.top = brandTop + "vh";
    brand.style.transform = "translate(-50%, -50%)";
    brand.style.fontSize = "clamp(0.6875rem, " + brandSize + "vw, 4.125rem)";
    // Black on the home page, red once it sits at the top of the gallery.
    brand.style.setProperty("--brand-mix", t.toFixed(3));
    contactLabel.style.left = "50%";
    contactLabel.style.top = contactTop + "vh";
    contactLabel.style.transform = "translate(-50%, -50%)";

    // Crosshair: between the two column words on home, page center in
    // the gallery, back between the words at the bottom of the contact
    // page. Half a turn of rotation across each leg of the trip.
    var markTop = lerp(lerp(homeLabelTop, 50, t), homeLabelTop, c);
    cursorMark.style.left = "50%";
    cursorMark.style.top = markTop + "vh";
    cursorMark.style.transform =
      "translate(-50%, -50%) rotate(" + ((t + c) * 180).toFixed(2) + "deg)";

    if (applyOpacity) {
      labelArch.style.opacity = "1";
      labelPhoto.style.opacity = "1";
      cursorMark.style.opacity = "1";
      brand.style.opacity = "1";
      contactLabel.style.opacity = String(homeOpacity);
      if (contactLabel.classList.contains("is-link")) {
        contactLabel.style.pointerEvents = homeOpacity > 0.35 ? "auto" : "none";
      }
      syncTaglineOpacity(homeOpacity);
    }
  }

  // Home-only. They fade in once after the letter intro, then track the
  // same opacity as "contact" so they are gone on the later pages.
  function syncTaglineOpacity(homeOpacity) {
    if (!taglinesShown) {
      if (homeOpacity >= 0.98) {
        return;
      }
      taglineAbove.style.transition = "none";
      taglineBelow.style.transition = "none";
      taglinesShown = true;
    }
    var value = String(homeOpacity);
    taglineAbove.style.opacity = value;
    taglineBelow.style.opacity = value;
    var hidden = homeOpacity < 0.05 ? "true" : "false";
    taglineAbove.setAttribute("aria-hidden", hidden);
    taglineBelow.setAttribute("aria-hidden", hidden);
  }

  function sectionFade(el) {
    var rect = el.getBoundingClientRect();
    var h = window.innerHeight;
    var visible = Math.min(rect.bottom, h) - Math.max(rect.top, 0);
    return clamp(visible / (h * 0.7), 0, 1);
  }

  // 0 while the section's top edge is still below 55% of the viewport,
  // 1 once it has reached 10%; drives the label/crosshair travel.
  function arrivalFade(el) {
    var rect = el.getBoundingClientRect();
    var h = window.innerHeight;
    return clamp((h * 0.55 - rect.top) / (h * 0.45), 0, 1);
  }

  function onScroll() {
    if (!introDone) {
      layoutLabels(0, 0, 0, false);
      setBrandShortcut(false);
      setColumnShortcuts(false);
      return;
    }

    var morphRange = Math.max(gallerySection.offsetTop, 1);
    var progress = clamp(window.scrollY / morphRange, 0, 1);

    var servicesFade = arrivalFade(servicesSection);
    var contactFade = arrivalFade(contactSection);

    layoutLabels(progress, servicesFade, contactFade, true);
    setBrandShortcut(progress >= 0.98);
    setColumnShortcuts(contactFade >= 0.98);

    galleryColumns.style.opacity = String(sectionFade(gallerySection));
    servicesInner.style.opacity = String(sectionFade(servicesSection));
    var contactVisible = sectionFade(contactSection);
    contactInner.style.opacity = String(contactVisible);

    // Picture wipes in once the contact page is nearly in full view and
    // resets only after it has mostly left, so it replays on each visit
    // without flickering around the threshold.
    if (contactVisible >= 0.9) {
      contactPhoto.classList.add("is-revealed");
    } else if (contactVisible <= 0.15) {
      contactPhoto.classList.remove("is-revealed");
    }
  }

  // Discovers 01.jpg, 02.jpg, … in a folder and hands each loaded image
  // element to onImage in order, as soon as it has arrived. The first
  // file is fetched on its own so it gets the whole connection; after
  // that a few requests run side by side. Discovery stops at the first
  // missing number (or at max).
  function loadImages(folder, max, onImage) {
    var PARALLEL = 3;
    var loaded = {};
    var nextToRequest = 1;
    var nextToEmit = 1;
    var stopAt = Infinity;
    var inFlight = 0;

    function padded(n) {
      return n < 10 ? "0" + n : String(n);
    }

    function emit() {
      while (nextToEmit < stopAt && loaded[nextToEmit]) {
        var img = loaded[nextToEmit];
        delete loaded[nextToEmit];
        nextToEmit += 1;
        onImage(img);
      }
    }

    function probe(index) {
      var img = new Image();
      img.alt = "";
      img.decoding = "async";
      inFlight += 1;
      img.onload = function () {
        inFlight -= 1;
        loaded[index] = img;
        emit();
        request();
      };
      img.onerror = function () {
        inFlight -= 1;
        stopAt = Math.min(stopAt, index);
      };
      img.src = folder + "/" + padded(index) + ".jpg";
    }

    function request() {
      var limit = nextToEmit > 1 ? PARALLEL : 1;
      while (inFlight < limit && nextToRequest <= max && nextToRequest < stopAt) {
        probe(nextToRequest);
        nextToRequest += 1;
      }
    }

    request();
  }

  function openPdf(pdfPath) {
    window.open(pdfPath, "_blank", "noopener,noreferrer");
  }

  function bindCta(cta, pdfPath) {
    cta.addEventListener("click", function (event) {
      event.preventDefault();
      openPdf(pdfPath);
    });
    cta.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPdf(pdfPath);
      }
    });
  }

  // Steps a class through a list of elements on a fixed beat. `items` may
  // be a live collection that grows while the beat is running. Returns a
  // function to call when new items arrive: if the beat is already
  // running but had nothing to show yet, it shows the first item at once.
  function cycleClass(items, className, startDelay, interval) {
    var current = -1;
    var running = false;

    function step() {
      if (!items.length) {
        return;
      }
      if (current >= 0 && items[current]) {
        items[current].classList.remove(className);
      }
      current = (current + 1) % items.length;
      items[current].classList.add(className);
    }

    function start() {
      running = true;
      step();
      setInterval(step, interval);
    }

    if (startDelay > 0) {
      setTimeout(start, startDelay);
    } else {
      start();
    }

    return function () {
      if (running && current < 0) {
        step();
      }
    };
  }

  function cyclePhrases(list, startDelay, interval) {
    cycleClass(list.querySelectorAll("li.phrase"), "is-current", startDelay, interval);
  }

  function setupServices() {
    var gallery = SITE.gallery || {};
    var interval = gallery.intervalMs || 1000;
    var offset = gallery.offsetMs || 0;
    var started = false;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || started) {
            return;
          }
          started = true;
          cyclePhrases(servicesArch, 0, interval);
          cyclePhrases(servicesPhoto, offset, interval);
          observer.disconnect();
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(servicesSection);
  }

  // Called as soon as the script runs, so the image downloads overlap the
  // intro instead of starting after it. Each picture is dropped into its
  // frame the moment it has loaded; the reels start when the gallery
  // scrolls into view and pick up pictures that are still arriving.
  function setupGalleries() {
    var gallery = SITE.gallery || {};
    var interval = gallery.intervalMs || 1000;
    var offset = gallery.offsetMs || 0;
    var max = gallery.maxImages || 99;
    var started = false;

    if (gallery.animate) {
      galleryArch.classList.add("is-animated");
      galleryPhoto.classList.add("is-animated");
    }

    var reels = [
      { el: galleryArch, cta: ctaArch, folder: "data/arch", pdf: PDF_ARCH, delay: 0 },
      { el: galleryPhoto, cta: ctaPhoto, folder: "data/photo", pdf: PDF_PHOTO, delay: offset },
    ];

    reels.forEach(function (reel) {
      reel.refresh = null;
      bindCta(reel.cta, reel.pdf);
      reel.el.querySelectorAll("img").forEach(function (old) {
        old.remove();
      });
      loadImages(reel.folder, max, function (img) {
        if (!reel.el.classList.contains("is-clickable")) {
          reel.el.classList.add("is-clickable");
          reel.el.addEventListener("click", function () {
            openPdf(reel.pdf);
          });
        }
        reel.el.appendChild(img);
        if (reel.refresh) {
          reel.refresh();
        }
      });
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || started) {
            return;
          }
          started = true;
          reels.forEach(function (reel) {
            reel.refresh = cycleClass(
              reel.el.getElementsByTagName("img"),
              "is-active",
              reel.delay,
              interval
            );
          });
          observer.disconnect();
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(gallerySection);
  }

  function bindHomeLinks() {
    contactLabel.addEventListener("click", function (event) {
      if (!contactLabel.classList.contains("is-link")) {
        return;
      }
      event.preventDefault();
      if (!introDone) {
        return;
      }
      contactSection.scrollIntoView({ behavior: "smooth" });
    });

    brand.addEventListener("click", function () {
      if (!brand.classList.contains("is-link")) {
        return;
      }
      gallerySection.scrollIntoView({ behavior: "smooth" });
    });

    brand.addEventListener("keydown", function (event) {
      if (!brand.classList.contains("is-link")) {
        return;
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        gallerySection.scrollIntoView({ behavior: "smooth" });
      }
    });

    // On the contact page the two column words lead back to the gallery.
    [labelArch, labelPhoto].forEach(function (label) {
      label.addEventListener("click", function () {
        if (!label.classList.contains("is-link")) {
          return;
        }
        gallerySection.scrollIntoView({ behavior: "smooth" });
      });

      label.addEventListener("keydown", function (event) {
        if (!label.classList.contains("is-link")) {
          return;
        }
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          gallerySection.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }

  function bindScroll() {
    var ticking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (ticking) {
          return;
        }
        ticking = true;
        requestAnimationFrame(function () {
          onScroll();
          ticking = false;
        });
      },
      { passive: true }
    );
    window.addEventListener("resize", onScroll);
  }

  function finishIntro(scrollTop) {
    introDone = true;
    contactLabel.style.transition = "none";
    labelArch.style.transition = "none";
    labelPhoto.style.transition = "none";
    cursorMark.style.transition = "none";
    brand.style.transition = "opacity 0.2s linear";
    document.body.classList.remove("intro-lock");
    if (scrollTop > 0) {
      jumpTo(scrollTop);
    }
    bindScroll();
    onScroll();
    setupServices();
  }

  applyConfig();
  bindHomeLinks();
  setupGalleries();
  layoutLabels(0, 0, 0, false);
  setBrandShortcut(false);

  window.addEventListener("pagehide", rememberScroll);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
      rememberScroll();
    }
  });

  var hashTop = hashTarget();
  var startTop = hashTop !== null ? hashTop : savedScroll();
  jumpTo(0);

  // The intro belongs to the home screen only. Coming back anywhere past
  // the first page (a refresh on the gallery, services or contact page, or
  // a #section link) shows the finished layout right away at that spot.
  if (startTop >= window.innerHeight * 0.5) {
    skipIntro();
    finishIntro(startTop);
  } else {
    runIntro().then(function () {
      finishIntro(0);
    });
  }
})();
