/*
  FILE: script.js
  PURPOSE:
  - Builds the shared navigation and footer.
  - Powers the gallery filters.
  - Handles the shimmer wall mini calculator.
  - Handles the booking page pricing system with tiered services.
  - Sends booking requests through EmailJS.

  BEGINNER GUIDE:
  1. All pricing data lives inside PRICING_DATA below.
  2. To change a service price, edit that service's packageOptions.
  3. To add a new add-on, add an object to that service's addons array.
  4. To add a new service to the estimator:
     - Add it in PRICING_DATA.services
     - Make sure it has packageOptions and a defaultPackageId
  5. EmailJS setup instructions live inside EMAILJS_CONFIG comments.
*/

const STORAGE_KEY = "tsluxevents-booking-selection";

/*
  EMAILJS CONFIGURATION
  --------------------------------------------------
  HOW TO CONNECT EMAILJS:
  1. Create an EmailJS account
  2. Connect an email service that sends to tsluxevent@gmail.com
  3. Create a template inside EmailJS
  4. Replace the placeholder values below
  5. Change enabled to true after your credentials are ready

  RECOMMENDED TEMPLATE PARAMS:
  - {{to_email}}
  - {{from_name}}
  - {{reply_to}}
  - {{phone}}
  - {{event_date}}
  - {{location}}
  - {{main_package}}
  - {{addons}}
  - {{extra_services}}
  - {{total_estimate}}
  - {{notes}}
*/
const EMAILJS_CONFIG = {
  enabled: true,
  publicKey: "RpJrQQSRGuQwMwXaf",
  serviceId: "service_j3t2ayh",
  templateId: "template_xjf4utn",
};

const SHARED_BALLOON_ADDONS = [
  { id: "premiumFinish", label: "Premium balloon finish", description: "Upgrade with chrome, metallic, or specialty balloons.", price: 45 },
  { id: "additionalGarland", label: "Additional garland", description: "Add another balloon garland for a fuller install.", price: 65 },
  { id: "floralInserts", label: "Floral inserts", description: "Add silk florals to soften and elevate the design.", price: 55 },
  { id: "customNeonName", label: "Custom neon name", description: "Add personalized event lettering to the install.", price: 60 },
  { id: "personalizedSign", label: "Personalized sign", description: "Include a custom sign with names, numbers, or a message.", price: 50 },
  { id: "foilBalloons", label: "Foil balloons", description: "Add themed foil balloons for an extra celebration touch.", price: 35 },
  { id: "deliverySetup", label: "Delivery and setup", description: "Include delivery and on-site setup support.", price: 75 },
];

/*
  PRICING DATA
  --------------------------------------------------
  This is the main pricing source for the interactive estimator.
  Every tier and add-on price comes from here.
*/
const PRICING_DATA = {
  services: {
    shimmerWall: {
      id: "shimmerWall",
      bookingLabel: "Shimmer Wall Package",
      tagline: "Backdrop styling with balloons and focal-wall impact",
      comboTagline: "Add a shimmer backdrop focal point",
      defaultPackageId: "signature",
      packageOptions: [
        {
          id: "essential",
          name: "Essential Shimmer",
          description: "8 x 8 ft shimmer wall with one organic garland",
          price: 375,
        },
        {
          id: "signature",
          name: "Signature Shimmer",
          description: "10 x 8 ft shimmer wall with fuller balloon coverage",
          price: 525,
        },
        {
          id: "statement",
          name: "Statement Shimmer",
          description: "12 x 8 ft shimmer wall for larger focal styling",
          price: 695,
        },
      ],
      addons: SHARED_BALLOON_ADDONS,
    },
    balloonDecor: {
      id: "balloonDecor",
      bookingLabel: "Balloon Decor Packages",
      tagline: "Organic balloon installs for parties, halls, and photo zones",
      comboTagline: "Add supporting balloon decor",
      defaultPackageId: "signature",
      packageOptions: [
        {
          id: "petite",
          name: "Petite Balloon Styling",
          description: "A smaller install for party corners, cake areas, or home events",
          price: 225,
        },
        {
          id: "signature",
          name: "Signature Balloon Styling",
          description: "A fuller install for focal walls and photo-ready setups",
          price: 365,
        },
        {
          id: "statement",
          name: "Statement Balloon Styling",
          description: "A larger install for wider spaces and stronger visual impact",
          price: 525,
        },
      ],
      addons: SHARED_BALLOON_ADDONS,
    },
    mocktailBar: {
      id: "mocktailBar",
      bookingLabel: "Mocktail Bar Service",
      tagline: "Styled beverage presentation for a polished guest feature",
      comboTagline: "Add a styled mocktail station",
      defaultPackageId: "signature",
      packageOptions: [
        {
          id: "mini",
          name: "Mini Mocktail Styling",
          description: "A simple styled station for smaller guest counts",
          price: 175,
        },
        {
          id: "signature",
          name: "Signature Mocktail Styling",
          description: "A fuller display with stronger styling presence",
          price: 245,
        },
        {
          id: "elevated",
          name: "Elevated Mocktail Styling",
          description: "A more layered presentation for larger or more luxe events",
          price: 335,
        },
      ],
      addons: [
        { id: "garnishStation", label: "Garnish station", description: "Styled garnishes for a more elevated guest experience.", price: 35 },
        { id: "barSignage", label: "Bar signage", description: "Custom signage for the beverage station.", price: 30 },
        { id: "glassUpgrade", label: "Cup upgrade", description: "Upgrade the serving presentation with a cleaner finish.", price: 40 },
      ],
    },
    dessertTable: {
      id: "dessertTable",
      bookingLabel: "Dessert Table Styling",
      tagline: "Layered dessert presentation with polished table styling",
      comboTagline: "Add dessert table styling",
      defaultPackageId: "signature",
      packageOptions: [
        {
          id: "petite",
          name: "Petite Dessert Styling",
          description: "A smaller styled dessert setup for intimate events",
          price: 145,
        },
        {
          id: "signature",
          name: "Signature Dessert Styling",
          description: "A balanced dessert table with more display depth",
          price: 215,
        },
        {
          id: "luxe",
          name: "Luxe Dessert Styling",
          description: "A fuller dessert presentation for stronger event impact",
          price: 305,
        },
      ],
      addons: [
        { id: "standSet", label: "Dessert stand set", description: "Add more levels and height to the display.", price: 40 },
        { id: "tableSignage", label: "Table signage", description: "Custom event signage for the dessert setup.", price: 30 },
        { id: "accentDecor", label: "Accent decor", description: "Add coordinating decor pieces to support the table styling.", price: 45 },
      ],
    },
  },
};

