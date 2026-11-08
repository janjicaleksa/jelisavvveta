(function () {
  "use strict";

  var SITE = window.SITE || {};
  var BRAND = "jelisavvveta";

  var contactLabel = document.getElementById("contact-label");
  var brand = document.getElementById("brand");
  var labelArch = document.getElementById("label-arch");
  var labelPhoto = document.getElementById("label-photo");
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
        setTimeout(resolve, 500);
      }, doneAt);
    });
  }

  // Puts the overlay straight into its post-intro state (no blinking).
  function skipIntro() {
    splitBrand().forEach(function (letter) {
      letter.style.opacity = "1";
    });
    cursorMarkImg.classList.add("is-on", "is-instant");
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

  function layoutLabels(progress, servicesFade, contactFade, applyOpacity) {
    var t = smoothstep(progress);
    // Second stage: as the services page arrives the column words slide
    // from their gallery header position (12vh) to below the text boxes
    // (93vh); the crosshair stays in the page center.
    var s = smoothstep(servicesFade);
    // Third stage: as the contact page arrives the column words and the
    // crosshair travel back to the home arrangement at the bottom of the
    // page (words at 25% / 75%, crosshair between them), where the words
    // act as links back to the gallery.
    var c = smoothstep(contactFade);
    var homeLabelTop = 85;
    var homeBrandTop = 50;
    var servicesLabelTop = 93;
    var top = lerp(lerp(lerp(homeLabelTop, 12, t), servicesLabelTop, s), homeLabelTop, c);
    var size = lerp(lerp(1.2, 2.3, t), 1.2, c);
    var brandSize = lerp(4.25, 1.2, t);
    var brandTop = lerp(homeBrandTop, 7, t);
    var homeOpacity = 1 - t;
    var contactTop = 2 * homeBrandTop - homeLabelTop;

    labelArch.style.left = "25%";
    labelPhoto.style.left = "75%";
    labelArch.style.top = top + "vh";
    labelPhoto.style.top = top + "vh";
    labelArch.style.fontSize = "clamp(11px, " + size + "vw, 36px)";
    labelPhoto.style.fontSize = "clamp(11px, " + size + "vw, 36px)";
    brand.style.left = "50%";
    brand.style.top = brandTop + "vh";
    brand.style.transform = "translate(-50%, -50%)";
    brand.style.fontSize = "clamp(11px, " + brandSize + "vw, 66px)";
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
    }
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

  function loadUntilMissing(folder, max) {
    return new Promise(function (resolve) {
      var found = [];
      var index = 1;

      function padded(n) {
        return n < 10 ? "0" + n : String(n);
      }

      function next() {
        if (index > max) {
          resolve(found);
          return;
        }
        var src = folder + "/" + padded(index) + ".jpg";
        var probe = new Image();
        probe.onload = function () {
          found.push(src);
          index += 1;
          next();
        };
        probe.onerror = function () {
          resolve(found);
        };
        probe.src = src;
      }

      next();
    });
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

  function fillGallery(el, cta, sources, pdfPath) {
    el.querySelectorAll("img").forEach(function (old) {
      old.remove();
    });
    sources.forEach(function (src) {
      var img = document.createElement("img");
      img.src = src;
      img.alt = "";
      el.appendChild(img);
    });
    if (pdfPath) {
      if (sources.length) {
        el.classList.add("is-clickable");
        el.addEventListener("click", function () {
          openPdf(pdfPath);
        });
      }
      bindCta(cta, pdfPath);
    }
  }

  // Steps a class through a list of elements on a fixed beat.
  function cycleClass(items, className, startDelay, interval) {
    if (!items.length) {
      return;
    }
    var current = 0;

    function start() {
      items[0].classList.add(className);
      if (items.length < 2) {
        return;
      }
      setInterval(function () {
        items[current].classList.remove(className);
        current = (current + 1) % items.length;
        items[current].classList.add(className);
      }, interval);
    }

    if (startDelay > 0) {
      setTimeout(start, startDelay);
    } else {
      start();
    }
  }

  function cycleGallery(el, startDelay, interval) {
    cycleClass(el.querySelectorAll("img"), "is-active", startDelay, interval);
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

    Promise.all([
      loadUntilMissing("data/arch", max),
      loadUntilMissing("data/photo", max),
    ]).then(function (results) {
      fillGallery(galleryArch, ctaArch, results[0], PDF_ARCH);
      fillGallery(galleryPhoto, ctaPhoto, results[1], PDF_PHOTO);

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting || started) {
              return;
            }
            started = true;
            cycleGallery(galleryArch, 0, interval);
            cycleGallery(galleryPhoto, offset, interval);
            observer.disconnect();
          });
        },
        { threshold: 0.35 }
      );

      observer.observe(gallerySection);
    });
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
    setupGalleries();
    setupServices();
  }

  applyConfig();
  bindHomeLinks();
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
