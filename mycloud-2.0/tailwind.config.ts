import type { Config } from "tailwindcss";

const darkMode: Config =  {
    darkMode: "media",
    theme: {
        extend: {
            colors: {
                dark: {
                    // ── Surfaces ──────────────────────────────────
                    // Page background (body)
                    page:    "#1c1c1c",
                    // Sidebar, navbar, folder trace, search bar bg
                    base:    "#222222",
                    // File boxes, buttons, capacity card, sort picker container
                    card:    "#2a2a2a",
                    // Hover state on cards and buttons
                    hover:   "#323232",
                    //Dropdown bg
                    dropdown: "#1a1a1a",
                    // Search bar bg
                    search:  "#2e2e2e",
                    // Sort picker active pill
                    pill:    "#3d3d3d",

                    // ── Borders ───────────────────────────────────
                    border: {
                        // Folder trace, progress track, sort picker divider
                        subtle:  "#2e2e2e",
                        // File boxes, buttons, capacity card
                        DEFAULT: "#383838",
                        // Button hover border, strong dividers
                        strong:  "#444444",
                        // Search bar focused state
                        focus:   "#555555",
                    },

                    // ── Text ──────────────────────────────────────
                    text: {
                        // Body, buttons, button-icons, input, active sort option, spinner color
                        primary:   "#e0e0e0",
                        // Secondary labels, filter dropdown
                        secondary: "#c8c8c8",
                        // Muted labels (sort-by, storage capacity, sort inactive)
                        idle:      "#999999",
                        // Very faint (placeholders, captions)
                        faint:     "#555555",
                        // Upload progress status
                        status:    "#888888",
                    },
                },
            },
        },
    },
    plugins: [],
};

export default darkMode;
