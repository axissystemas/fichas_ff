export interface ThemeConfig {
  bodyClass: string;
  cardClass: string;
  headerFontClass: string;
  bodyFontClass: string;
  isDark: boolean;
}

export function getThemeConfig(theme: 'papyrus' | 'night', gamebook?: string): ThemeConfig {
  const isForest = gamebook === 'A Floresta da Destruição';
  const isSciFi = gamebook === 'Nave Espacial Traveller' || 
                  gamebook === 'As Coligações de Kether' || 
                  gamebook === 'Robô Comando';
  const isHero = gamebook === 'Encontro Marcado com o M.E.D.O.';

  // Default theme settings
  let bodyClass = theme === 'papyrus' ? 'theme-papyrus' : 'theme-night';
  let cardClass = theme === 'papyrus' ? 'theme-papyrus-card' : 'theme-night-card';
  let isDark = theme === 'night';

  // Override for A Floresta da Destruição (Forest theme overrides Papyrus and modifies Night theme subtly)
  if (isForest) {
    if (theme === 'papyrus') {
      bodyClass = 'theme-forest';
      cardClass = 'theme-forest-card';
      isDark = true;
    } else {
      // For Night mode in Forest, we can keep theme-night but add a slight green tint
      bodyClass = 'theme-night bg-gradient-to-b from-[#09150f] to-[#0b0f19]';
      cardClass = 'theme-night-card border-emerald-900/35 hover:border-emerald-700/50';
    }
  }

  // Fonts selection based on gamebook genre
  let headerFontClass = 'font-cinzel';
  let bodyFontClass = 'font-serif';

  if (isSciFi) {
    headerFontClass = 'font-share-mono';
    bodyFontClass = 'font-sans';
  } else if (isHero) {
    headerFontClass = 'font-bangers';
    bodyFontClass = 'font-sans';
  } else {
    // Medieval / Fantasy
    headerFontClass = 'font-almendra';
    bodyFontClass = 'font-serif';
  }

  return {
    bodyClass,
    cardClass,
    headerFontClass,
    bodyFontClass,
    isDark,
  };
}
