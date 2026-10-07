# tsLuxEvents Website

This project is a beginner-friendly booking website for a balloon decor and event styling business.
It uses only HTML, CSS, and vanilla JavaScript.

## Project Structure

```text
tsluxweb1/
├── index.html
├── styles.css
├── script.js
├── README.md
├── assets/
│   └── images/
├── pages/
│   ├── gallery.html
│   ├── services.html
│   ├── booking.html
│   └── contact.html
└── packages/
    ├── shimmer-wall.html
    ├── balloon-decor.html
    ├── mocktail-bar.html
    ├── dessert-table.html
    └── package pages
```

The root-level `booking.html`, `gallery.html`, and `services.html` files are redirect wrappers that keep older links working.

## How To Edit Content

1. Update text:
   Open the page you want to change and look for comments that say `EDIT HERE`.

2. Update pricing:
   Open the relevant package page inside the `packages/` folder and edit the package cards, pricing tables, or add-on lists.

3. Replace images:
   Add your real images to `assets/images/`, then update the `src` value in the matching HTML file.

4. Add a new service page:
   Duplicate one of the files inside `packages/`, rename it, update the content, then add a new card inside `pages/services.html`.

5. Update colors or overall design:
   Edit the CSS variables at the top of `styles.css`.

## Shared Pieces

- `styles.css` controls the design of every page.
- `script.js` injects the shared header and footer, runs the mobile menu, powers gallery filters, and validates the booking form.
