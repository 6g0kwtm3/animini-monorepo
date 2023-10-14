import type { Config } from "tailwindcss"
//@ts-ignore
import { normalize } from "tailwindcss/lib/util/dataTypes"
//@ts-ignore
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette"
//@ts-ignore
import withAlphaVariable from "tailwindcss/lib/util/withAlphaVariable"
import plugin from "tailwindcss/plugin"

import themes from "./themes.json"

import colors from "./colors.json"

export default {
  content: ["app/**/*.tsx"],

  theme: {
    screens: {
      sm: "600px",
      md: "840px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    borderRadius: {
      none: "0",
      xs: "0.25rem",
      sm: "0.5rem",
      md: "0.75rem",
      DEFAULT: "0.75rem",
      l: "1rem",
      xl: "1.75rem",
      full: "9999px",
      inherit: "inherit",
    },
    state: {
      none: "0",
      hover: "8%",
      focus: "12%",
      pressed: "12%",
      dragged: "16%",
    },
    elevation: {
      "0": 0,
      "1": "5%",
      "2": "8%",
      "3": "11%",
      "4": "12%",
      "5": "14%",
    },
    fontSize: {
      "display-lg": [
        "3.5625rem",
        {
          lineHeight: "1.1228070175438596",
          letterSpacing: "0",
          fontWeight: 400,
        },
      ],
      "display-md": [
        "2.8125rem",
        {
          lineHeight: "1.1555555555555554",
          letterSpacing: "0",
          fontWeight: 400,
        },
      ],
      "display-sm": [
        "2.25rem",
        {
          lineHeight: "1.2222222222222223",
          letterSpacing: "0",
          fontWeight: 400,
        },
      ],
      "headline-lg": [
        "2rem",
        { lineHeight: "1.25", letterSpacing: "0", fontWeight: 400 },
      ],
      "headline-md": [
        "1.75rem",
        {
          lineHeight: "1.2857142857142858",
          letterSpacing: "0",
          fontWeight: 400,
        },
      ],
      "headline-sm": [
        "1.5rem",
        {
          lineHeight: "1.3333333333333333",
          letterSpacing: "0",
          fontWeight: 400,
        },
      ],
      "title-lg": [
        "1.375rem",
        {
          lineHeight: "1.2727272727272727",
          letterSpacing: "0",
          fontWeight: 400,
        },
      ],
      "title-md": [
        "1rem",
        { lineHeight: "1.5", letterSpacing: "0.009375em", fontWeight: 500 },
      ],
      "title-sm": [
        "0.875rem",
        {
          lineHeight: "1.4285714285714286",
          letterSpacing: "0.0071428571428571435em",
          fontWeight: 500,
        },
      ],
      "label-lg": [
        "0.875rem",
        {
          lineHeight: "1.4285714285714286",
          letterSpacing: "0.0071428571428571435em",
          fontWeight: 500,
        },
      ],
      "label-md": [
        "0.75rem",
        {
          lineHeight: "1.3333333333333333",
          letterSpacing: "0.041666666666666664em",
          fontWeight: 500,
        },
      ],
      "label-sm": [
        "0.6875rem",
        {
          lineHeight: "1.6666666666666667",
          letterSpacing: "0.03125rem",
          fontWeight: 500,
        },
      ],
      "body-lg": [
        "1rem",
        { lineHeight: "1.5", letterSpacing: "0.03125rem", fontWeight: 400 },
      ],
      "body-md": [
        "0.875rem",
        {
          lineHeight: "1.4285714285714286",
          letterSpacing: "0.017857142857142856em",
          fontWeight: 400,
        },
      ],
      "body-sm": [
        "0.75rem",
        {
          lineHeight: "1.3333333333333333",
          letterSpacing: "0.03333333333333333em",
          fontWeight: 400,
        },
      ],
    },
    colors: Object.assign(
      Object.fromEntries(
        Object.keys(colors.light).map((key) => [
          key,
          `rgb(var(--${key}) / <alpha-value>)`,
        ])
      ),
      { transparent: "transparent" }
    ),
    extend: {},
  },
  plugins: [
    plugin(
      ({ addUtilities, matchComponents, addBase, matchUtilities, theme }) => {
        function isKeyOf<T extends {}>(
          key: string | number | symbol,
          value: T
        ): key is keyof T {
          return key in value
        }

        addBase({
          ":root": Object.assign(
            Object.fromEntries(
              Object.entries(colors.light).map(([key, value]) => [
                `--${key}`,
                isKeyOf(value, themes) ? themes[value] : `var(--${value})`,
              ])
            ),
            {
              fontSize: "16px",
            }
          ),
          "@media (prefers-color-scheme: dark)": {
            ":root": Object.assign(
              Object.fromEntries(
                Object.entries(colors.dark).map(([key, value]) => [
                  `--${key}`,
                  isKeyOf(value, themes) ? themes[value] : `var(--${value})`,
                ])
              ),
              { "color-scheme": "dark" }
            ),
          },
        })

        const surfaceTint = theme("colors.surface-tint", "transparent").replace(
          "<alpha-value>",
          "var(--mdi-elevation-opacity)"
        )

        const backgroundImage = `linear-gradient(${surfaceTint}, ${surfaceTint}), linear-gradient(var(--mdi-state-color), var(--mdi-state-color))`

        addUtilities({
          ".surface": {
            "--mdi-elevation-opacity": "0",
            "--mdi-state-color": "transparent",
            backgroundImage,
          },
        })

        matchUtilities(
          {
            elevation: (opacity) => ({
              "--mdi-elevation-opacity": opacity,
            }),
          },
          {
            values: theme("elevation") || {},
            type: ["percentage"],
          }
        )

        matchUtilities(
          {
            state: (opacity) => ({
              "--mdi-state-opacity": opacity,
            }),
          },
          {
            values: theme("state") || {},
            type: ["percentage"],
          }
        )

        matchUtilities(
          {
            state: (color) => ({
              ...withAlphaVariable({
                color,
                property: "--mdi-state-color",
                variable: "--mdi-state-opacity",
              }),
              "--mdi-state-opacity": 0,
            }),
          },
          {
            values: flattenColorPalette(theme("colors")),
            type: ["color", "any"],
          }
        )
      }
    ),
    plugin(({ addUtilities }) => {
      addUtilities({
        ".text-wrap": { "text-wrap": "wrap" },
        ".text-nowrap": { "text-wrap": "nowrap" },
        ".text-balance": { "text-wrap": "balance" },
        ".text-pretty": { "text-wrap": "pretty" },
      })
    }),
    plugin(({ matchVariant }) => {
      matchVariant("has", (value) => `&:has(${normalize(value)})`, {
        values: {},
      })
      matchVariant(
        "group-has",
        (value, { modifier }) =>
          modifier
            ? `:merge(.group\\/${modifier}):has(${normalize(value)}) &`
            : `:merge(.group):has(${normalize(value)}) &`,
        { values: {} }
      )
      matchVariant(
        "peer-has",
        (value, { modifier }) =>
          modifier
            ? `:merge(.peer\\/${modifier}):has(${normalize(value)}) ~ &`
            : `:merge(.peer):has(${normalize(value)}) ~ &`,
        { values: {} }
      )
    }),
    plugin(({ addComponents, matchComponents, addVariant, matchVariant }) => {
      matchComponents({}, {})

      addVariant("error", ["&:has(:invalid)", "&:has([aria-invalid=true])"])
      addVariant("group-error", [
        ":merge(.group):has(:invalid) &",
        ":merge(.group):has([aria-invalid=true]) &",
      ])

      addComponents({})
    }),
  ],
} satisfies Config