document.addEventListener("DOMContentLoaded", () => {
  document.body.dataset.base = document.body.dataset.base || "";
  injectSkipLink();
  buildHeader();
  buildFooter();
  setupMobileNavigation();
  setupGalleryFilters();
  setupShimmerCalculator();
  setupBookingPage();
  setupEstimateBar();
  setupLightbox();
  initialiseEmailJs();
});

function buildHeader() {
  const target = document.getElementById("site-header");
  if (!target) return;

  const currentPage = document.body.dataset.page || "";
  const base = document.body.dataset.base || "";
  const links = {
    home: `${base}index.html`,
    gallery: `${base}pages/gallery.html`,
    services: `${base}pages/services.html`,
    booking: `${base}pages/booking.html`,
    contact: `${base}pages/contact.html`,
  };

  target.innerHTML = `
    <header class="site-header">
      <div class="site-header__inner">
        <a class="brand" href="${links.home}" aria-label="tsLuxEvents home">
          <strong>tsLuxEvents</strong>
          <span>Balloon Decor & Event Styling</span>
        </a>

        <button class="nav-toggle" id="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Open navigation menu">
          ☰
        </button>

        <nav class="site-nav" id="site-nav" aria-label="Main navigation">
          <a class="${currentPage === "home" ? "is-active" : ""}" ${currentPage === "home" ? 'aria-current="page"' : ""} href="${links.home}">Home</a>
          <a class="${currentPage === "gallery" ? "is-active" : ""}" ${currentPage === "gallery" ? 'aria-current="page"' : ""} href="${links.gallery}">Gallery</a>
          <a class="${currentPage === "services" || currentPage === "shimmer" ? "is-active" : ""}" ${currentPage === "services" || currentPage === "shimmer" ? 'aria-current="page"' : ""} href="${links.services}">Services</a>
          <a class="${currentPage === "booking" ? "is-active" : ""}" ${currentPage === "booking" ? 'aria-current="page"' : ""} href="${links.booking}">Book Now</a>
          <a class="${currentPage === "contact" ? "is-active" : ""}" ${currentPage === "contact" ? 'aria-current="page"' : ""} href="${links.contact}">Contact</a>
        </nav>
      </div>
    </header>
  `;
}

