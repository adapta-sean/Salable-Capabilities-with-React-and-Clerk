import daisyui from "daisyui"

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    daisyui: {
        base: true, // applies background color and foreground color for root element by default
        themes: [
            {
                custom: {
                    "primary": "#ff0078",
                    "primary-content": "#160005",
                    "secondary": "#ff8c00",
                    "secondary-content": "#160700",
                    "accent": "#c30000",
                    "accent-content": "#fad5cf",
                    "neutral": "#161107",
                    "neutral-content": "#cac9c6",
                    "base-100": "#374151",
                    "base-200": "#2e3745",
                    "base-300": "#262e3a",
                    "base-content": "#d3d6da",
                    "info": "#00adff",
                    "info-content": "#000b16",
                    "success": "#73e173",
                    "success-content": "#051205",
                    "warning": "#b54e00",
                    "warning-content": "#f3dcd0",
                    "error": "#ff4151",
                    "error-content": "#160102",
                },
            }
        ]
    },
    theme: {
        extend: {},
    },
    plugins: [
        daisyui,
    ],
}

