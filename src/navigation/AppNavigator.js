import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from './NavigationContext';
import { BottomTabBar } from './BottomTabBar';

// Screens
import { HomeScreen } from '../screens/HomeScreen';
import { ReportsScreen } from '../screens/ReportsScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ControlManualScreen } from '../screens/ControlManualScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { TermsScreen } from '../screens/TermsScreen';
import { ResetPasswordScreen } from '../screens/ResetPasswordScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { ContactScreen } from '../screens/ContactScreen';

/**
 * AppNavigator Component
 * Orchestrates Tab and Stack navigation seamlessly for S.I.A.R. Mobile
 */
export const AppNavigator = () => {
  const { currentScreen } = useNavigation();

  // Determine if Bottom Tab Bar should be visible
  const isTabScreen = ['Home', 'Reports', 'Notifications', 'Settings'].includes(currentScreen);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return <HomeScreen />;
      case 'Reports':
        return <ReportsScreen />;
      case 'Notifications':
        return <NotificationsScreen />;
      case 'Settings':
        return <SettingsScreen />;
      case 'ConsolaManual':
        return <ControlManualScreen />;
      case 'Profile':
        return <ProfileScreen />;
      case 'Terms':
        return <TermsScreen />;
      case 'ResetPassword':
        return <ResetPasswordScreen />;
      case 'Onboarding':
        return <OnboardingScreen />;
      case 'Splash':
        return <SplashScreen />;
      case 'Login':
        return <LoginScreen />;
      case 'Register':
        return <RegisterScreen />;
      case 'Contact':
        return <ContactScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenArea}>{renderScreen()}</View>
      {isTabScreen && <BottomTabBar />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F0',
  },
  screenArea: {
    flex: 1,
  },
});

export default AppNavigator;
