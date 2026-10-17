import React, { useMemo } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

// Logo a color completo (sobre fondo blanco: Splash / Bienvenida)
const LOGO_COLOR = require('../../assets/images/logo_de_App.jpg');
// Logo sin fondo (sobre zonas verdes: Header de Login / Registro)
const LOGO_TRANSPARENT = require('../../assets/images/logo_sin_fondo.png');

/**
 * AgroLogoImage Component
 * Muestra el logo oficial S.I.A.R. respetando su relación de aspecto para
 * nunca deformarse.
 * - Por defecto usa el logo a color sobre fondos blancos.
 * - OnDark usa la versión sin fondo para integrarse sobre los headers verdes.
 */
export const AgroLogoImage = ({
  size = 120,
  showSubtitle = false,
  onDark = false,
  subtitleColor = '#555555',
  style,
}) => {
  const source = onDark ? LOGO_TRANSPARENT : LOGO_COLOR;
  const ratio = useMemo(() => {
    try {
      const src = Image.resolveAssetSource(source);
      if (src && src.width && src.height) {
        return src.width / src.height;
      }
    } catch (_) {}
    return 1;
  }, [source]);

  const width = size * ratio;

  return (
    <View style={[styles.container, style]}>
      <Image source={source} style={{ width, height: size }} resizeMode="contain" />

      {showSubtitle && (
        <Text style={[styles.subtitle, { color: subtitleColor }]}>
          Sistema de Información Agrícola con Robótica
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 240,
  },
});

export default AgroLogoImage;
