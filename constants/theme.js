export const colors = {
  primary: '#ffbc03',
  primaryDark: '#e0a400',
  text: '#1a1a1a',
  textMuted: '#707070',
  background: '#fff',
  surface: '#f5f5f5',
  border: '#e2e8f0',
  shadow: '#000',
  danger: '#e04b4b',

  weakness: '#e04b4b',
  resistance: '#3f9d4c',
  immunity: '#7a7a7a',

  statLow: '#e04b4b',
  statMid: '#ffbc03',
  statHigh: '#3f9d4c',

  compareA: '#3b82f6',
  compareB: '#a855f7',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  full: 999,
};

export const typography = {
  label: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  title: { fontSize: 26, fontWeight: 'bold', color: colors.text, textTransform: 'uppercase' },
};

export const cardShadow = {
  shadowColor: colors.shadow,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.12,
  shadowRadius: 6,
  elevation: 3,
};

// Escala real de stats base en los juegos (0 a 255).
export const STAT_MAX = 255;

export const statColor = (value) => {
  if (value < 60) return colors.statLow;
  if (value < 100) return colors.statMid;
  return colors.statHigh;
};
