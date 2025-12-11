"use client";

import {
  createContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import Keycloak, { KeycloakInstance } from "keycloak-js";
import { config } from "@/shared/utils/config";

interface AuthContextProps {
  keycloak: KeycloakInstance | null;
  authenticated: boolean;
  loading: boolean;
  token: string | null;
  username: string | null;
  userId: string | null;
  email: string | null;
  roles: string[];
  login: () => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}

export const AuthContext = createContext<AuthContextProps>({
  keycloak: null,
  authenticated: false,
  loading: true,
  token: null,
  username: null,
  userId: null,
  email: null,
  roles: [],
  login: () => {},
  logout: () => {},
  hasRole: () => false,
  hasAnyRole: () => false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [keycloak, setKeycloak] = useState<KeycloakInstance | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    const kc = new Keycloak({
      url: config.KC_URL,
      realm: config.KC_REALM,
      clientId: config.KC_CLIENT_ID,
    });

    let tokenRefreshInterval: NodeJS.Timeout | null = null;

    kc.init({
      onLoad: "check-sso",
      silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
      pkceMethod: "S256",
      checkLoginIframe: true,
    })
      .then((auth) => {
        setKeycloak(kc);
        if (auth) {
          updateAuthState(kc, true);
        } else {
          setAuthenticated(false);
          setLoading(false);
        }
      })
      .catch(() => {
        setAuthenticated(false);
        setLoading(false);
      });

    // Обработка истечения токена
    kc.onTokenExpired = () => {
      kc.updateToken(30)
        .then((refreshed) => {
          if (refreshed) {
            updateAuthState(kc, true);
          }
        })
        .catch(() => {
          // Если не удалось обновить токен, разлогиниваем пользователя
          setAuthenticated(false);
          setToken(null);
          setUsername(null);
          setUserId(null);
          setEmail(null);
          setRoles([]);
        });
    };

    // Обработка ошибок аутентификации
    kc.onAuthError = () => {
      setAuthenticated(false);
      setToken(null);
      setUsername(null);
      setUserId(null);
      setEmail(null);
      setRoles([]);
    };

    return () => {
      if (tokenRefreshInterval) {
        clearInterval(tokenRefreshInterval);
      }
    };
  }, []);

  const updateAuthState = (kc: KeycloakInstance, auth: boolean) => {
    setAuthenticated(auth);
    setToken(kc.token || null);
    setUsername(kc.tokenParsed?.preferred_username || null);
    setUserId(kc.tokenParsed?.sub || null);
    setEmail(kc.tokenParsed?.email || null);
    setRoles(kc.tokenParsed?.realm_access?.roles || []);

    setLoading(false);

    // Улучшенное обновление токена с очисткой интервала
    if (auth && kc.tokenParsed?.exp) {
      const tokenExpirationTime = (kc.tokenParsed.exp - Math.floor(Date.now() / 1000)) * 1000;
      // Обновляем токен за 30 секунд до истечения
      const refreshTime = Math.max(tokenExpirationTime - 30000, 0);

      const refreshInterval = setInterval(() => {
        kc.updateToken(30)
          .then((refreshed) => {
            if (refreshed) {
              setToken(kc.token || null);
              setUsername(kc.tokenParsed?.preferred_username || null);
              setUserId(kc.tokenParsed?.sub || null);
              setEmail(kc.tokenParsed?.email || null);
              setRoles(kc.tokenParsed?.realm_access?.roles || []);
            }
          })
          .catch(() => {
            // Если не удалось обновить токен, разлогиниваем пользователя
            setAuthenticated(false);
            setToken(null);
            setUsername(null);
            setUserId(null);
            setEmail(null);
            setRoles([]);
            clearInterval(refreshInterval);
          });
      }, refreshTime || 30000);

      return () => {
        clearInterval(refreshInterval);
      };
    }
  };

  const login = () => {
    keycloak?.login({ redirectUri: window.location.origin });
  };

  const logout = () => {
    keycloak?.logout({ redirectUri: window.location.origin });

    // Очистка состояния
    setToken(null);
    setUsername(null);
    setUserId(null);
    setEmail(null);
    setRoles([]);
    setAuthenticated(false);
  };

  const hasRole = (role: string): boolean => {
    return roles.includes(role);
  };

  const hasAnyRole = (requiredRoles: string[]): boolean => {
    return requiredRoles.some((role) => roles.includes(role));
  };

  return (
    <AuthContext.Provider
      value={{
        keycloak,
        authenticated,
        loading,
        token,
        username,
        userId,
        email,
        roles,
        login,
        logout,
        hasRole,
        hasAnyRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

