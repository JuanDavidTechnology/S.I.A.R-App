/**
 * S.I.A.R. (Sistema de Información Agrícola con Robótica)
 * Official Theme Constants and Color Palette (Pixel-Perfect Specs)
 */

export const Colors = {
  // Verdes Graduados Oficiales S.I.A.R.
  primaryDark: "#0F3818", // Verde Oscuro Principal (Textos en relieve / Saludos)
  darkGreen: "#1B3E2B", // Verde Bosque Oscuro
  leafGreen: "#3A8E38", // Verde Hoja Principal
  brightGreen: "#4CAF50", // Verde Vivo (Línea de gráficas / Pastillas Bluetooth)
  liveGreen: "#2E7D32", // Verde Indicador "En vivo"
  mintSubtitle: "#7A9E7F", // Verde Menta Suave Subtítulos (Mayo,27-2026)

  // Fondos y Curvas Orgánicas
  pastelGreen: "#B8D0B3", // Verde Pastel Fondo Curvas
  pastelGreenAlt: "#A3C39D", // Verde Pastel Alternativo
  lightPastelGreen: "#DCECC9", // Verde Pastel Claro Superpuesto
  mintLight: "#E2EFDA", // Verde Claro Mentol (Fondos de iconos)
  background: "#F8F9F5", // Fondo Base Neutro / Blanco Cálido Suave
  cardBackground: "#FFFFFF", // Fondo de tarjetas blancas elevadas

  // Textos y Estados
  textPrimary: "#0F3818", // Texto principal
  textSecondary: "#666666", // Texto secundario
  textGray: "#8E8E8E", // Gris suave (Título de gráfica)
  textMuted: "#A0ACA0", // Texto tenue

  // Alertas y Advertencias
  warningOrange: "#F35100", // Naranja de atención
  dangerRed: "#D32F2F", // Rojo desconectado / Parada
  danger: "#D32F2F",
  success: "#2E7D32",
  info: "#1976D2",
  bluetoothBlue: "#0082FC", // Azul Bluetooth

  // Bordes y Separadores
  border: "#E2E8DE",
  borderLight: "#EDF3EB",
  divider: "#E4ECE0",

  // Sombras y Transparencias
  shadow: "#0F3818",
  overlay: "rgba(10, 30, 15, 0.55)",
  glassBg: "rgba(255, 255, 255, 0.9)",
};

// 🟢 SOLUCIÓN AL ERROR: Agregamos el objeto FONTS con la propiedad 'mono'
export const FONTS = {
  regular: "System",
  medium: "System",
  bold: "System",
  mono: "System", // <- Esto evita el "Cannot read properties of undefined (reading 'mono')"
};

export const Typography = {
  headerSize: 22,
  titleSize: 18,
  bodySize: 14,
  smallSize: 12,
  microSize: 10,

  fontBold: "700",
  fontSemiBold: "600",
  fontMedium: "500",
  fontRegular: "400",
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 22,
  xl: 24,
  round: 999,
};

export const Shadows = {
  soft: {
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  medium: {
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  strong: {
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 8,
  },
};

export default {
  Colors,
  FONTS,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
};
