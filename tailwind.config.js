/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xs: "360px",
      ...defaultTheme.screens,
    },
    extend: {
      fontFamily: {
        sans: ["'IBM Plex Sans'"],
        mono: ["'IBM Plex Mono'"],
      },
      colors: {
        nord: {
          0: "#2E3440",
          1: "#3B4252",
          2: "#434C5E",
          3: "#4C566A",
          4: "#D8DEE9",
          5: "#E5E9F0",
          6: "#ECEFF4",
          7: "#8FBCBB",
          8: "#88C0D0",
          9: "#81A1C1",
          10: "#5E81AC",
          11: "#BF616A",
          12: "#D08770",
          13: "#EBCB8B",
          14: "#A3BE8C",
          15: "#B48EAD",
        },
      },
      typography: ({ theme }) => ({
        nord: {
          css: {
            "--tw-prose-body": theme("colors.nord.4"),
            "--tw-prose-headings": theme("colors.nord.6"),
            "--tw-prose-lead": theme("colors.nord.6"),
            "--tw-prose-links": theme("colors.nord.8"),
            "--tw-prose-bold": theme("colors.nord.4"),
            "--tw-prose-counters": theme("colors.nord.3"),
            "--tw-prose-bullets": theme("colors.nord.3"),
            "--tw-prose-hr": theme("colors.nord.3"),
            "--tw-prose-quotes": theme("colors.nord.9"),
            "--tw-prose-quote-borders": "transparent",
            "--tw-prose-captions": theme("colors.nord.4"),
            "--tw-prose-code": theme("colors.nord.8"),
            "--tw-prose-pre-code": theme("colors.nord.4"),
            "--tw-prose-pre-bg": theme("colors.nord.1"),
            "--tw-prose-th-borders": theme("colors.nord.3"),
            "--tw-prose-td-borders": theme("colors.nord.3"),
          },
        },
      }),
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#88C0D0",
          secondary: "#5E81AC",
          accent: "#8FBCBB",
          neutral: "#2E3440",
          "base-100": "#ECEFF4",
          info: "#B48EAD",
          success: "#A3BE8C",
          warning: "#EBCB8B",
          error: "#BF616A",
        },
      },
    ],
  },
};
