from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError as exc:
    raise SystemExit("Pillow is required to generate the PNG exports.") from exc


ROOT = Path(__file__).resolve().parent
EXPORTS = ROOT / "exports"
EXPORTS.mkdir(exist_ok=True)

WIDTH = 1080
HEIGHT = 1720
MARGIN = 58


def load_font(size: int, bold: bool = False):
    candidates = [
        "/System/Library/Fonts/Supplemental/Georgia Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Georgia.ttf",
        "/System/Library/Fonts/Supplemental/Times New Roman Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Times New Roman.ttf",
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
    ]
    for candidate in candidates:
      path = Path(candidate)
      if path.exists():
        return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


TITLE_FONT = load_font(54, bold=True)
SERIF_44 = load_font(44, bold=True)
SERIF_30 = load_font(30, bold=True)
BODY_FONT = load_font(24)
SMALL_FONT = load_font(20)
LABEL_FONT = load_font(18, bold=True)


OPTIONS = [
    {
        "slug": "classic",
        "name": "Classic Luxe",
        "bg": "#f7efe7",
        "panel": "#fffdf9",
        "panel_2": "#f1e4d5",
        "ink": "#30231d",
        "muted": "#786359",
        "accent": "#b8825a",
        "accent_2": "#dfc0a8",
        "packages": [
            ("Essential", "8 x 8 ft", "$375", [
                "Shimmer wall backdrop",
                "1 balloon garland",
                "Up to 3 colors",
                "Setup + teardown",
            ]),
            ("Signature", "10 x 8 ft", "$525", [
                "More balloon coverage",
                "Most requested size",
                "Up to 3 colors",
                "Setup + teardown",
            ]),
            ("Statement", "12 x 8 ft", "$695", [
                "Wider shimmer wall",
                "Larger balloon install",
                "Up to 3 colors",
                "Setup + teardown",
            ]),
        ],
    },
    {
        "slug": "editorial",
        "name": "Editorial Luxe",
        "bg": "#171312",
        "panel": "#1d1918",
        "panel_2": "#f0e8de",
        "ink": "#f6f1ea",
        "muted": "#cbbbae",
        "accent": "#d7a767",
        "accent_2": "#5a4b41",
        "packages": [
            ("Mini Luxe", "8 x 8 ft", "$385", [
                "Compact event setup",
                "1 balloon garland",
                "Up to 3 colors",
                "Setup + breakdown",
            ]),
            ("Luxe Signature", "10 x 8 ft", "$545", [
                "Balanced party backdrop",
                "Fuller balloon install",
                "Up to 3 colors",
                "Setup + breakdown",
            ]),
            ("Luxe Grand", "12 x 8 ft", "$710", [
                "Wider hall coverage",
                "Bolder balloon arrangement",
                "Up to 3 colors",
                "Setup + breakdown",
            ]),
        ],
    },
    {
        "slug": "celebration",
        "name": "Celebration Board",
        "bg": "#fff5f2",
        "panel": "#ffffff",
        "panel_2": "#fff0f5",
        "ink": "#322634",
        "muted": "#7d6672",
        "accent": "#d86aa4",
        "accent_2": "#ef8e7f",
        "packages": [
            ("Sweet Start", "8 x 8 ft", "$365", [
                "Smaller focal-point setup",
                "1 balloon garland",
                "Up to 3 colors",
                "Setup + teardown",
            ]),
            ("Party Signature", "10 x 8 ft", "$515", [
                "Ideal for grads + birthdays",
                "More balloon coverage",
                "Up to 3 colors",
                "Setup + teardown",
            ]),
            ("Main Event", "12 x 8 ft", "$685", [
                "Wider wall installation",
                "Large balloon arrangement",
                "Up to 3 colors",
                "Setup + teardown",
            ]),
        ],
    },
]

ADDONS = [
    ("Extra colors", "+$20 to +$30 each"),
    ("Second garland", "+$95 to +$175"),
    ("Full arch", "+$225 to +$385"),
    ("Half moon arch", "+$90 to +$165"),
    ("Custom sign", "+$45 to +$115"),
    ("Flower inserts", "+$35 to +$85"),
]

SERVICES = [
    ("LED numbers", "$65+"),
    ("Extra arch/backdrop panel", "$80+"),
    ("Mini pastry table styling", "$90+"),
    ("Mini mocktail table styling", "$130+"),
    ("Pastry + mocktail combo", "$200+"),
    ("Travel / premium venue", "Quote"),
]


