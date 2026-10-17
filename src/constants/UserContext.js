import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setAuthToken } from '../services/api';

const UserContext = createContext(null);

const TOKEN_KEY = '@siar_token';

/**
 * UserContext / UserProvider
 * Autenticación y datos del usuario de la plataforma S.I.A.R.
 * - login() / register() autentican contra la API REST (PHP + MySQL) y
 *   almacenan el token de sesión en AsyncStorage para arranques offline.
 * - Las pantallas siguen leyendo los mismos campos de siempre
 *   (userName, userEmail, userRole, farmZone) para no alterar la UI.
 */
export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('Roberto');
  const [userEmail, setUserEmail] = useState('roberto.mendoza@siar-agro.com');
  const [userRole, setUserRole] = useState('Ingeniero Agrónomo & Supervisor');
  const [farmZone, setFarmZone] = useState('Finca La Esmeralda - Sector B');
  const [userPhone, setUserPhone] = useState('+57 312 456 7890');
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Rehidratar la sesión guardada al abrir la app
  useEffect(() => {
    AsyncStorage.getItem(TOKEN_KEY)
      .then((stored) => {
        if (!stored) return;
        setAuthToken(stored);
        setToken(stored);
        setIsAuthenticated(true);
      })
      .catch(() => {});
  }, []);

  const applySession = useCallback((sessionData) => {
    const sesion = sessionData && typeof sessionData === 'object' ? sessionData : {};
    const user = sesion.user || sesion.usuario || {};
    const nextToken = sesion.token || sesion.access_token || null;

    if (nextToken) {
      setAuthToken(nextToken);
      AsyncStorage.setItem(TOKEN_KEY, nextToken).catch(() => {});
    }

    const nextRole = user.role || user.rol;
    if (nextRole) setUserRole(nextRole);
    if (user.name) setUserName(user.name);
    if (user.email) setUserEmail(user.email);
    if (user.phone || user.telefono) setUserPhone(user.phone || user.telefono);
    if (user.farm_zone || user.farmZone || user.zona) {
      setFarmZone(user.farm_zone || user.farmZone || user.zona);
    }
    if (user.profile_photo_url || user.profilePhotoUrl || user.avatar) {
      setProfilePhotoUrl(user.profile_photo_url || user.profilePhotoUrl || user.avatar);
    }
    if (user.id || user.user_id) setUserId(user.id || user.user_id);

    setToken(nextToken);
    setIsAuthenticated(Boolean(nextToken));
  }, []);

  const login = useCallback(
    async (email, password) => {
      const data = await api.post('/auth/login.php', { email, password });
      applySession(data);
      return data;
    },
    [applySession]
  );

  const register = useCallback(
    async (name, email, password) => {
      const data = await api.post('/auth/register.php', { name, email, password });
      applySession(data);
      return data;
    },
    [applySession]
  );

  const logout = useCallback(async () => {
    setAuthToken(null);
    setToken(null);
    setIsAuthenticated(false);
    await AsyncStorage.removeItem(TOKEN_KEY).catch(() => {});
  }, []);

  const updateUserName = useCallback((newName) => {
    if (newName && newName.trim().length > 0) {
      setUserName(newName.trim());
      return true;
    }
    return false;
  }, []);

  return (
    <UserContext.Provider
      value={{
        userId,
        userName,
        setUserName,
        updateUserName,
        userEmail,
        setUserEmail,
        userRole,
        setUserRole,
        farmZone,
        setFarmZone,
        userPhone,
        setUserPhone,
        profilePhotoUrl,
        setProfilePhotoUrl,
        token,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;