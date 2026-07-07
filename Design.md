# SettleKar Landing Page - Design Specification

This document details the UX/UI architecture, design tokens, responsive layout, and interaction systems designed for the **SettleKar Landing Page**.

---

## 1. Visual Identity & Design System

SettleKar is India's 1st rental-only platform that eliminates middle-men to connect verified owners directly with tenants. The visual style is designed to look premium, modern, and trust-inspiring, utilizing a sleek dark-mode foundation with glassmorphic accents, vibrant gradients, and clean micro-interactions.

### 🎨 Color Palette

| Token | HSL / Hex | Usage |
| :--- | :--- | :--- |
| **Brand Primary (Navy)** | `#0A2540` / `hsl(210, 73%, 15%)` | Base backgrounds, hero backgrounds, primary text container |
| **Brand Accent (Royal Blue)** | `#2563EB` / `hsl(221, 83%, 53%)` | Primary CTAs, active states, borders, brand indicators |
| **Brand Highlight (Sky Blue)** | `#38BDF8` / `hsl(199, 89%, 60%)` | Accent borders, badges, positive metrics, links |
| **Warning/Danger (Coral)** | `#EF4444` / `hsl(0, 84%, 60%)` | Error states, delete triggers, critical alerts |
| **Attention (Gold/Amber)** | `#F59E0B` / `hsl(38, 92%, 50%)` | Star ratings, highlight tags, confidence badges |
| **Dark Neutral (Charcoal)** | `#0F172A` / `hsl(222, 47%, 11%)` | Secondary section backdrops, cards, input fields |
| **Light Neutral (Slate White)**| `#F8FAFC` / `hsl(210, 40%, 98%)` | Primary text headings, body text, card icons |

### ✍️ Typography

*   **Primary Font Family:** `'Inter', sans-serif` — Used for body, headers, forms, stats, and sidebar elements to ensure readability.
*   **Secondary Font Family:** `'DM Sans', sans-serif` — Used for headings, cards, and section titles to project a modern, welcoming vibe.
*   **Creative Accents:** `'Caveat', cursive` — Used selectively for hand-drawn annotations, notes, or highlighting badges.
*   **Scale Hierarchy:**
    *   `h1` (Hero Headings): `2.5rem` to `3.5rem` (responsive fluid scaling)
    *   `h2` (Section Headings): `1.85rem` to `2.25rem`
    *   `h3` (Card Titles): `1.15rem` to `1.25rem`
    *   `body` (Text content): `0.875rem` to `1rem`
    *   `caption` (Subtext/Badges): `0.7rem` to `0.8rem`

---

## 2. Layout Structure & Components

The landing page follows a single-page marketing structure optimized to drive conversions (either searching properties or downloading the mobile app).

```
[Header / Navbar]
       │
[Hero / Video Section] ─── [Stats Grid]
       │
[Features Grid]
       │
[How It Works (Timeline Stepper)]
       │
[Testimonials Section]
       │
[FAQ Accordion]
       │
[Download App CTA]
       │
[Footer]
```

### 1. Header / Navbar
*   **Desktop:** Transparent header overlay showing the SettleKar logo, direct anchor links (`Features`, `How It Works`, `Download`, `Search Properties`), and a primary `"List Property"` action button.
*   **Mobile:** Switches to a compact header bar containing the logo on the left and a custom **Hamburger Menu** (`.videoHamburger`) on the right. Clicking it launches a full-screen blurred backdrop overlay (`.mobileMenuOverlay`) with staggered menu fade-in animations.

### 2. Video / Hero Section
*   **Background:** An elegant radial navy gradient (`#0A2540` to `#0F172A`) containing animated light paths.
*   **Left Column (Copy):**
    *   `MapPin` tag badge highlighting *"India's 1st Rental-Only Platform"*.
    *   Headline: *"Find. Connect. Settle."* in large serif/sans bold text.
    *   CTA Matrix: Primary button to search properties and secondary outline button to download the app.
*   **Right Column (Mockup):**
    *   A premium interactive 3D phone mockup showcase (`.heroPhoneFrame`) complete with a notch, speaker grille, camera lens, and screen wrapping. It displays the live SettleKar application UI.
*   **Bottom Anchor:** An animated mouse-scroll hint prompting users to scroll down.

### 3. Stats Grid
*   Three-card layout showing core metrics:
    *   `10K+` Properties Listed
    *   `5K+` Happy Users
    *   `50+` Cities Covered
*   On mobile, columns scale down cleanly using CSS flex-wrap or responsive grids to keep cards proportional.

### 4. Features Grid
*   A responsive cards layout containing icons and copy illustrating:
    *   **Direct Owner Connect:** Eliminating brokers and brokerage costs.
    *   **Verified Listings:** Live status verification by our trust and safety teams.
    *   **Smart Location Filtering:** Search properties within a customized radius from a workplace/college.

### 5. How It Works (Timeline Stepper)
*   A vertical timeline stepper illustrating:
    1.  **Search Near Location:** Finding rentals close to work/school.
    2.  **Contact Directly:** Chatting or calling verified landlords directly.
    3.  **Settle Down:** Finalizing agreements.

### 6. Testimonials Section
*   Premium, glassmorphic review cards highlighting happy tenant and owner experiences. Cards use smooth hover translations (`transform: translateY(-4px)`).

### 7. FAQ Accordion Section
*   A list of expandable questions and answers. Handled with keyboard-accessible focus highlights and smooth height animations for accordion reveals.

### 8. Download App Call-to-Action
*   High-contrast section providing links to download the Android app directly from the Google Play Store.

### 9. Footer
*   Contains the SettleKar brand mark, copyright disclaimer, customer support contact info, and legal document links (Privacy Policy, Terms of Service, Delete Account).

---

## 3. Mobile Responsiveness & Viewport Strategy

SettleKar utilizes **mobile-first styles** coupled with targeted media queries to ensure the site looks native on standard mobile devices:

1.  **Breakpoint Matrix:**
    *   `max-width: 1280px` — High-resolution desktop / laptop tuning
    *   `max-width: 1024px` — Tablet landscape alignment (shrinks grid columns)
    *   `max-width: 768px` — Tablet portrait & phone landscape (activates mobile nav drawer)
    *   `max-width: 560px` / `480px` — Mobile portrait (stacks cards, increases button touch target heights, sets grid layout to `1fr`)
2.  **Fluid Typography:** Headings utilize HSL scaling and `clamp()` values to ensure titles look centered and balanced without clipping.
3.  **Touch Targets:** Interactive buttons, tabs, and links have minimum tap sizes of `48px` width and height, aligned with mobile accessibility standards.

---

## 4. Scroll Reveal & Interaction Systems

```css
/* Scroll reveal rule */
.featureCard, .step, .heroContent, .phoneMockup, .listingsSection, .testimonialsSection {
  opacity: 0;
  transform: translateY(40px);
  will-change: opacity, transform;
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), 
              transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.featureCard.visible {
  opacity: 1;
  transform: translateY(0);
}
```

*   **Intersection Observer:** A React hook instantiates an observer on layout mount. It targets features, step cards, and mockups, attaching a `.visible` class when elements intersect `10%` of the viewport to trigger fluid fade-in translations.
*   **CSS Transitions:** All interactive states (buttons, menu items, search badges) utilize smooth transition curves (`all 0.2s ease` or `cubic-bezier(0.16, 1, 0.3, 1)` for panels) to feel premium and reactive.
