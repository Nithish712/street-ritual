import { createContext, useContext, useState, useEffect } from 'react';
import { getCategories, getStoreSettings } from '../api';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, setRes] = await Promise.all([
          getCategories(),
          getStoreSettings()
        ]);
        setCategories(catRes.data.data || []);
        setSettings(setRes.data.data || {});
      } catch (err) {
        console.error('Error fetching store context:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <StoreContext.Provider value={{ categories, settings, loading }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
