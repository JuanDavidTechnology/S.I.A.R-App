import React, { createContext, useContext, useState, useCallback } from 'react';

const NavigationContext = createContext(null);

/**
 * Custom Navigation Provider for S.I.A.R. Mobile
 * Provides smooth Stack and Tab routing with history and parameter passing.
 */
export const NavigationProvider = ({ children, initialRoute = 'Home' }) => {
  const [currentScreen, setCurrentScreen] = useState(initialRoute);
  const [screenParams, setScreenParams] = useState({});
  const [history, setHistory] = useState([initialRoute]);
  const [activeTab, setActiveTab] = useState('Home');

  const navigate = useCallback((screenName, params = {}) => {
    setScreenParams(params);
    setCurrentScreen(screenName);
    setHistory((prev) => [...prev, screenName]);

    // If screen matches one of the 4 tabs, update active tab
    if (['Home', 'Reports', 'Notifications', 'Settings'].includes(screenName)) {
      setActiveTab(screenName);
    }
  }, []);

  const goBack = useCallback(() => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // remove current
      const previousScreen = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setCurrentScreen(previousScreen);

      if (['Home', 'Reports', 'Notifications', 'Settings'].includes(previousScreen)) {
        setActiveTab(previousScreen);
      }
    } else {
      // Default to Home
      setCurrentScreen('Home');
      setActiveTab('Home');
    }
  }, [history]);

  const switchTab = useCallback((tabName) => {
    setActiveTab(tabName);
    setCurrentScreen(tabName);
    setHistory([tabName]);
    setScreenParams({});
  }, []);

  const reset = useCallback((screenName, params = {}) => {
    setScreenParams(params);
    setCurrentScreen(screenName);
    setHistory([screenName]);
    if (['Home', 'Reports', 'Notifications', 'Settings'].includes(screenName)) {
      setActiveTab(screenName);
    }
  }, []);

  return (
    <NavigationContext.Provider
      value={{
        currentScreen,
        activeTab,
        screenParams,
        navigate,
        goBack,
        switchTab,
        reset,
        canGoBack: history.length > 1,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const useRoute = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useRoute must be used within a NavigationProvider');
  }
  return {
    name: context.currentScreen,
    params: context.screenParams,
  };
};

export default NavigationContext;
