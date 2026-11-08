/**
 * SITE CONFIG — edit this file.
 *
 * This is the only file you should normally touch when changing
 * copy, fonts, the service phrases behind the galleries, or the
 * contact details. Save the file and refresh the browser (Ctrl+R / Cmd+R).
 */
window.SITE = {
  /**
   * Body font for every word on the site.
   *   "courier"    — Courier New (default; shipped with the site, same on every device)
   *   "helvetica"  — Helvetica
   * Two places keep their own font regardless of this setting: the
   * service phrases in the text boxes (Century Gothic) and the contact
   * heading "Let's get in touch!" (Blackest Medium). See css/styles.css.
   */
  font: "courier",

  /**
   * When true, the small "contact" word on the home page scrolls
   * to the contact section.
   */
  enableContactShortcut: true,

  /**
   * Service phrases listed in the two text boxes on the third page
   * ("ways we can work together"). A dashed line is drawn between
   * each pair of phrases. One phrase at a time is highlighted on the
   * same beat as the slideshow (gallery.intervalMs / offsetMs).
   * Add, remove, or reword lines freely — plain text only.
   */
  services: {
    architecture: [
      "interior design",
      "exterior design",
      "visual design",
      "concept development",
      "exhibition design",
      "urbanistic plans",
    ],
    photography: [
      "studio shooting",
      "outdoor shooting",
      "special occasions",
      "creative set design",
      "fashion photography",
      "arch. photography",
    ],
  },

  /**
   * How the current phrase is marked on the third page.
   *   "bold"  — the current phrase is bold, the others regular (default)
   *   "dim"   — the current phrase is solid black, the others greyed out
   */
  servicesHighlight: "bold",

  /**
   * Contact page.
   *   heading — large bold line in the middle of the page
   *   image   — picture shown directly left of the heading (upload the
   *             file to this path; until it exists an empty outlined box shows)
   *   items   — three columns below the heading. Each has a bold label and one or more
   *             links underneath. Multiple links are shown on one line
   *             separated by " / ".
   * href values: use https://…, mailto:…, or tel:… (no spaces in tel:).
   */
  contact: {
    heading: "Let's get in touch!",
    image: "data/contact_image.jpeg",
    items: [
      {
        label: "email",
        links: [
          { text: "djokovicjelisaveta@gmail.com", href: "mailto:djokovicjelisaveta@gmail.com" },
        ],
      },
      {
        label: "instagram",
        links: [
          { text: "@jelisavvveta", href: "https://www.instagram.com/jelisavvveta" },
        ],
      },
      {
        label: "phone",
        links: [
          { text: "+381 69 2002910", href: "tel:+381692002910" },
          { text: "+39 351 9230425", href: "tel:+393519230425" },
        ],
      },
    ],
  },

  /**
   * Image slideshow. Filenames are always 01.jpg, 02.jpg, … inside
   * data/arch/ and data/photo/. Interval is how long each image stays
   * visible; offset is how much later the photography reel starts.
   * animate — false keeps the current hard cut. true crossfades each
   * change. Keep the fade shorter than intervalMs.
   */
  gallery: {
    intervalMs: 1500,
    offsetMs: 0,
    maxImages: 99,
    animate: false,
  },
};
