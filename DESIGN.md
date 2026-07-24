# E-Catalog UI Design Specification: Vivien's Store

This document outlines the detailed UI/UX design specifications for the Vivien's Store e-catalog website, based on the provided reference images.

## 1. Global Design Language

### 1.1. Color Palette
The website utilizes a luxurious, modern, and high-contrast color scheme:
*   **Primary Background:** Clean White / Off-White (e.g., `#FFFFFF`, `#F9F9F9`). Provides a minimalist canvas that allows product imagery to stand out.
*   **Primary Text:** Charcoal / Soft Black (e.g., `#222222`, `#333333`). Used for headings, body text, and primary UI outlines.
*   **Accent Color:** Mustard Gold (approx. `#C89B3C`). Used strategically to draw attention to primary Call-to-Action (CTA) buttons ("SHOP NOW", "SHOP NEW ARRIVALS"), highlighted text ("Perfect"), star ratings, and "SALE" badges.
*   **Secondary Text/Muted Elements:** Medium Gray (e.g., `#777777`) for categories, original prices (strikethrough), and borders.

### 1.2. Typography
*   **Headings:** A bold, high-contrast Serif typeface is used for major section titles (e.g., "Discover Your Perfect Style", "Find Your Look", "Featured Pieces"). This conveys elegance and timeless luxury.
*   **Body & UI Elements:** A clean, modern Sans-Serif typeface is used for navigation menus, buttons, product descriptions, prices, and smaller UI text. This ensures readability and a contemporary feel.

---

## 2. Layout & Composition

### 2.1. Hero Section
*   **Layout:** Full-width (edge-to-edge) background image featuring lifestyle modeling.
*   **Overlay:** A subtle gradient or dark overlay ensures the white and gold text remains highly legible against the complex background.
*   **Typography Scale:** Massive, bold serif typography dominates the left side.
*   **CTAs:** Features a primary gold button ("SHOP NEW ARRIVALS ->") and a secondary transparent button with a white outline ("EXPLORE CATEGORIES").

### 2.2. Navigation Bar
*   **Style:** Minimalist, sticky or static top bar with a solid white background (or transparent fading to white).
*   **Elements:** Brand logo on the left (black and gold geometric shape). Centered navigation links (Home, Categories, New Arrivals, Best Sellers, About, Contact). Primary CTA gold button ("SHOP NOW") on the far right.

### 2.3. Bento Grid System ("Find Your Look" Section)
*   **Structure:** The category section utilizes a modern "Bento Grid" layout. This involves asymmetrical, varied-size rectangular cards nested together to create a dynamic visual hierarchy.
*   **Card Styling:** The bento cards feature heavily rounded corners (approx. `24px` to `32px` border radius). 
*   **Content:** Images are full-bleed within the rounded containers. Text (e.g., "Men's Fashion") is positioned at the bottom left with a dark gradient overlay for legibility. Navigation arrows (gold circles) are placed inside the cards.

---

## 3. Product Cards ("Featured Pieces")

### 3.1. Card Shape & Aesthetics
*   **Container:** Vertical orientation with prominent rounded corners, matching the bento grid style. Background is white, blending softly with the page, or utilizing a very subtle drop shadow to lift it off the background.
*   **Image:** The product image fills the top portion of the card.
*   **Spacing:** Generous padding around the text details below the image.

### 3.2. Card Elements
*   **Badges (Top Left):** Pill-shaped badges overlap the image to indicate status. 
    *   White background, black text for "BEST SELLER".
    *   Black background, white text for "NEW".
    *   Gold background, white text for "SALE".
*   **Product Details (Below Image):**
    *   Category (small, gray sans-serif, e.g., "Accessories").
    *   Product Title (bold, dark charcoal sans-serif, e.g., "Leather Oxford Shoes").
    *   Rating: Five-star visual component (gold stars) followed by the review count in parentheses.
    *   Price: Current price in bold dark text. Discounted original price in gray with a strikethrough.
    *   Link: "View Details ->" text link on the bottom right (gold color).
*   **Hover Interaction:** When a user hovers over the product card, a dark charcoal rectangular button labeled "QUICK VIEW" slides up or appears overlaying the bottom edge of the product image.

---

## 4. Quick View Modal (On-Click Detail)

When a user clicks a product card or the "Quick View" button, a modal window opens over the main website content with a semi-transparent dark backdrop.

### 4.1. Modal Shape
*   Large rectangular floating container with the exact same prominent rounded corners used throughout the site's UI.

### 4.2. Modal Layout (50/50 Split)
*   **Left Column (Image):** The product image takes up the entire left half of the modal, bleeding perfectly to the top, bottom, and left rounded edges. A badge (e.g., "SALE") can sit in the top-left corner.
*   **Right Column (Details):** Contains all purchasing options and product information with ample whitespace.
    *   **Close Button:** A small circular button with an 'X' icon in the top right corner.
    *   **Header:** Category text, followed by the large Product Title.
    *   **Reviews:** Star rating visual and numeric score (e.g., "4.8") with total review count.
    *   **Pricing:** Current price (large, bold), original price (strikethrough), and a distinct pill-shaped discount tag (e.g., "-19%" in gold).
    *   **Description:** A short paragraph of descriptive text in gray.
    *   **Feature Tags:** Pill-shaped, light gray background elements highlighting key features (e.g., "Full-Grain Leather", "Standard Width").
    *   **Color Selector:** Titled "COLOR". Options are represented by solid circular color swatches. The currently selected color is indicated by a slightly larger outer gold ring outline.
    *   **Size Selector:** Titled "SIZE". Options are represented by white squares with heavily rounded corners and a thin gray border (e.g., 39, 40, 41...).

### 4.3. Navigation Components
*   The overall UI utilizes subtle category filters above the product grids (e.g., "ALL", "MEN'S", "WOMEN'S") styled as pill-shaped buttons. The active state is indicated by a dark charcoal background, while inactive states are light gray.