function buildFooter() {
  const target = document.getElementById("site-footer");
  if (!target) return;

  const base = document.body.dataset.base || "";

  target.innerHTML = `
    <footer class="site-footer">
      <div class="footer-panel">
        <div class="footer-grid">
          <div>
            <h3>tsLuxEvents</h3>
            <p>
              Luxe balloon decor, shimmer wall styling, mocktail service presentation,
              and dessert table styling for memorable celebrations.
            </p>
          </div>

          <div class="footer-links">
            <h3>Explore</h3>
            <a href="${base}index.html">Home</a>
            <a href="${base}pages/gallery.html">Gallery</a>
            <a href="${base}pages/services.html">Services</a>
            <a href="${base}pages/booking.html">Book Now</a>
            <a href="${base}pages/contact.html">Contact</a>
          </div>

          <div class="footer-contact">
            <h3>Connect</h3>
            <a href="mailto:tsluxevent@gmail.com">tsluxevent@gmail.com</a>
            <a href="https://www.instagram.com/tsluxe.events" target="_blank" rel="noreferrer">@tsluxe.events</a>
            <a href="https://www.tiktok.com/@tsluxe8" target="_blank" rel="noreferrer">@tsluxe8</a>
          </div>
        </div>

        <div class="footer-meta">
          <span>Styled for birthdays, graduations, showers, and intimate events.</span>
          <span>&copy; <span id="footer-year"></span> tsLuxEvents</span>
        </div>
      </div>
    </footer>
  `;

  const yearTarget = document.getElementById("footer-year");
  if (yearTarget) {
    yearTarget.textContent = new Date().getFullYear();
  }
}

function setupMobileNavigation() {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  const setOpen = (isOpen) => {
    nav.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );
  };

  toggle.addEventListener("click", () => {
    setOpen(!nav.classList.contains("is-open"));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setOpen(false);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setOpen(false);
    }
  });
}

function setupGalleryFilters() {
  const buttons = document.querySelectorAll("[data-filter-btn]");
  const cards = document.querySelectorAll("[data-gallery-card]");
  if (!buttons.length || !cards.length) return;

  const setPressedState = (activeButton) => {
    buttons.forEach((item) => {
      item.setAttribute("aria-pressed", String(item === activeButton));
    });
  };

  setPressedState(document.querySelector("[data-filter-btn].is-active"));

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filterBtn;

      buttons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      setPressedState(button);

      cards.forEach((card) => {
        const categories = (card.dataset.category || "").split(" ");
        const isMatch = selectedFilter === "all" || categories.includes(selectedFilter);
        card.hidden = !isMatch;
      });
    });
  });
}

function setupShimmerCalculator() {
  const page = document.querySelector("[data-shimmer-calculator]");
  if (!page) return;

  const base = document.body.dataset.base || "";
  const service = getService("shimmerWall");
  const tierContainer = document.getElementById("shimmer-tier-options");
  const addonContainer = document.getElementById("shimmer-addon-options");
  const breakdown = document.getElementById("shimmer-estimate-breakdown");
  const totalTarget = document.getElementById("shimmer-estimate-total");
  const addButton = document.getElementById("add-shimmer-to-booking");
  const saved = normaliseStoredSelection(readStoredSelection());
  const savedMainServiceId = saved?.mainServiceId;

  const state = {
    selectedTierId: savedMainServiceId === "shimmerWall"
      ? saved.packageOptionId || service.defaultPackageId
      : service.defaultPackageId,
    selectedAddonIds: new Set(
      savedMainServiceId === "shimmerWall" ? getValidAddonIds(service.id, saved.selectedAddons) : []
    ),
    extraServices: saved?.extraServices || [],
  };

  renderTierChoices();
  renderAddonChoices();
  updateEstimate();

  tierContainer.addEventListener("change", (event) => {
    if (!(event.target instanceof HTMLInputElement)) return;
    state.selectedTierId = event.target.value;
    updateEstimate();
  });

  addonContainer.addEventListener("change", (event) => {
    if (!(event.target instanceof HTMLInputElement)) return;
    if (event.target.checked) {
      state.selectedAddonIds.add(event.target.value);
    } else {
      state.selectedAddonIds.delete(event.target.value);
    }
    updateEstimate();
  });

  addButton.addEventListener("click", (event) => {
    event.preventDefault();

    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      mainServiceId: "shimmerWall",
      packageOptionId: state.selectedTierId,
      selectedAddons: Array.from(state.selectedAddonIds),
      extraServices: state.extraServices,
    }));

    window.location.href = addButton.getAttribute("href") || `${base}pages/booking.html?service=shimmerWall`;
  });

  function renderTierChoices() {
    tierContainer.innerHTML = service.packageOptions.map((option) => `
      <label class="choice-card ${option.id === state.selectedTierId ? "is-selected" : ""}" data-tier-card="${option.id}">
        <input type="radio" name="shimmer-tier" value="${option.id}" ${option.id === state.selectedTierId ? "checked" : ""}>
        <span class="choice-card__title">${option.name}</span>
        <span class="choice-card__meta">${option.description}</span>
        <span class="choice-card__price">${formatCurrency(option.price)}</span>
      </label>
    `).join("");
  }

  function renderAddonChoices() {
    addonContainer.innerHTML = service.addons.map((addon) => `
      <label class="checkbox-card ${state.selectedAddonIds.has(addon.id) ? "is-selected" : ""}" data-addon-card="${addon.id}">
        <input type="checkbox" value="${addon.id}" ${state.selectedAddonIds.has(addon.id) ? "checked" : ""}>
        <span class="checkbox-card__title">${addon.label}</span>
        <span class="checkbox-card__meta">${addon.description}</span>
        <span class="checkbox-card__price">+${formatCurrency(addon.price)}</span>
      </label>
    `).join("");
  }

  function updateEstimate() {
    renderTierChoices();
    renderAddonChoices();

    const selectedTier = getPackageOption(service.id, state.selectedTierId);
    const selectedAddons = service.addons.filter((addon) => state.selectedAddonIds.has(addon.id));
    const total = selectedTier.price + selectedAddons.reduce((sum, addon) => sum + addon.price, 0);

    breakdown.innerHTML = [
      createBreakdownRow(`${service.bookingLabel} - ${selectedTier.name}`, formatCurrency(selectedTier.price)),
      ...selectedAddons.map((addon) => createBreakdownRow(addon.label, `+${formatCurrency(addon.price)}`)),
    ].join("");

    totalTarget.textContent = formatCurrency(total);
  }
}

