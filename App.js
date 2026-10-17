import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationProvider } from './src/navigation/NavigationContext';
import { StyleProvider } from './src/constants/StyleContext';
import { UserProvider } from './src/constants/UserContext';
import { CarritosProvider } from './src/constants/CarritosContext';
import { NotificationProvider } from './src/constants/NotificationContext';
import { SettingsProvider } from './src/constants/SettingsContext';
import { AppNavigator } from './src/navigation/AppNavigator';

/**
 * Entry Point of S.I.A.R. Mobile App
 * Sistema de Información Agrícola con Robótica
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <StyleProvider>
        <UserProvider>
          <SettingsProvider>
            <CarritosProvider>
              <NotificationProvider>
                <NavigationProvider initialRoute="Splash">
                  <View style={styles.rootContainer}>
                    <StatusBar style="auto" />
                    <AppNavigator />
                  </View>
                </NavigationProvider>
              </NotificationProvider>
            </CarritosProvider>
          </SettingsProvider>
        </UserProvider>
      </StyleProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#F8F6F0',
  },
});
