import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Language, translate, TranslationKey } from "../i18n/translations";
import { RouterCredentials, RouterStatus } from "../types/router";

interface AppContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
  credentials: RouterCredentials | null;
  setCredentials: (credentials: RouterCredentials | null) => void;
  routerStatus: RouterStatus | null;
  setRouterStatus: (status: RouterStatus | null) => void;
  connected: boolean;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("my");
  const [credentials, setCredentials] = useState<RouterCredentials | null>(null);
  const [routerStatus, setRouterStatus] = useState<RouterStatus | null>(null);

  const t = useCallback((key: TranslationKey) => translate(language, key), [language]);

  const value = useMemo<AppContextValue>(
    () => ({
      language,
      setLanguage,
      t,
      credentials,
      setCredentials,
      routerStatus,
      setRouterStatus,
      connected: credentials !== null && routerStatus !== null,
    }),
    [language, credentials, routerStatus, t],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProvider");
  return context;
}