function setupBookingPage() {
  const form = document.getElementById("booking-form");
  if (!form) return;

  const mainServiceContainer = document.getElementById("main-service-options");
  const mainTierContainer = document.getElementById("main-tier-options");
  const addonContainer = document.getElementById("main-addon-options");
  const comboContainer = document.getElementById("combo-service-options");
  const breakdown = document.getElementById("booking-estimate-breakdown");
  const totalTarget = document.getElementById("booking-estimate-total");
  const message = document.getElementById("booking-message");
  const submitButton = document.getElementById("booking-submit");

  if (!mainServiceContainer || !mainTierContainer || !addonContainer || !comboContainer || !breakdown || !totalTarget || !message) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const stored = normaliseStoredSelection(readStoredSelection());
  const requestedServiceId = params.get("service");
  const initialServiceId = getInitialMainService(requestedServiceId, stored);

  const state = {
    mainServiceId: initialServiceId,
    mainSelections: createMainSelectionState(stored, initialServiceId),
    extraSelections: createExtraSelectionState(stored, initialServiceId),
  };

  renderAll();

  mainServiceContainer.addEventListener("change", (event) => {
    if (!(event.target instanceof HTMLInputElement)) return;

    state.mainServiceId = event.target.value;
    const currentSelection = state.mainSelections[state.mainServiceId];
    if (!currentSelection) {
      state.mainSelections[state.mainServiceId] = {
        packageOptionId: getDefaultPackageOptionId(state.mainServiceId),
        selectedAddons: new Set(),
      };
    }

    if (state.extraSelections[state.mainServiceId]) {
      state.extraSelections[state.mainServiceId].enabled = false;
    }

    renderAll();
  });

  mainTierContainer.addEventListener("change", (event) => {
    if (!(event.target instanceof HTMLInputElement)) return;
    getCurrentMainSelection(state).packageOptionId = event.target.value;
    updateEstimate();
    renderMainTierChoices();
  });

  addonContainer.addEventListener("change", (event) => {
    if (!(event.target instanceof HTMLInputElement)) return;
    const currentSelection = getCurrentMainSelection(state);

    if (event.target.checked) {
      currentSelection.selectedAddons.add(event.target.value);
    } else {
      currentSelection.selectedAddons.delete(event.target.value);
    }

    updateEstimate();
    renderAddonChoices();
  });

  comboContainer.addEventListener("change", (event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) return;

    if (target instanceof HTMLInputElement && target.dataset.comboCheckbox) {
      const serviceId = target.dataset.comboCheckbox;
      const extraSelection = state.extraSelections[serviceId];
      if (!extraSelection) return;

      extraSelection.enabled = target.checked;
      if (!extraSelection.packageOptionId) {
        extraSelection.packageOptionId = getDefaultPackageOptionId(serviceId);
      }

      renderComboChoices();
      updateEstimate();
    }

    if (target instanceof HTMLSelectElement && target.dataset.comboTier) {
      const serviceId = target.dataset.comboTier;
      const extraSelection = state.extraSelections[serviceId];
      if (!extraSelection) return;

      extraSelection.packageOptionId = target.value;
      updateEstimate();
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      eventDate: String(formData.get("eventDate") || "").trim(),
      location: String(formData.get("location") || "").trim(),
      notes: String(formData.get("notes") || "").trim(),
    };

    const errors = validateBookingFields(payload);
    if (errors.length) {
      showMessage(message, "error", errors.join("<br>"));
      return;
    }

    const selection = buildBookingSelection(state);
    const templateParams = {
      to_email: "tsluxevent@gmail.com",
      from_name: payload.name,
      reply_to: payload.email,
      phone: payload.phone,
      event_date: formatDate(payload.eventDate),
      location: payload.location,
      main_package: selection.mainLabel,
      addons: selection.addonLabels.length ? selection.addonLabels.join(", ") : "None selected",
      extra_services: selection.extraLabels.length ? selection.extraLabels.join(", ") : "None selected",
      total_estimate: formatCurrency(selection.total),
      notes: payload.notes || "No additional notes provided.",
    };

    try {
      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
      }

      await sendBookingEmail(templateParams);

      showMessage(message, "success", "Your booking request has been sent. We’ll contact you shortly.");
      form.reset();
      localStorage.removeItem(STORAGE_KEY);

      const resetServiceId = "shimmerWall";
      state.mainServiceId = resetServiceId;
      state.mainSelections = createMainSelectionState(null, resetServiceId);
      state.extraSelections = createExtraSelectionState(null, resetServiceId);

      renderAll();
    } catch (error) {
      showMessage(message, "error", "We couldn’t send your request right now. Please try again or email tsluxevent@gmail.com.");
      console.error(error);
    } finally {
      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = false;
        submitButton.textContent = "Send Booking Request";
      }
    }
  });

  function renderAll() {
    renderMainServiceChoices();
    renderMainTierChoices();
    renderAddonChoices();
    renderComboChoices();
    updateEstimate();
  }

  function renderMainServiceChoices() {
    const services = Object.values(PRICING_DATA.services);

    mainServiceContainer.innerHTML = services.map((service) => {
      const isSelected = service.id === state.mainServiceId;
      return `
        <label class="choice-card ${isSelected ? "is-selected" : ""}">
          <input type="radio" name="main-service" value="${service.id}" ${isSelected ? "checked" : ""}>
          <span class="choice-card__title">${service.bookingLabel}</span>
          <span class="choice-card__meta">${service.tagline}</span>
          <span class="choice-card__price">From ${formatCurrency(getLowestServicePrice(service))}</span>
        </label>
      `;
    }).join("");
  }

  function renderMainTierChoices() {
    const service = getService(state.mainServiceId);
    const currentSelection = getCurrentMainSelection(state);

    mainTierContainer.innerHTML = service.packageOptions.map((option) => `
      <label class="choice-card ${option.id === currentSelection.packageOptionId ? "is-selected" : ""}">
        <input type="radio" name="main-tier" value="${option.id}" ${option.id === currentSelection.packageOptionId ? "checked" : ""}>
        <span class="choice-card__title">${option.name}</span>
        <span class="choice-card__meta">${option.description}</span>
        <span class="choice-card__price">${formatCurrency(option.price)}</span>
      </label>
    `).join("");
  }

  function renderAddonChoices() {
    const service = getService(state.mainServiceId);
    const currentSelection = getCurrentMainSelection(state);

    addonContainer.innerHTML = service.addons.map((addon) => {
      const isChecked = currentSelection.selectedAddons.has(addon.id);
      return `
        <label class="checkbox-card ${isChecked ? "is-selected" : ""}">
          <input type="checkbox" value="${addon.id}" ${isChecked ? "checked" : ""}>
          <span class="checkbox-card__title">${addon.label}</span>
          <span class="checkbox-card__meta">${addon.description}</span>
          <span class="checkbox-card__price">+${formatCurrency(addon.price)}</span>
        </label>
      `;
    }).join("");
  }

  function renderComboChoices() {
    const services = Object.values(PRICING_DATA.services).filter((service) => service.id !== state.mainServiceId);

    comboContainer.innerHTML = services.map((service) => {
      const extraSelection = state.extraSelections[service.id];
      const isChecked = Boolean(extraSelection && extraSelection.enabled);
      const selectedTierId = extraSelection?.packageOptionId || service.defaultPackageId;

      return `
        <div class="checkbox-card combo-card ${isChecked ? "is-selected" : ""}">
          <label class="combo-card__toggle">
            <input type="checkbox" data-combo-checkbox="${service.id}" ${isChecked ? "checked" : ""}>
            <span class="checkbox-card__title">${service.bookingLabel}</span>
            <span class="checkbox-card__meta">${service.comboTagline}</span>
            <span class="checkbox-card__price">From ${formatCurrency(getLowestServicePrice(service))}</span>
          </label>

          <div class="combo-card__tier">
            <label for="combo-tier-${service.id}">Tier</label>
            <select id="combo-tier-${service.id}" data-combo-tier="${service.id}" ${isChecked ? "" : "disabled"}>
              ${service.packageOptions.map((option) => `
                <option value="${option.id}" ${option.id === selectedTierId ? "selected" : ""}>
                  ${option.name} - ${formatCurrency(option.price)}
                </option>
              `).join("")}
            </select>
          </div>
        </div>
      `;
    }).join("");
  }

  function updateEstimate() {
    const selection = buildBookingSelection(state);

    breakdown.innerHTML = [
      createBreakdownRow(selection.mainLabel, formatCurrency(selection.mainPrice)),
      ...selection.addons.map((addon) => createBreakdownRow(addon.label, `+${formatCurrency(addon.price)}`)),
      ...selection.extraServices.map((item) => createBreakdownRow(item.label, `+${formatCurrency(item.price)}`)),
    ].join("");

    totalTarget.textContent = formatCurrency(selection.total);

    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      mainServiceId: state.mainServiceId,
      packageOptionId: selection.mainOption.id,
      selectedAddons: Array.from(getCurrentMainSelection(state).selectedAddons),
      extraServices: selection.extraServices.map((item) => ({
        serviceId: item.serviceId,
        packageOptionId: item.optionId,
      })),
    }));
  }
}

