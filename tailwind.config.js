/** Colours come from CSS variables (see src/index.css) so light, dark and high-contrast themes all work. */
const v = (n) => `var(--${n})`;
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: v('bg'), surface: v('surface'), surface2: v('surface2'), ink: v('ink'), muted: v('muted'), line: v('line'),
        brand: v('brand'), 'brand-ink': v('brand-ink'), 'brand-soft': v('brand-soft'), red: v('red'),
        danger: v('danger'), 'danger-ink': v('danger-ink'), 'danger-soft': v('danger-soft'),
        warn: v('warn'), 'warn-soft': v('warn-soft'), ok: v('ok'), 'ok-soft': v('ok-soft'),
      },
      fontFamily: { sans: ['"Atkinson Hyperlegible"', '"Noto Sans Devanagari"', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
