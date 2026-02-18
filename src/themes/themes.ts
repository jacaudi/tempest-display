import type { ThemeName } from '../types/weather';

export interface ThemeDefinition {
  name: ThemeName;
  label: string;
  description: string;
  vars: Record<string, string>;
  backgroundImage: string;
}

export const themes: Record<ThemeName, ThemeDefinition> = {
  'liquid-glass': {
    name: 'liquid-glass',
    label: 'Liquid Glass',
    description: 'Frosted glass panels over a serene sky gradient — translucent, luminous, modern.',
    backgroundImage: 'linear-gradient(135deg, #74b9ff 0%, #a29bfe 40%, #fd79a8 100%)',
    vars: {
      '--bg-primary': 'rgba(255, 255, 255, 0.12)',
      '--bg-secondary': 'rgba(255, 255, 255, 0.08)',
      '--bg-card': 'rgba(255, 255, 255, 0.15)',
      '--bg-card-hover': 'rgba(255, 255, 255, 0.22)',
      '--border-color': 'rgba(255, 255, 255, 0.25)',
      '--border-highlight': 'rgba(255, 255, 255, 0.5)',
      '--text-primary': '#ffffff',
      '--text-secondary': 'rgba(255, 255, 255, 0.8)',
      '--text-muted': 'rgba(255, 255, 255, 0.55)',
      '--accent-color': '#ffffff',
      '--accent-glow': 'rgba(255, 255, 255, 0.3)',
      '--shadow-color': 'rgba(0, 0, 0, 0.1)',
      '--shadow-heavy': 'rgba(0, 0, 0, 0.2)',
      '--glass-blur': '20px',
      '--glass-blur-heavy': '40px',
      '--glass-saturate': '1.8',
      '--card-radius': '20px',
      '--success-color': '#00e676',
      '--warning-color': '#ffab40',
      '--danger-color': '#ff5252',
      '--info-color': '#40c4ff',
    },
  },
  'midnight-aurora': {
    name: 'midnight-aurora',
    label: 'Midnight Aurora',
    description: 'Deep indigo sky with northern lights — vivid accents against rich darkness.',
    backgroundImage: 'linear-gradient(160deg, #0a0a2e 0%, #1a1a4e 30%, #0d3b3b 60%, #1a0a2e 100%)',
    vars: {
      '--bg-primary': 'rgba(10, 10, 46, 0.6)',
      '--bg-secondary': 'rgba(10, 10, 46, 0.4)',
      '--bg-card': 'rgba(20, 20, 60, 0.5)',
      '--bg-card-hover': 'rgba(30, 30, 80, 0.6)',
      '--border-color': 'rgba(100, 220, 180, 0.2)',
      '--border-highlight': 'rgba(100, 220, 180, 0.5)',
      '--text-primary': '#e0f0ff',
      '--text-secondary': 'rgba(224, 240, 255, 0.75)',
      '--text-muted': 'rgba(224, 240, 255, 0.45)',
      '--accent-color': '#64dcb4',
      '--accent-glow': 'rgba(100, 220, 180, 0.3)',
      '--shadow-color': 'rgba(0, 0, 0, 0.3)',
      '--shadow-heavy': 'rgba(0, 0, 0, 0.5)',
      '--glass-blur': '24px',
      '--glass-blur-heavy': '48px',
      '--glass-saturate': '1.4',
      '--card-radius': '16px',
      '--success-color': '#64dcb4',
      '--warning-color': '#ffd166',
      '--danger-color': '#ef476f',
      '--info-color': '#118ab2',
    },
  },
  'desert-sunset': {
    name: 'desert-sunset',
    label: 'Desert Sunset',
    description: 'Warm amber and terracotta with golden hour tones — cozy, natural, grounded.',
    backgroundImage: 'linear-gradient(150deg, #f7a072 0%, #d4605a 35%, #8b3a62 70%, #2d1b4e 100%)',
    vars: {
      '--bg-primary': 'rgba(50, 20, 30, 0.4)',
      '--bg-secondary': 'rgba(50, 20, 30, 0.25)',
      '--bg-card': 'rgba(80, 30, 40, 0.35)',
      '--bg-card-hover': 'rgba(100, 40, 50, 0.45)',
      '--border-color': 'rgba(247, 160, 114, 0.3)',
      '--border-highlight': 'rgba(247, 160, 114, 0.6)',
      '--text-primary': '#fff0e6',
      '--text-secondary': 'rgba(255, 240, 230, 0.8)',
      '--text-muted': 'rgba(255, 240, 230, 0.5)',
      '--accent-color': '#f7a072',
      '--accent-glow': 'rgba(247, 160, 114, 0.3)',
      '--shadow-color': 'rgba(0, 0, 0, 0.2)',
      '--shadow-heavy': 'rgba(0, 0, 0, 0.4)',
      '--glass-blur': '18px',
      '--glass-blur-heavy': '36px',
      '--glass-saturate': '1.6',
      '--card-radius': '18px',
      '--success-color': '#a8e06c',
      '--warning-color': '#ffc857',
      '--danger-color': '#e63946',
      '--info-color': '#70a1d7',
    },
  },
  'arctic-frost': {
    name: 'arctic-frost',
    label: 'Arctic Frost',
    description: 'Icy blues and crisp whites — clean, minimal, and cool.',
    backgroundImage: 'linear-gradient(140deg, #cce5ff 0%, #99ccff 30%, #6699cc 60%, #336699 100%)',
    vars: {
      '--bg-primary': 'rgba(255, 255, 255, 0.2)',
      '--bg-secondary': 'rgba(255, 255, 255, 0.12)',
      '--bg-card': 'rgba(255, 255, 255, 0.25)',
      '--bg-card-hover': 'rgba(255, 255, 255, 0.35)',
      '--border-color': 'rgba(255, 255, 255, 0.35)',
      '--border-highlight': 'rgba(255, 255, 255, 0.7)',
      '--text-primary': '#1a3a5c',
      '--text-secondary': 'rgba(26, 58, 92, 0.75)',
      '--text-muted': 'rgba(26, 58, 92, 0.5)',
      '--accent-color': '#1a6bc4',
      '--accent-glow': 'rgba(26, 107, 196, 0.25)',
      '--shadow-color': 'rgba(26, 58, 92, 0.08)',
      '--shadow-heavy': 'rgba(26, 58, 92, 0.15)',
      '--glass-blur': '22px',
      '--glass-blur-heavy': '44px',
      '--glass-saturate': '2.0',
      '--card-radius': '22px',
      '--success-color': '#2ecc71',
      '--warning-color': '#f39c12',
      '--danger-color': '#e74c3c',
      '--info-color': '#3498db',
    },
  },
};

export function applyTheme(name: ThemeName) {
  const theme = themes[name];
  if (!theme) return;

  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  document.body.style.backgroundImage = theme.backgroundImage;
}

export function getThemeList() {
  return Object.values(themes).map(({ name, label, description }) => ({
    name,
    label,
    description,
  }));
}