function buildBookingSelection(state) {
  const mainService = getService(state.mainServiceId);
  const mainSelection = getCurrentMainSelection(state);
  const mainOption = getPackageOption(mainService.id, mainSelection.packageOptionId);
  const addons = mainService.addons.filter((addon) => mainSelection.selectedAddons.has(addon.id));
  const extraServices = Object.entries(state.extraSelections)
    .filter(([, selection]) => selection.enabled)
    .map(([serviceId, selection]) => {
      const service = getService(serviceId);
      const option = getPackageOption(serviceId, selection.packageOptionId);
      return {
        serviceId,
        optionId: option.id,
        label: `${service.bookingLabel} - ${option.name}`,
        price: option.price,
      };
    });

  const total =
    mainOption.price +
    addons.reduce((sum, addon) => sum + addon.price, 0) +
    extraServices.reduce((sum, item) => sum + item.price, 0);

  return {
    mainServiceId: mainService.id,
    mainOption,
    mainLabel: `${mainService.bookingLabel} - ${mainOption.name}`,
    mainPrice: mainOption.price,
    addons,
    addonLabels: addons.map((addon) => addon.label),
    extraServices,
    extraLabels: extraServices.map((item) => item.label),
    total,
  };
}

function createMainSelectionState(storedSelection, initialServiceId) {
  const state = {};

  Object.values(PRICING_DATA.services).forEach((service) => {
    state[service.id] = {
      packageOptionId: getDefaultPackageOptionId(service.id),
      selectedAddons: new Set(),
    };
  });

  if (!storedSelection) {
    return state;
  }

  if (storedSelection.mainServiceId && state[storedSelection.mainServiceId]) {
    state[storedSelection.mainServiceId] = {
      packageOptionId: isValidPackageOption(storedSelection.mainServiceId, storedSelection.packageOptionId)
        ? storedSelection.packageOptionId
        : getDefaultPackageOptionId(storedSelection.mainServiceId),
      selectedAddons: new Set(getValidAddonIds(storedSelection.mainServiceId, storedSelection.selectedAddons)),
    };
  }

  if (!state[initialServiceId]) {
    state[initialServiceId] = {
      packageOptionId: getDefaultPackageOptionId(initialServiceId),
      selectedAddons: new Set(),
    };
  }

  return state;
}

