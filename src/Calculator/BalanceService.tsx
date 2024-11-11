
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface BalanceServiceProps {
  setBalance: (balance: number) => void;
  onLogout: () => void;
}

const BalanceService: React.FC<BalanceServiceProps> = ({ setBalance, onLogout }) => {
  const navigate = useNavigate();
  const user = sessionStorage.getItem('username') || '';
  const pass = sessionStorage.getItem('password');
  const logEndpoint = import.meta.env.VITE_APP_LOG_ENDPOINT || '';
  const balanceEndpoint = `${logEndpoint}/${encodeURIComponent(user)}/last-balance`;

  const basicAuth = "Basic " + btoa(user + ":" + pass);
  const header = {
    Authorization: basicAuth,
    "Content-Type": "application/json",
  };

  const fetchLastBalance = async (): Promise<void> => {
    try {
      const response = await fetch(balanceEndpoint, {
        headers: new Headers(header),
        credentials: "include",
      });
      const data = await response.json();
      setBalance(+data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
        sessionStorage.setItem('userrname', '');
        sessionStorage.setItem('password', '');
        onLogout();
        navigate('/');
    }
  };

  useEffect(() => {
    fetchLastBalance();
  }, []);

  return null;
};

export default BalanceService;
