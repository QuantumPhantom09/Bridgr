export const colors = {
  background: '#111827', // Dark Gray/Blue
  surface: '#1F2937',
  primary: '#3B82F6',    // Blue
  secondary: '#10B981',  // Green (Success)
  danger: '#EF4444',     // Red (Fraud)
  warning: '#F59E0B',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  border: '#374151'
};

export const spacing = {
  xs: 4, s: 8, m: 16, l: 24, xl: 32
};

export const typography = {
  header: { fontSize: 24, fontWeight: 'bold', color: colors.text },
  subheader: { fontSize: 18, fontWeight: '600', color: colors.text },
  body: { fontSize: 14, color: colors.textSecondary },
  mono: { fontFamily: 'Courier', fontSize: 12 }
};