function createExtraSelectionState(storedSelection, mainServiceId) {
  const state = {};

  Object.values(PRICING_DATA.services).forEach((service) => {
    state[service.id] = {
      enabled: false,
      packageOptionId: getDefaultPackageOptionId(service.id),
    };
  });

  if (!storedSelection || !Array.isArray(storedSelection.extraServices)) {
    return state;
  }

  storedSelection.extraServices.forEach((item) => {
    if (!item || !item.serviceId || item.serviceId === mainServiceId) return;
    if (!state[item.serviceId]) return;

    state[item.serviceId] = {
      enabled: true,
      packageOptionId: isValidPackageOption(item.serviceId, item.packageOptionId)
        ? item.packageOptionId
        : getDefaultPackageOptionId(item.serviceId),
    };
  });

  return state;
}

function getCurrentMainSelection(state) {
  if (!state.mainSelections[state.mainServiceId]) {
    state.mainSelections[state.mainServiceId] = {
      packageOptionId: getDefaultPackageOptionId(state.mainServiceId),
      selectedAddons: new Set(),
    };
  }

  return state.mainSelections[state.mainServiceId];
}

function getInitialMainService(requestedServiceId, storedSelection) {
  if (requestedServiceId && PRICING_DATA.services[requestedServiceId]) {
    return requestedServiceId;
  }

  if (storedSelection?.mainServiceId && PRICING_DATA.services[storedSelection.mainServiceId]) {
    return storedSelection.mainServiceId;
  }

  return "shimmerWall";
}

