
import { useCallback } from 'react';
import OperationResponse from "./OperationResponse";
import OperationRequest from './OperationRequest';

const useRemoteCalculatorService = ({getResult, setBalance, setResult} : {
    getResult: () => string;
    setBalance: (value: number) => void;
    setResult: (value: string) => void;
  }) => {
  
  const user = sessionStorage.getItem('username');
  const pass = sessionStorage.getItem('password');
  const endpoint = import.meta.env.VITE_APP_CALCULATOR_ENDPOINT || "";
  const basicAuth = "Basic " + btoa(user + ":" + pass);
  const header = {
    Authorization: basicAuth,
    "Content-Type": "application/json",
  };

  const doOperationRemote = useCallback(
    (req: OperationRequest) => {
      return fetch(endpoint, {
        method: "POST",
        headers: header,
        body: JSON.stringify(req),
        })
        .then((res) => res.json())
        .then((data: OperationResponse) => {
          setBalance(data.balance);
          setResult(data.operationResponse);
        })
        .catch((err: unknown) => alert("Error: " + JSON.stringify(err)));
    },
    []
  );

  const doRandomRemote = useCallback(() => {
    return fetch(endpoint, {
      method: "POST",
      headers: header,
      body: JSON.stringify({ operation: "RANDOM_STRING" }),
    })
      .then((res) => res.json())
      .then((data: OperationResponse) => {
        setBalance(data.balance);
        setResult(getResult() + data.operationResponse);
      })
      .catch((err: unknown) => alert("Error: " + JSON.stringify(err)));
  }, []);

  return { doOperationRemote, doRandomRemote };
};

export default useRemoteCalculatorService;
