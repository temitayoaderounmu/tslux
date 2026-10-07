# tsLuxEvents Website Starter

This project is a beginner-friendly booking website for a balloon decor and event styling business.
It uses only HTML, CSS, and vanilla JavaScript so it is easy to edit without a framework.

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

## How To Deploy

### Option 1: GitHub Pages

1. Upload the whole project to a GitHub repository.
2. In the repo settings, open the Pages section.
3. Set the deploy source to the main branch and root folder.
4. Save and wait for GitHub to publish the site.

### Option 2: Netlify

1. Drag the full project folder into Netlify Drop.
2. Or connect your GitHub repository to Netlify.
3. Make sure the publish directory is the project root.

## Future Upgrades

- Connect the booking form to EmailJS for email notifications.
- Connect the form to Google Forms if you want submissions stored in a spreadsheet.
- Add a real backend later if you want admin dashboards, calendar logic, or payments.
