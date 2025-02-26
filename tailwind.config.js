/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkbrown: "#4d3826", // (h1, h2, h3, h4, h5, h6 - Used in Recipe Card & Recipe Detail)
        charcoalgray: "#333333", // (p, span, div - Used in Recipe Card & Recipe Detail)
        slategray: "#555555", // (ul, ol, li - Used in Recipe Card & Recipe Detail)
        lightgray: "#888888", // (small, caption)

        // Recipe Card
        darkbluegray: "#2c3e50", // (h1, h2, h3, h4, h5, h6)
        darkgray: "#4a4a4a", // (p)
        muteddarkgreen: "#557a63", // (span)
        slightlydarkergreen: "#6b8e72", // (hover btn)

        // Recipe Detail (New Colors)
        softcream: "#f5f1e3", // (Background for recipe details)
        deepforestgreen: "#2d5c41", // (Titles, hover effects, buttons)
        warmolive: "#6f7d50", // (Ingredient highlights, list hover effects)
        mutedgold: "#b39b77", // (Dividers, section separators, subtle highlights)
        dustyrose: "#b07d62", // (CTA buttons, important sections)
        shadowred: "#8b0000", // (Image shadow for Recipe Detail)

        // Carousel
        bodybackground: "#8db48e", // (Muted Green - Body Background)
        cardbackground: "#FFFFFF", // (White - Card Background)
        heading: "#2f4031", // (Dark Green - h1, h2, h3)
        paragraph: "#4c6b48", // (Medium Green - p)
        spantext: "#5a7d5f", // (Slightly lighter Green - span)
        buttonbackground: "#3e573e", // (Deep forest green - Button Background)
        buttontext: "#FFFFFF", // (White - Button Text)
        cardtext: "#2f4031", // (Same Dark Green as headings - Card Text)
        terracotta:"#d38b5d",
        warmorange:"#4d6657",
        mutedolive:"##577a63",
        mutedgreenishgray: "#4d6657"
      },
    },
  },
  plugins: [],
};

