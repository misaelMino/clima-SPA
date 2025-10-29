import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { getRobotTransactions, getRobotBalance } from "../api/robotApi";

export const GlobalContext = createContext([]);

export const GlobalProvider = ({ children }) => {
  const { user, isAuthenticated, getToken } = useAuth();

  const [loadingData, setLoadingData] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);

  const refreshData = async () => {
    if (!isAuthenticated || !user?.email) return;
    setLoadingData(true);
    try {
      const token = await getToken();
      const [resT, resB] = await Promise.all([
        getRobotTransactions({ email: user.email, token }),
        getRobotBalance({ email: user.email, token }),
      ]);
      setTransactions(resT || []);
      setBalance(resB?.amount ?? 0);
    } catch (e) {
      console.error("Error loading data", e);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => { refreshData(); }, [isAuthenticated]);

  return (
    <GlobalContext.Provider value={{ transactions, balance, refreshData, loadingData }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);