function normaliseStoredSelection(rawSelection) {
  if (!rawSelection || typeof rawSelection !== "object") {
    return null;
  }

  const mainServiceId = PRICING_DATA.services[rawSelection.mainServiceId] ? rawSelection.mainServiceId : null;
  const selectedAddons = Array.isArray(rawSelection.selectedAddons) ? rawSelection.selectedAddons : [];

  const extraServices = Array.isArray(rawSelection.extraServices)
    ? rawSelection.extraServices
        .map((item) => {
          if (typeof item === "string") {
            return {
              serviceId: item,
              packageOptionId: getDefaultPackageOptionId(item),
            };
          }

          if (item && typeof item === "object") {
            return {
              serviceId: item.serviceId,
              packageOptionId: item.packageOptionId,
            };
          }

          return null;
        })
        .filter((item) => item && PRICING_DATA.services[item.serviceId])
    : [];

  return {
    mainServiceId,
    packageOptionId: rawSelection.packageOptionId,
    selectedAddons,
    extraServices,
  };
}

function readStoredSelection() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function getService(serviceId) {
  return PRICING_DATA.services[serviceId];
}

function getPackageOption(serviceId, optionId) {
  const service = getService(serviceId);
  if (!service) throw new Error(`Unknown service: ${serviceId}`);

  return service.packageOptions.find((option) => option.id === optionId) || service.packageOptions[0];
}

function getDefaultPackageOptionId(serviceId) {
  const service = getService(serviceId);
  return service ? service.defaultPackageId || service.packageOptions[0].id : "";
}

function getLowestServicePrice(service) {
  return Math.min(...service.packageOptions.map((option) => option.price));
}

function isValidPackageOption(serviceId, optionId) {
  const service = getService(serviceId);
  return Boolean(service && service.packageOptions.some((option) => option.id === optionId));
}

function getValidAddonIds(serviceId, addonIds) {
  const service = getService(serviceId);
  if (!service || !Array.isArray(addonIds)) return [];
  const validIds = new Set(service.addons.map((addon) => addon.id));
  return addonIds.filter((id) => validIds.has(id));
}

function validateBookingFields(payload) {
  const errors = [];
  const phoneDigits = payload.phone.replace(/\D/g, "");

  if (!payload.name) errors.push("Please enter your name.");
  if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors.push("Please enter a valid email address.");
  }
  if (phoneDigits.length < 10) errors.push("Please enter a valid phone number.");

  if (!payload.eventDate) {
    errors.push("Please choose your event date.");
  } else {
    const selectedDate = new Date(payload.eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      errors.push("Please choose a future event date.");
    }
  }

  if (!payload.location) errors.push("Please enter the event location.");
  return errors;
}

function initialiseEmailJs() {
  if (!isEmailJsConfigured()) return;
  if (window.emailjs && typeof window.emailjs.init === "function") {
    window.emailjs.init({
      publicKey: EMAILJS_CONFIG.publicKey,
    });
  }
}

async function sendBookingEmail(templateParams) {
  /*
    While EmailJS is still being configured, this returns a short simulated success.
    Once enabled is true and real credentials are added, the form sends through EmailJS.
  */
  if (!isEmailJsConfigured()) {
    return new Promise((resolve) => {
      window.setTimeout(resolve, 700);
    });
  }

  if (!window.emailjs || typeof window.emailjs.send !== "function") {
    throw new Error("EmailJS library is not available.");
  }

  return window.emailjs.send(
    EMAILJS_CONFIG.serviceId,
    EMAILJS_CONFIG.templateId,
    templateParams
  );
}

function isEmailJsConfigured() {
  const { enabled, publicKey, serviceId, templateId } = EMAILJS_CONFIG;
  return Boolean(
    enabled &&
    publicKey &&
    serviceId &&
    templateId &&
    !publicKey.includes("YOUR_") &&
    !serviceId.includes("YOUR_") &&
    !templateId.includes("YOUR_")
  );
}

function showMessage(target, type, html) {
  target.className = `form-message ${type === "success" ? "is-success" : "is-error"}`;
  target.innerHTML = html;
}

