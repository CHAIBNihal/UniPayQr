import { useContext, createContext, useState, useEffect } from "react";
import { router } from "expo-router";

const ContextProvider = createContext();

export const useGlobalProvider = () => {

  const context = useContext(ContextProvider);
  if (!context) {
    throw new Error("useGlobalProvider must be used within a GlobalProvider");
  }
  return context;
};

const GlobalProvider = ({ children }) => {
  const [sessionContext, setSessionContext] = useState(null);
  const [logged, setLogged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false); 
 
  if (!children) {
    throw new Error("GlobalProvider must have children components!");
  }
  useEffect(() => {
    if (loading) return; // Éviter une boucle infinie si `loading` change
    if (sessionContext) {
     
      router.replace("/home");
    } else {
      router.replace("/");
    }
  }, [sessionContext, loading]);

  return (
    <ContextProvider.Provider
      value={{
        sessionContext,
        setSessionContext,
        logged,
        setLogged,
        loading,
        setLoading,
       setActive,
       active
      }}
    >
      {children}
    </ContextProvider.Provider>
  );
};

export default GlobalProvider;