def rounded(draw: ImageDraw.ImageDraw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def text(draw: ImageDraw.ImageDraw, xy, value, font, fill, anchor="la"):
    draw.text(xy, value, font=font, fill=fill, anchor=anchor)


def bullet_lines(draw, start_x, start_y, lines, fill, max_width):
    y = start_y
    for line in lines:
        text(draw, (start_x, y), "\u2022", BODY_FONT, fill)
        text(draw, (start_x + 22, y), line, SMALL_FONT, fill)
        y += 32
    return y


def package_card(draw, x1, y1, x2, y2, opt, pkg, featured=False):
    rounded(
        draw,
        (x1, y1, x2, y2),
        26,
        fill=opt["panel"],
        outline=opt["accent"] if featured else opt["accent_2"],
        width=3 if featured else 1,
    )
    label, size, price, lines = pkg
    text(draw, (x1 + 26, y1 + 24), label.upper(), LABEL_FONT, opt["muted"])
    text(draw, (x1 + 26, y1 + 64), size, SERIF_30, opt["ink"])
    text(draw, (x1 + 26, y1 + 126), price, SERIF_44, opt["accent"])
    bullet_lines(draw, x1 + 26, y1 + 190, lines, opt["muted"], x2 - x1 - 50)


def service_row(draw, x1, y1, x2, y2, opt, left, right):
    rounded(draw, (x1, y1, x2, y2), 18, fill=opt["panel"], outline=opt["accent_2"])
    text(draw, (x1 + 18, y1 + 20), left, SMALL_FONT, opt["muted"])
    text(draw, (x2 - 18, y1 + 20), right, SERIF_30, opt["accent"], anchor="ra")


for option in OPTIONS:
    img = Image.new("RGB", (WIDTH, HEIGHT), option["bg"])
    draw = ImageDraw.Draw(img)

    rounded(draw, (24, 24, WIDTH - 24, HEIGHT - 24), 36, fill=option["bg"], outline=option["accent_2"])
    rounded(draw, (MARGIN, 56, WIDTH - MARGIN, 268), 32, fill=option["panel_2"])

    text(draw, (MARGIN + 28, 92), "TSQUARED LUXE EVENTS", LABEL_FONT, option["muted"])
    text(draw, (MARGIN + 28, 132), "Shimmer Wall", TITLE_FONT, option["ink"])
    text(draw, (MARGIN + 28, 190), "Pricing Guide", TITLE_FONT, option["ink"])
    text(
        draw,
        (MARGIN + 28, 248),
        "Beginner-friendly pricing built around a shimmer wall base and a 3-color balloon theme.",
        SMALL_FONT,
        option["muted"],
    )
    text(draw, (WIDTH - MARGIN - 28, 98), option["name"], LABEL_FONT, option["accent"], anchor="ra")
    text(draw, (WIDTH - MARGIN - 28, 138), "@tsluxe.events", SMALL_FONT, option["muted"], anchor="ra")
    text(draw, (WIDTH - MARGIN - 28, 170), "@tsluxe8", SMALL_FONT, option["muted"], anchor="ra")
    text(draw, (WIDTH - MARGIN - 28, 202), "tsluxevent@gmail.com", SMALL_FONT, option["muted"], anchor="ra")

    text(draw, (MARGIN, 356), "BASE PACKAGES", LABEL_FONT, option["muted"])
    card_top = 390
    gap = 18
    card_w = (WIDTH - (MARGIN * 2) - gap * 2) // 3
    for idx, pkg in enumerate(option["packages"]):
        x1 = MARGIN + idx * (card_w + gap)
        x2 = x1 + card_w
        package_card(draw, x1, card_top, x2, 720, option, pkg, featured=(idx == 1))

    rounded(draw, (MARGIN, 790, WIDTH - MARGIN, 892), 24, fill=option["panel_2"])
    text(draw, (MARGIN + 24, 824), "PRICING NOTE", LABEL_FONT, option["muted"])
    text(
        draw,
        (MARGIN + 24, 864),
        "Final quotes may increase for complex installs, premium materials, long-distance travel, or venue restrictions.",
        SMALL_FONT,
        option["muted"],
    )

    text(draw, (MARGIN, 954), "POPULAR ADD-ONS", LABEL_FONT, option["muted"])
    addon_y = 988
    addon_gap = 14
    addon_w = (WIDTH - (MARGIN * 2) - addon_gap) // 2
    addon_h = 76
    for idx, (name, price) in enumerate(ADDONS):
        row = idx // 2
        col = idx % 2
        x1 = MARGIN + col * (addon_w + addon_gap)
        y1 = addon_y + row * (addon_h + 12)
        rounded(draw, (x1, y1, x1 + addon_w, y1 + addon_h), 18, fill=option["panel"], outline=option["accent_2"])
        text(draw, (x1 + 18, y1 + 20), name, SMALL_FONT, option["ink"])
        text(draw, (x1 + addon_w - 18, y1 + 20), price, SERIF_30, option["accent"], anchor="ra")

    text(draw, (MARGIN, 1272), "ADDITIONAL SERVICES", LABEL_FONT, option["muted"])
    row_y = 1304
    for idx, item in enumerate(SERVICES):
        service_row(draw, MARGIN, row_y + idx * 52, WIDTH - MARGIN, row_y + idx * 52 + 42, option, *item)

    rounded(draw, (MARGIN, 1618, WIDTH - MARGIN, HEIGHT - 58), 20, fill=option["panel_2"])
    text(draw, (MARGIN + 18, 1650), "Instagram: @tsluxe.events   |   TikTok: @tsluxe8   |   Email: tsluxevent@gmail.com", SMALL_FONT, option["ink"])

    img.save(EXPORTS / f"tsquared-pricing-{option['slug']}.png")

print(f"Created {len(OPTIONS)} PNG exports in {EXPORTS}")
