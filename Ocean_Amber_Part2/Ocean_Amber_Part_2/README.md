# Ocean Amber — POE Part 2

## Project Overview
Ocean Amber is a responsive restaurant website developed for Part 2 of the POE. The project focuses on CSS styling, visual hierarchy, layout structure and responsive design, following the requirements supplied in the Part 2 brief.

The website presents a fictional contemporary coastal restaurant called **Ocean Amber**. Its visual identity combines deep ocean navy with warm amber/gold accents to create a sophisticated but welcoming dining experience.

## Technologies
- HTML5
- CSS3
- CSS Grid
- CSS Flexbox
- Media Queries
- Relative units (`rem`, `em`, `%`, `clamp()`)
- CSS pseudo-classes (`:hover`, `:focus`, `:focus-visible`, `:checked`)
- Responsive design
- Google Fonts: Playfair Display and DM Sans

## Pages
1. `index.html` — Home page with hero section, signature dishes, experience section and newsletter area.
2. `menu.html` — Structured restaurant menu with categories and pricing in South African Rand.
3. `about.html` — Restaurant story, design philosophy and values.
4. `contact.html` — Responsive reservation/contact form.

## Folder Structure
```text
Ocean_Amber_Part_2/
│
├── index.html
├── menu.html
├── about.html
├── contact.html
├── style.css
├── README.md
└── assets/
```

## Part 2 Requirements Implemented

### 1. Working through Feedback from Part 1
The website has been refined with stronger visual hierarchy, consistent spacing, reusable components, clearer navigation and improved responsive behaviour. All Part 2 changes are documented in the changelog below.

### 2. CSS Styling for Desktop
- A single external stylesheet (`style.css`) is linked to every page.
- Element, class and contextual selectors are used.
- Typography uses a serif display typeface for headings and a clean sans-serif body typeface.
- CSS Grid is used for major page structures.
- Flexbox is used for navigation, buttons, footer areas and smaller component layouts.
- Colour, borders, shadows, spacing and backgrounds establish the visual identity.
- Interactive states are implemented with pseudo-classes.

### 3. Responsive Design
The website includes three practical responsive ranges:
- Large desktop: above 62rem
- Tablet / smaller desktop: 48rem–62rem
- Mobile: below 48rem
- Small mobile refinement: below 34rem

The desktop multi-column layouts collapse into one-column structures on smaller screens. Navigation changes into a mobile menu controlled through a CSS checkbox pattern. Typography uses `clamp()` and spacing uses relative units so the interface scales smoothly.

### Responsive Images
The design uses scalable CSS artwork blocks with `aspect-ratio` and responsive sizing. Where raster images are added in future, the global `img { max-width: 100%; height: auto; }` rule ensures they remain within their containers.

## How to Run
1. Download or extract the project.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` in a browser.
4. For the best development workflow, install/use the VS Code Live Server extension and select **Open with Live Server**.
5. Resize the browser to test desktop, tablet and mobile layouts.

No server, database or build process is required for this Part 2 static website.

## Testing Checklist
- [x] All navigation links open the correct page.
- [x] External CSS is linked on all pages.
- [x] Desktop layout uses multiple columns.
- [x] Tablet layout reduces columns and spacing.
- [x] Mobile layout uses a single-column structure.
- [x] Mobile navigation opens and closes using the CSS toggle.
- [x] Buttons have hover and focus states.
- [x] Form controls have visible focus styling.
- [x] Content uses relative units and responsive typography.
- [x] Prices are displayed in South African Rand (R).
- [x] `prefers-reduced-motion` is supported.

## Changelog

### Part 2 — 17 September 2026
- Created a dedicated external `style.css` and linked it across all HTML pages.
- Reworked the visual identity around Ocean Amber's navy, ocean-blue, cream and amber palette.
- Added a clear typographic hierarchy using Playfair Display for headings and DM Sans for body/interface text.
- Implemented CSS Grid for page-level layouts, card collections, menu structure and footer columns.
- Implemented Flexbox for navigation, action buttons, footer alignment and responsive form components.
- Added reusable button, eyebrow, text-link, card, form and navigation styles.
- Added interactive `:hover`, `:focus`, `:focus-visible` and `:checked` states.
- Added desktop, tablet, mobile and small-mobile media-query breakpoints.
- Converted large-screen multi-column layouts to single-column mobile layouts.
- Added responsive typography using `clamp()` and relative spacing using `rem`, `%` and viewport-aware sizing.
- Added a CSS-only mobile navigation pattern to improve usability on smaller screens.
- Added responsive menu cards and restaurant menu categories.
- Added a responsive reservation form with semantic labels and required fields.
- Added a `prefers-reduced-motion` accessibility rule.
- Improved footer structure and page-to-page consistency.
- Added this README and a detailed project report for POE Part 2.

## Academic Note
Ocean Amber is a fictional restaurant website created for educational/POE purposes. Contact information and reservation details are demonstration content.

## References
- Mozilla Developer Network (MDN Web Docs) (2026) *CSS: Cascading Style Sheets*. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS
- Mozilla Developer Network (MDN Web Docs) (2026) *CSS Grid Layout*. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout
- Mozilla Developer Network (MDN Web Docs) (2026) *CSS Flexible Box Layout*. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout
- World Wide Web Consortium (W3C) (2026) *CSS Specifications*. Available at: https://www.w3.org/Style/CSS/