function createBreakdownRow(label, price) {
  return `
    <div class="estimate-breakdown__item">
      <strong>${label}</strong>
      <span>${price}</span>
    </div>
  `;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value) {
  if (!value) return "Not provided";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function injectSkipLink() {
  const target = document.getElementById("site-header");
  if (!target || document.querySelector(".skip-link")) return;

  target.insertAdjacentHTML(
    "beforebegin",
    '<a class="skip-link" href="#main-content">Skip to main content</a>'
  );
}

/*
  IMAGE LIGHTBOX
  - Any photo inside <main> opens full-size when clicked or tapped.
  - Arrow keys or swiping move between photos in the same section.
  - Escape, the close button, or clicking outside the photo closes it.
  - To exclude a photo, add data-no-lightbox to its <img> tag.
*/
function setupLightbox() {
  const images = Array.from(document.querySelectorAll("main img")).filter(
    (img) => !img.closest("a") && !img.hasAttribute("data-no-lightbox")
  );
  if (!images.length || typeof HTMLDialogElement === "undefined") return;

  const dialog = document.createElement("dialog");
  dialog.className = "lightbox";
  dialog.setAttribute("aria-label", "Photo viewer");
  dialog.innerHTML = `
    <figure class="lightbox__figure">
      <img class="lightbox__image" alt="">
      <figcaption class="lightbox__caption"></figcaption>
    </figure>
    <button class="lightbox__close" type="button" aria-label="Close photo">&times;</button>
    <button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Previous photo">&#8249;</button>
    <button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Next photo">&#8250;</button>
  `;
  document.body.appendChild(dialog);

  const bigImage = dialog.querySelector(".lightbox__image");
  const caption = dialog.querySelector(".lightbox__caption");
  const prevButton = dialog.querySelector(".lightbox__nav--prev");
  const nextButton = dialog.querySelector(".lightbox__nav--next");
  let group = [];
  let index = 0;

  const isVisible = (img) => img.offsetParent !== null;
  const groupFor = (img) => {
    const section = img.closest("section") || document.querySelector("main");
    return images.filter((other) => section.contains(other) && isVisible(other));
  };
  const captionFor = (img) => {
    const figcaption = img.closest("figure")?.querySelector("figcaption");
    return (figcaption ? figcaption.textContent : img.alt || "").trim().replace(/\s+/g, " ");
  };

  function show(newIndex) {
    index = (newIndex + group.length) % group.length;
    const img = group[index];
    bigImage.src = img.currentSrc || img.src;
    bigImage.alt = img.alt;
    caption.textContent = captionFor(img);
    const multiple = group.length > 1;
    prevButton.hidden = !multiple;
    nextButton.hidden = !multiple;
  }

  images.forEach((img) => {
    img.classList.add("is-zoomable");
    img.tabIndex = 0;
    img.setAttribute("role", "button");
    img.setAttribute("aria-label", `View larger: ${img.alt || "photo"}`);
    const open = () => {
      group = groupFor(img);
      show(group.indexOf(img));
      dialog.showModal();
      document.documentElement.classList.add("has-lightbox");
    };
    img.addEventListener("click", open);
    img.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });
  });

  dialog.querySelector(".lightbox__close").addEventListener("click", () => dialog.close());
  prevButton.addEventListener("click", () => show(index - 1));
  nextButton.addEventListener("click", () => show(index + 1));
  dialog.addEventListener("close", () => document.documentElement.classList.remove("has-lightbox"));
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog || event.target.classList.contains("lightbox__figure")) dialog.close();
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") show(index - 1);
    if (event.key === "ArrowRight") show(index + 1);
  });

  let touchStartX = null;
  dialog.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0].clientX;
  }, { passive: true });
  dialog.addEventListener("touchend", (event) => {
    if (touchStartX === null || group.length < 2) return;
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 50) show(index + (distance < 0 ? 1 : -1));
    touchStartX = null;
  });
}

/*
  MOBILE ESTIMATE BAR
  - On phones and tablets, keeps the running total visible at the bottom of the
    screen while the visitor picks packages and add-ons.
  - Hides once the full estimate card comes into view and stays hidden below it.
*/
function setupEstimateBar() {
  const card = document.querySelector(".estimate-card");
  const amount = card?.querySelector(".estimate-total__amount");
  if (!card || !amount) return;

  if (!card.id) card.id = "estimate-summary";
  const bar = document.createElement("div");
  bar.className = "estimate-bar";
  bar.innerHTML = `
    <div>
      <span class="estimate-bar__label">Estimated total</span>
      <strong class="estimate-bar__amount"></strong>
    </div>
    <a class="estimate-bar__link" href="#${card.id}">See breakdown</a>
  `;
  document.body.appendChild(bar);

  const barAmount = bar.querySelector(".estimate-bar__amount");
  const sync = () => {
    barAmount.textContent = amount.textContent.trim();
  };
  sync();
  new MutationObserver(sync).observe(amount, { childList: true, characterData: true, subtree: true });

  // Show the bar only while the estimate section is still further down the page.
  // Once the visitor has reached it (or scrolled past it), keep the bar hidden.
  const update = () => {
    const reachedCard = card.getBoundingClientRect().top < window.innerHeight;
    bar.classList.toggle("is-hidden", reachedCard);
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}
